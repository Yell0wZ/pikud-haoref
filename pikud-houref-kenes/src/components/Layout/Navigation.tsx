import React from 'react';
import { Calendar, Users, MessageSquare, FileText, Image } from 'lucide-react';
import styles from './navigation.module.scss';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { icon: Calendar, label: "Agenda", tab: "agenda" },
    { icon: Users, label: "Participants", tab: "participants" },
    { icon: MessageSquare, label: "Chat", tab: "chat" },
    { icon: FileText, label: "Files", tab: "files" },
    { icon: Image, label: "Gallery", tab: "gallery" }
  ];

  return (
    <div className={styles.navigation}>
      <div className={styles.container}>
        {navItems.map(({ icon: Icon, label, tab }) => (
          <button
            key={tab}
            className={`${styles.navButton} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            <Icon className={styles.icon} />
            <span className={styles.label}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;