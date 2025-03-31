import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import WebSocketService from './WebSocketService';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  time: string;
  isSelf: boolean;
}

const webSocketService = WebSocketService.getInstance();

export const ForumView: React.FC = () => {
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
    <div className="flex flex-col h-full">
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-t-xl border border-orange-200 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageSquare className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-black">Group Chat</h2>
            <div className={connectionStatus.includes('מחובר') ? 'text-xs text-green-600' : 'text-xs text-red-500'}>
              {connectionStatus}
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="השם שלך"
              className="text-sm bg-white/80 border border-orange-200 rounded-lg py-1 px-2 mr-2 focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button 
              onClick={updateUsername}
              className="text-xs py-1 px-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200"
            >
              שמור שם
            </button>
          </div>
        </div>
      </div>
      
      <div 
        ref={messagesContainerRef}
        className="flex-1 space-y-3 mb-4 overflow-y-auto max-h-[60vh] p-2"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={msg.isSelf ? 'flex justify-end' : 'flex justify-start'}
          >
            <div 
              className={msg.isSelf 
                ? 'max-w-[80%] p-3 rounded-xl bg-orange-500 text-white rounded-br-none' 
                : 'max-w-[80%] p-3 rounded-xl bg-white/80 border border-orange-200 text-black rounded-bl-none'
              }
            >
              <div className="flex justify-between items-baseline mb-1">
                <p className={msg.isSelf ? 'text-xs font-bold text-white/90' : 'text-xs font-bold text-orange-500'}>
                  {msg.sender}
                </p>
                <p className={msg.isSelf ? 'text-xs ml-2 text-white/70' : 'text-xs ml-2 text-black/50'}>
                  {msg.time}
                </p>
              </div>
              <p className={msg.isSelf ? 'text-sm text-white' : 'text-sm text-black/80'}>
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm border border-orange-200 p-3 rounded-xl">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-white/80 border border-orange-200 rounded-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm"
            />
          </div>
          <button 
            onClick={sendMessage}
            className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600"
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

export default ForumView;
