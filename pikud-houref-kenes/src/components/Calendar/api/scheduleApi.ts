export interface ScheduleItem {
    date: string;
    day: string;
    time: string;
    location: string;
    title: string;
    details: string;
  }
  
  export async function fetchScheduleData(): Promise<ScheduleItem[]> {
    try {
      const response = await fetch('http://localhost:5001/download-eebb6/us-central1/getData/schedule');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseJson = await response.json();
      
      if (responseJson && Array.isArray(responseJson.data)) {
        return responseJson.data as ScheduleItem[];
      } else {
        console.error('Server response does not contain data array:', responseJson);
        throw new Error('Server response is not in the expected format');
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      console.warn('השרת לא זמין או שהתגובה אינה בפורמט הצפוי, משתמש בנתוני גיבוי');
      return [];
    }
  }