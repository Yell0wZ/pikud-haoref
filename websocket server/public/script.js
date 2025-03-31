document.addEventListener('DOMContentLoaded', () => {
    // אלמנטים בדף
    const statusElement = document.getElementById('status');
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const usernameInput = document.getElementById('username-input');
    const setUsernameButton = document.getElementById('set-username');
    
    // משתנים גלובליים
    let socket;
    let username = 'אנונימי';
    let reconnectInterval;
    let lastSentMessage = null; // משתנה לשמירת ההודעה האחרונה שנשלחה
    
    // הגדרת כתובת השרת ופורט באופן ידני - שנה לפי הצורך
    const SERVER_IP = "172.20.10.7";  // שנה לכתובת ה-IP האמיתית של השרת שלך
    const SERVER_PORT = "443";       // שנה לפורט האמיתי של השרת שלך
    
    // התחברות לשרת WebSocket
    function connectWebSocket() {
        // בדיקה באיזה פרוטוקול להשתמש
        const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        
        // יצירת כתובת WebSocket עם ה-IP והפורט שהוגדרו
        const wsUrl = `${wsProtocol}${SERVER_IP}:${SERVER_PORT}`;
        
        console.log(`מנסה להתחבר לשרת ב-${wsUrl}`);
        
        // ניסיון התחברות
        try {
            socket = new WebSocket(wsUrl);
            
            // טיפול באירוע פתיחת החיבור
            socket.addEventListener('open', () => {
                console.log('מחובר לשרת WebSocket');
                statusElement.textContent = 'מחובר לשרת';
                statusElement.className = 'connection-status connected';
                
                // ניקוי טיימר של התחברות מחדש אם קיים
                if (reconnectInterval) {
                    clearInterval(reconnectInterval);
                    reconnectInterval = null;
                }
                
                // שליחת שם המשתמש לשרת אם יש
                if (username !== 'אנונימי') {
                    sendUsername();
                }
            });
            
            // טיפול בהודעות נכנסות
            socket.addEventListener('message', (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleIncomingMessage(data);
                } catch (error) {
                    console.error('שגיאה בפענוח הודעה:', error);
                }
            });
            
            // טיפול בסגירת החיבור
            socket.addEventListener('close', () => {
                console.log('החיבור לשרת נסגר');
                statusElement.textContent = 'מנותק מהשרת. מנסה להתחבר מחדש...';
                statusElement.className = 'connection-status disconnected';
                
                // ניסיון התחברות מחדש לאחר 5 שניות
                if (!reconnectInterval) {
                    reconnectInterval = setInterval(connectWebSocket, 5000);
                }
            });
            
            // טיפול בשגיאות
            socket.addEventListener('error', (error) => {
                console.error('שגיאת WebSocket:', error);
            });
            
        } catch (error) {
            console.error('שגיאה ביצירת חיבור WebSocket:', error);
        }
    }
    
    // טיפול בהודעה נכנסת
    function handleIncomingMessage(data) {
        switch (data.type) {
            case 'message':
                // בדיקה אם זו הודעה שאנחנו שלחנו ברגע זה
                if (lastSentMessage && lastSentMessage.text === data.text && 
                    (new Date().getTime() - lastSentMessage.timestamp) < 2000) {
                    // זו הודעה שאנחנו שלחנו, מתעלמים ממנה כי כבר הצגנו אותה
                    console.log('התעלמות מהודעה שכבר הוצגה');
                    lastSentMessage = null; // איפוס לאחר שהתעלמנו ממנה
                } else {
                    // זו הודעה חדשה ממישהו אחר
                    addMessageToChat(data.text, false, data.time);
                }
                break;
            
            case 'userCount':
                updateUserCount(data.count);
                break;
            
            default:
                console.log('סוג הודעה לא מוכר:', data.type);
        }
    }
    
    // הוספת הודעה לצ'אט
    function addMessageToChat(text, isSent = false, timestamp = null) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isSent ? 'message-sent' : 'message-received'}`;
        
        // יצירת אלמנט טקסט
        const textElement = document.createElement('div');
        textElement.textContent = text;
        messageElement.appendChild(textElement);
        
        // הוספת זמן אם יש
        if (timestamp) {
            const time = new Date(timestamp);
            const timeElement = document.createElement('div');
            timeElement.className = 'message-time';
            timeElement.textContent = `${time.getHours()}:${String(time.getMinutes()).padStart(2, '0')}`;
            messageElement.appendChild(timeElement);
        }
        
        // הוספת ההודעה לחלון הצ'אט
        messagesContainer.appendChild(messageElement);
        
        // גלילה לתחתית
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // עדכון מספר המשתמשים המחוברים
    function updateUserCount(count) {
        // אפשר להוסיף פה קוד לעדכון מספר המשתמשים בממשק
        console.log(`משתמשים מחוברים: ${count}`);
    }
    
    // שליחת הודעה לשרת
    function sendMessage() {
        const text = messageInput.value.trim();
        
        if (text && socket && socket.readyState === WebSocket.OPEN) {
            // שמירת ההודעה האחרונה ששלחנו
            lastSentMessage = {
                text: text,
                timestamp: new Date().getTime()
            };
            
            // שליחה לשרת
            socket.send(text);
            
            // הוספה לחלון הצ'אט כהודעה נשלחה
            addMessageToChat(text, true, new Date().toISOString());
            
            // ניקוי תיבת הטקסט
            messageInput.value = '';
        }
    }
    
    // שליחת שם משתמש לשרת
    function sendUsername() {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'username',
                data: username
            }));
        }
    }
    
    // אירועי לחיצה
    sendButton.addEventListener('click', sendMessage);
    
    setUsernameButton.addEventListener('click', () => {
        const newUsername = usernameInput.value.trim();
        if (newUsername) {
            username = newUsername;
            sendUsername();
            alert(`שם המשתמש שונה ל: ${username}`);
        }
    });
    
    // שליחת הודעה בלחיצה על Enter
    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });
    
    // שליחת שם משתמש בלחיצה על Enter
    usernameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            setUsernameButton.click();
        }
    });
    
    // התחלת החיבור
    connectWebSocket();
});