import { api } from '../lib/api';

export interface Booking {
  _id: string;
  client: {
    _id: string;
    fullName: string;
    phone: string;
  };
  vehicle: {
    _id: string;
    make: string;
    model: string;
    licensePlate: string;
  };
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Cancelled';
}

const handleApiError = (error: any) => {
  console.error('API Error:', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('Response data:', error.response.data);
    console.error('Response status:', error.response.status);
    console.error('Response headers:', error.response.headers);
    throw new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    throw new Error('No response from server. Please check your connection.');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request setup error:', error.message);
    throw new Error(error.message || 'An error occurred');
  }
};

export const bookingService = {
  async updateBooking(id: string, bookingData: Partial<Booking>) {
    try {
      const response = await api.put(`/bookings/${id}`, bookingData);
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getBooking(id: string): Promise<Booking> {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data.data;
    } catch (error) {
      return handleApiError(error);
    }
  },

  async getClients() {
    try {
      const response = await api.get('/clients');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  },

  async getVehicles() {
    try {
      const response = await api.get('/vehicles');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      return [];
    }
  },
};
