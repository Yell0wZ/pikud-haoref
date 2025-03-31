module.exports = async (data, db) => {

    const scheduleData = [
        {
          date: "16-17 JULY",
          day: "WEDNESDAY-THURSDAY",
          time: "09:00-17:00",
          location: "HFC JFHQ, Ramla",
          title: "Capture the Flag Exercise",
          details: "unofficial welcoming cocktail on the 16th"
        },
        {
          date: "18 JULY",
          day: "FRIDAY",
          time: "09:00-13:30",
          location: "HFC JFHQ, Ramla",
          title: "Professional Lectures Day",
          details: ""
        },
        {
          date: "19 JULY",
          day: "SATURDAY",
          time: "ALL DAY",
          location: "RAMLE",
          title: "DAY OFF",
          details: "(NO WORKING DUE TO SHABBAT)"
        },
        {
          date: "20 JULY",
          day: "SUNDAY",
          time: "08:30-17:30",
          location: "Cyberpro, Ramat Gan",
          title: "OFFICIAL TRAINING OPENING DAY",
          details: ""
        }
      ];
      
      // שמירת הנתונים ישירות - בצורה קצרה
      db.collection('schedule').doc('data').set({
        data: scheduleData
      })
      .then(() => console.log('הנתונים נשמרו בהצלחה'))
      .catch(error => console.error('שגיאה:', error));



}