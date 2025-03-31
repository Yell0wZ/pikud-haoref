const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const os = require('os'); 

const app = express();
const port = 443;

app.use(express.static(path.join(__dirname, 'public')));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('משתמש חדש התחבר');
  

    broadcastUserCount();
    

    ws.on('message', (message) => {
      try {
     
        broadcastMessage(message.toString());
      } catch (error) {
        console.error('שגיאה:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('משתמש התנתק');
      broadcastUserCount();
    });
});

function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'message',
        text: message,
        time: new Date().toISOString()
      }));
    }
  });
}

// פונקציה להפצת מספר המשתמשים המחוברים
function broadcastUserCount() {
  const count = wss.clients.size;
  
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'userCount',
        count: count
      }));
    }
  });
}


function getPrimaryIP() {
  const networkInterfaces = os.networkInterfaces();
  const commonInterfaces = ['Ethernet', 'Wi-Fi', 'eth0', 'wlan0', 'en0', 'WLAN'];
  for (const name of commonInterfaces) {
    if (networkInterfaces[name]) {
      const ipv4 = networkInterfaces[name].find(net => net.family === 'IPv4' && !net.internal);
      if (ipv4) {
        return ipv4.address;
      }
    }
  }
  

  for (const name of Object.keys(networkInterfaces)) {
    const ipv4 = networkInterfaces[name].find(net => net.family === 'IPv4' && !net.internal);
    if (ipv4) {
      return ipv4.address;
    }
  }
  
  
  return '127.0.0.1';
}

server.listen(port, () => {
  const ipAddress = getPrimaryIP();
  console.log(`שרת פועל על פורט ${port}`);
  console.log(`כתובת ה-IP המקומית: ${ipAddress}`);
  console.log(`גישה לשרת דרך: http://${ipAddress}:${port}`);
});

// app.get('/', (req, res) => {
//  res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });