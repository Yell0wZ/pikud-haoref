import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { galleryData } from './galleryData';
import styles from './gallery.module.scss';

export const GalleryView: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newImage, setNewImage] = useState({
    title: '',
    file: null as File | null
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle image upload logic here
    setIsModalOpen(false);
    setNewImage({ title: '', file: null });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Photo Gallery</h2>
        <div className={styles.buttonGroup}>
          <button 
            className={styles.addButton}
            onClick={() => setIsModalOpen(true)}
          >
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} />
        <input 
          placeholder="Search photos..." 
          className={styles.searchInput}
        />
      </div>
      
      <div className={styles.galleryGrid}>
        {galleryData.map((photo) => (
          <div key={photo.id} className={styles.galleryCard}>
            <div className={styles.imageContainer}>
              <p className={styles.imagePlaceholder}>Sample Image</p>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{photo.title}</h3>
              <p className={styles.cardDate}>{photo.date}</p>
              <p className={styles.uploader}>Uploaded by: {photo.uploader}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Upload New Image</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setIsModalOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.uploadForm}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={newImage.title}
                  onChange={(e) => setNewImage(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter image title"
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="image">Image</label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                  required
                />
              </div>
              <button type="submit" className={styles.uploadButton}>
                Upload
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryView;