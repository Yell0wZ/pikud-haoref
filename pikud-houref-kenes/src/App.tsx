import React, { useState } from 'react';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import CalendarView from './components/Calendar/CalendarView';
import ParticipantsView from './components/Participants/ParticipantsView';
import ChatView from './components/Chat/ChatView';
import FilesView from './components/Files/FilesView';
import GalleryView from './components/Gallery/GalleryView';

const CyberFrontIsraelApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('agenda');
  const [selectedDay, setSelectedDay] = useState('all');
  
  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200">
      <Header />

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'agenda' && <CalendarView selectedDay={selectedDay} setSelectedDay={setSelectedDay} />}
        {activeTab === 'participants' && <ParticipantsView />}
        {activeTab === 'chat' && <ChatView />}
        {activeTab === 'files' && <FilesView />}
        {activeTab === 'gallery' && <GalleryView />}
      </div>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default CyberFrontIsraelApp;