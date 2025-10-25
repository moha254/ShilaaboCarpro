import { User, Client, Vehicle, Booking, Transaction } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'director@carhire.com',
    role: 'director',
    name: 'Mohamed Abukar',
    phone: '+1234567890',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'staff@carhire.com',
    role: 'staff',
    name: 'Jane Staff',
    phone: '+1234567891',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'owner@carhire.com',
    role: 'owner',
    name: 'Mike Owner',
    phone: '+1234567892',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    email: 'client@carhire.com',
    role: 'client',
    name: 'Sarah Client',
    phone: '+1234567893',
    created_at: '2024-01-01T00:00:00Z'
  }
];

// Rest of your mock data...
// [Previous content of mockData.ts can be copied here]
