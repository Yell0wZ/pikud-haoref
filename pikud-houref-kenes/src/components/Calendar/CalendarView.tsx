import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { fetchScheduleData, ScheduleItem } from './api/scheduleApi';
import styles from './calendar.module.scss';

interface CalendarViewProps {
  selectedDay: string;
  setSelectedDay: (day: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ selectedDay, setSelectedDay }) => {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getDateTimeValue = (item: ScheduleItem): number => {
    const dateStr = item.date;
    let dayNum: number;
    
    if (dateStr.includes('-')) {
      const firstDate = dateStr.split('-')[0].trim();
      dayNum = parseInt(firstDate);
    } else {
      dayNum = parseInt(dateStr.split(' ')[0]);
    }
    
    let timeMinutes = 0;
    if (item.time && item.time !== "ALL DAY") {
      try {
        const timeRange = item.time.split('-');
        const startTime = timeRange[0].trim();
        const [hours, minutes] = startTime.split(':').map(part => parseInt(part));
        timeMinutes = hours * 60 + (minutes || 0);
      } catch (e) {
        console.warn('Failed to parse time:', item.time);
      }
    }
    
    return dayNum * 10000 + timeMinutes;
  };

  useEffect(() => {
    const getScheduleData = async () => {
      try {
        setLoading(true);
        const data = await fetchScheduleData();
        
        const sortedData = [...data].sort((a, b) => {
          const dateTimeA = getDateTimeValue(a);
          const dateTimeB = getDateTimeValue(b);
          return dateTimeA - dateTimeB;
        });
        
        setScheduleData(sortedData);
        setError(null);
      } catch (err) {
        setError('Error loading schedule data');
        console.error('Error loading schedule data:', err);
      } finally {
        setLoading(false);
      }
    };

    getScheduleData();
  }, []);

  const filteredSchedule = selectedDay === 'all'
    ? scheduleData
    : scheduleData.filter(item => item.date.includes(selectedDay));

  if (loading) {
    return (
      <div className={styles.scheduleContainer}>
        <div className={styles.header}>
          <h2>Agenda</h2>
        </div>
        <div className={styles.eventList}>
          <p>Loading schedule data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.scheduleContainer}>
        <div className={styles.header}>
          <h2>Agenda</h2>
        </div>
        <div className={styles.eventList}>
          <p className={styles.error}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.scheduleContainer}>
      <div className={styles.header}>
        <h2>Agenda</h2>
      </div>
      
      <div className={styles.dayFilter}>
        <button 
          className={selectedDay === 'all' ? styles.active : styles.inactive}
          onClick={() => setSelectedDay('all')}
        >
          All Days
        </button>
        {['16', '17', '18', '19', '20'].map(day => (
          <button 
            key={day}
            className={selectedDay === day ? styles.active : styles.inactive}
            onClick={() => setSelectedDay(day)}
          >
            July {day}
          </button>
        ))}
      </div>
      
      <div className={styles.eventList}>
        {filteredSchedule.map((item, index) => (
          <div key={index} className={styles.eventCard}>
            <div className={styles.eventContent}>
              <div className={styles.indicator}></div>
              <div className={styles.details}>
                <div className={styles.header}>
                  <div className={styles.dateTime}>
                    <h3>{item.date} | {item.day}</h3>
                    <p>{item.time}</p>
                  </div>
                  <div className={styles.location}>
                    <p>{item.location}</p>
                  </div>
                </div>
                <h4 className={styles.title}>{item.title}</h4>
                {item.details && (
                  <p className={styles.description}>{item.details}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;