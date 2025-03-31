export interface ParticipantItem {
    linkedin: string;
    mail: string;
    phone: string;
    name: string;
    unit: string;
  }
  
  export async function fetchParticipantsData(): Promise<ParticipantItem[]> {
    try {
      const response = await fetch('http://localhost:5001/download-eebb6/us-central1/getData/participants');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const responseJson = await response.json();
      
      if (Array.isArray(responseJson)) {
        return responseJson as ParticipantItem[];
      } else if (responseJson && Array.isArray(responseJson.data)) {
        return responseJson.data as ParticipantItem[];
      } else {
        console.error('Server response is not in the expected format:', responseJson);
        throw new Error('Server response is not in the expected format');
      }
    } catch (error) {
      console.error('Error fetching participants data:', error);
      return [];
    }
  }