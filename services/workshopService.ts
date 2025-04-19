import api from '@/services/api';

export const workshopFetch = async () => {
  try {
    const response = await api.get('/listworkshops');
    
    return response;
  } catch (error: any) {
    console.error('Error fetching workshop data:', 
      error.response ? error.response.data : error.message);
    throw error;
  }
};

export const workshopEnroll = async (workshopId: string) => {
  try {
    const response = await api.post(`/workshops/${workshopId}/enroll`);
    return response.data; // Note: return response.data here
  } catch (error: any) {
    console.error('Error enrolling in workshop:', 
      error.response ? error.response.data : error.message);
    throw error;
  }
};

export const workshopUnenroll = async (workshopId: string) => {
  try {
    const response = await api.delete(`/workshops/${workshopId}/unenroll`);
    return response;
  } catch (error: any) {
    console.error('Error unenrolling from workshop:', 
      error.response ? error.response.data : error.message);
    throw error;
  }
};

export const joinWaitingList = async (workshopId: string) => {
  try {
    const response = await api.post(`/workshops/${workshopId}/waiting-list`);
    return response;
  } catch (error: any) {
    console.error('Error joining waiting list for workshop:', 
      error.response ? error.response.data : error.message);
    throw error;
  }
};

export const leaveWaitingList = async (workshopId: string) => {
  try {
    const response = await api.delete(`/workshops/${workshopId}/waiting-list`);
    return response;
  } catch (error: any) {
    console.error('Error leaving waiting list for workshop:', 
      error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserWorkshops = async () => {
  try {
    const response = await api.get('/profile/workshops');
    return response;
  } catch (error: any) {
    console.error('Error fetching user workshops:', 
      error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserWaitingList = async () => {
  try {
    const response = await api.get('/profile/waiting-list');
    return response;
  } catch (error: any) {
    console.error('Error fetching user waiting list:', 
      error.response ? error.response.data : error.message);
    throw error;
  }
};