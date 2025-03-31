import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import styles from './chat.module.scss';
import WebSocketService from './WebSocketService';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  time: string;
  isSelf: boolean;
}

const webSocketService = WebSocketService.getInstance();

export const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [username, setUsername] = useState<string>('משתמש אנונימי');
  const [connectionStatus, setConnectionStatus] = useState<string>('מתחבר...');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const statusCleanup = webSocketService.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    const messageCleanup = webSocketService.onMessage((data) => {
      if (data.type === 'message' && data.text) {
        const newMsg: ChatMessage = {
          id: generateId(),
          sender: data.sender || 'אנונימי',
          message: data.text,
          time: formatTime(data.time || new Date().toISOString()),
          isSelf: false
        };

        setMessages(prevMessages => [...prevMessages, newMsg]);
      }
    });

    const sentCleanup = webSocketService.onMessageSent((data) => {
      const sentMessage: ChatMessage = {
        id: generateId(),
        sender: data.sender,
        message: data.text,
        time: formatTime(data.time),
        isSelf: true
      };

      setMessages(prevMessages => [...prevMessages, sentMessage]);
    });

    setUsername(webSocketService.getUsername());

    return () => {
      statusCleanup();
      messageCleanup();
      sentCleanup();
    };
  }, []);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      webSocketService.sendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const updateUsername = () => {
    if (username.trim() && username !== webSocketService.getUsername()) {
      webSocketService.setUsername(username);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.iconContainer}>
            <MessageSquare className={styles.icon} />
          </div>
          <div>
            <h2 className={styles.title}>Group Chat</h2>
            <div className={connectionStatus.includes('מחובר') ? 
              styles.statusConnected : styles.statusDisconnected}>
              {connectionStatus}
            </div>
          </div>
          <div className={styles.usernameSection}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="השם שלך"
              className={styles.usernameInput}
            />
            <button 
              onClick={updateUsername}
              className={styles.usernameButton}
            >
              שמור שם
            </button>
          </div>
        </div>
      </div>
      
      <div 
        ref={messagesContainerRef}
        className={styles.messageList}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`${styles.messageContainer} ${msg.isSelf ? styles.self : styles.other}`}
          >
            <div 
              className={`${styles.messageContent} ${msg.isSelf ? styles.self : styles.other}`}
            >
              <div className={styles.messageHeader}>
                <p className={`${styles.sender} ${msg.isSelf ? styles.self : styles.other}`}>
                  {msg.sender}
                </p>
                <p className={`${styles.time} ${msg.isSelf ? styles.self : styles.other}`}>
                  {msg.time}
                </p>
              </div>
              <p className={`${styles.messageText} ${msg.isSelf ? styles.self : styles.other}`}>
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.inputContainer}>
        <div className={styles.inputWrapper}>
          <div className={styles.input}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
            />
          </div>
          <button 
            className={styles.sendButton}
            onClick={sendMessage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
