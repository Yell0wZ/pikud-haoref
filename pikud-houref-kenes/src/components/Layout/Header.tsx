import React from 'react';
import { Calendar, User } from 'lucide-react';
import styles from './header.module.scss';

export const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logoContainer}>
        <div className={styles.logo}>
          <Calendar className={styles.icon} />
        </div>
        <h1 className={styles.title}>Cyber Front Israel</h1>
      </div>
      <div className={styles.userIcon}>
        <User className={styles.icon} />
      </div>
    </div>
  );
};

export default Header;