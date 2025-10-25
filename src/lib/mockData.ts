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

// Mock Clients
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    idNumber: 'A12345678',
    phone: '+1234567893',
    address: '123 Main St, City, State 12345',
    license_number: 'DL123456789',
    status: 'active',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Robert Brown',
    email: 'robert@example.com',
    phone: '+1234567894',
    address: '456 Oak Ave, City, State 12345',
    license_number: 'DL987654321',
    status: 'active',
    created_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+1234567895',
    address: '789 Pine St, City, State 12345',
    license_number: 'DL456789123',
    status: 'suspended',
    created_at: '2024-02-01T00:00:00Z'
  }
];

// Mock Vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    license_plate: 'ABC123',
    vin: '1HGBH41JXMN109186',
    color: 'Silver',
    status: 'available',
    daily_rate: 45.00,
    owner_id: '3',
    mileage: 15000,
    fuel_type: 'gasoline',
    transmission: 'automatic',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    license_plate: 'XYZ789',
    vin: '2HGFC2F59NH123456',
    color: 'Blue',
    status: 'rented',
    daily_rate: 40.00,
    owner_id: '3',
    mileage: 22000,
    fuel_type: 'gasoline',
    transmission: 'manual',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    make: 'Ford',
    model: 'Explorer',
    year: 2023,
    license_plate: 'DEF456',
    vin: '1FM5K8D84NGA12345',
    color: 'Black',
    status: 'maintenance',
    daily_rate: 65.00,
    owner_id: '3',
    mileage: 8000,
    fuel_type: 'gasoline',
    transmission: 'automatic',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    license_plate: 'ELC001',
    vin: '5YJ3E1EA4NF123456',
    color: 'White',
    status: 'available',
    daily_rate: 85.00,
    owner_id: '3',
    mileage: 5000,
    fuel_type: 'electric',
    transmission: 'automatic',
    created_at: '2024-01-01T00:00:00Z'
  }
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: '1',
    client_id: '1',
    vehicle_id: '2',
    start_date: '2024-12-20',
    end_date: '2024-12-25',
    status: 'active',
    total_amount: 200.00,
    daily_rate: 40.00,
    created_at: '2024-12-18T00:00:00Z'
  },
  {
    id: '2',
    client_id: '2',
    vehicle_id: '1',
    start_date: '2024-12-22',
    end_date: '2024-12-24',
    status: 'completed',
    total_amount: 90.00,
    daily_rate: 45.00,
    created_at: '2024-12-20T00:00:00Z'
  },
  {
    id: '3',
    client_id: '1',
    vehicle_id: '4',
    start_date: '2024-12-28',
    end_date: '2024-12-30',
    status: 'confirmed',
    total_amount: 170.00,
    daily_rate: 85.00,
    created_at: '2024-12-25T00:00:00Z'
  }
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    category: 'rental',
    amount: 200.00,
    description: 'Honda Civic rental - Sarah Johnson',
    booking_id: '1',
    created_at: '2024-12-18T00:00:00Z'
  },
  {
    id: '2',
    type: 'income',
    category: 'rental',
    amount: 90.00,
    description: 'Toyota Camry rental - Robert Brown',
    booking_id: '2',
    created_at: '2024-12-20T00:00:00Z'
  },
  {
    id: '3',
    type: 'expense',
    category: 'maintenance',
    amount: 150.00,
    description: 'Ford Explorer - Oil change and inspection',
    vehicle_id: '3',
    created_at: '2024-12-15T00:00:00Z'
  },
  {
    id: '4',
    type: 'expense',
    category: 'fuel',
    amount: 45.00,
    description: 'Fuel for Honda Civic',
    vehicle_id: '2',
    created_at: '2024-12-19T00:00:00Z'
  },
  {
    id: '5',
    type: 'income',
    category: 'penalty',
    amount: 25.00,
    description: 'Late return fee - Sarah Johnson',
    booking_id: '1',
    created_at: '2024-12-26T00:00:00Z'
  }
];