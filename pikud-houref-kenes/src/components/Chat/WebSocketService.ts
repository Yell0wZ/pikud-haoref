// WebSocketService.ts

const SERVER_IP = "localhost";
const SERVER_PORT = "8080";

export interface MessageData {
  type: string;
  text?: string;
  sender?: string;
  time?: string;
  count?: number;
  [key: string]: any;
}

type Listener<T = any> = (data: T) => void;

class SimpleEvents {
  private listeners: Record<string, Listener[]> = {};

  on(event: string, callback: Listener): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event: string, data?: any): void {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach(callback => callback(data));
  }
}

class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimeout: number | null = null;
  private events = new SimpleEvents();
  private username = 'Anonymous';
  private connected = false;
  private lastSentMessage: { text: string, timestamp: number } | null = null;

  private static instance: WebSocketService;
  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private constructor() {
    this.connect();
  }

  private connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN)) {
      return;
    }

    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
      const wsUrl = `${wsProtocol}${SERVER_IP}:${SERVER_PORT}`;
      
      console.log(`Connecting to ${wsUrl}`);
      this.events.emit('statusChange', 'Connecting...');

      this.socket = new WebSocket(wsUrl);

      this.socket.addEventListener('open', this.handleOpen);
      this.socket.addEventListener('message', this.handleMessage);
      this.socket.addEventListener('close', this.handleClose);
      this.socket.addEventListener('error', this.handleError);

    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.events.emit('statusChange', 'Connection error');
      this.reconnect(5000);
    }
  }

  private handleOpen = (): void => {
    console.log('WebSocket connected');
    this.connected = true;
    this.events.emit('statusChange', 'Connected');

    if (this.reconnectTimeout) {
      window.clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.username !== 'Anonymous') {
      this.sendUsername();
    }
  };

  private handleMessage = (event: MessageEvent): void => {
    try {
      const data = JSON.parse(event.data) as MessageData;

      if (data.type === 'message' && data.text && this.lastSentMessage &&
          this.lastSentMessage.text === data.text &&
          (Date.now() - this.lastSentMessage.timestamp) < 2000) {
        console.log('Ignoring duplicate message');
        this.lastSentMessage = null;
      } else {
        this.events.emit('message', data);
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  };

  private handleClose = (): void => {
    console.log('WebSocket connection closed');
    this.connected = false;
    this.events.emit('statusChange', 'Disconnected. Reconnecting...');
    this.reconnect(5000);
  };

  private handleError = (error: Event): void => {
    console.error('WebSocket error:', error);
    this.events.emit('statusChange', 'Connection error');
  };

  private reconnect(timeout: number): void {
    if (this.reconnectTimeout) {
      window.clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = window.setTimeout(() => {
      this.connect();
    }, timeout);
  }

  public sendMessage(text: string): void {
    if (!text.trim() || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    this.lastSentMessage = {
      text: text.trim(),
      timestamp: Date.now()
    };

    this.socket.send(text.trim());

    this.events.emit('messageSent', {
      text: text.trim(),
      sender: this.username,
      time: new Date().toISOString()
    });
  }

  public setUsername(name: string): void {
    if (!name.trim()) return;

    this.username = name.trim();
    this.sendUsername();
  }

  private sendUsername(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({
        type: 'username',
        data: this.username
      }));
    }
  }

  public onMessage(callback: (data: MessageData) => void): () => void {
    return this.events.on('message', callback);
  }

  public onStatusChange(callback: (status: string) => void): () => void {
    callback(this.connected ? 'Connected' : 'Disconnected');
    return this.events.on('statusChange', callback);
  }

  public onMessageSent(callback: (data: { text: string, sender: string, time: string }) => void): () => void {
    return this.events.on('messageSent', callback);
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public getUsername(): string {
    return this.username;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }

    if (this.reconnectTimeout) {
      window.clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}

export default WebSocketService;
