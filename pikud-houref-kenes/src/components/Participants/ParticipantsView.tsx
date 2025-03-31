import React, { useState, useEffect } from 'react';
import { Search, User } from 'lucide-react';
import { fetchParticipantsData, ParticipantItem } from './api/participantsApi';
import styles from './participants.module.scss';

export const ParticipantsView: React.FC = () => {
  const [participants, setParticipants] = useState<ParticipantItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        setLoading(true);
        const data = await fetchParticipantsData();
        setParticipants(data);
        setError(null);
      } catch (err) {
        setError('Error loading participants data');
        console.error('Error loading participants data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadParticipants();
  }, []);

  const filteredParticipants = participants.filter(participant => 
    participant.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    participant.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Participants</h2>
        <p>Loading participants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Participants</h2>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Participants</h2>
      
      <div className={styles.searchContainer}>
        <Search className={styles.searchIcon} />
        <input 
          placeholder="Search participants..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className={styles.participantList}>
        {filteredParticipants.map((participant, index) => (
          <div key={index} className={styles.participantCard}>
            <div className={styles.cardContent}>
              <div className={styles.avatar}>
                <User className={styles.avatarIcon} />
              </div>
              <div className={styles.details}>
                <h3 className={styles.name}>{participant.name}</h3>
                <div className={styles.organization}>
                  <p>{participant.unit}</p>
                </div>
                <div className={styles.contact}>
                  <p className={styles.email}>{participant.mail}</p>
                  
                  <div className={styles.socialLinks}>
                    <p className={styles.socialText}>Connect:</p>
                    
                    {participant.linkedin && (
                      <a 
                        href={participant.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`${styles.socialButton} ${styles.linkedin}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0077B5" className="w-4 h-4">
                          <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                        </svg>
                      </a>
                    )}
                    
                    {participant.phone && (
                      <a 
                        href={`https://wa.me/${participant.phone.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={`${styles.socialButton} ${styles.whatsapp}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#25D366" className="w-4 h-4">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantsView;