import React from 'react';
import { FileText } from 'lucide-react';
import { materialsData } from './filesData';
import styles from './files.module.scss';

export const FilesView: React.FC = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Files & Materials</h2>
      
      <div className={styles.fileList}>
        {materialsData.map((category, index) => (
          <div key={index} className={styles.fileCard}>
            <div className={styles.cardContent}>
              <div className={styles.iconContainer}>
                <FileText className={styles.icon} />
              </div>
              <div className={styles.details}>
                <h3 className={styles.fileName}>{category}</h3>
                <p className={styles.fileDescription}>View files</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilesView;