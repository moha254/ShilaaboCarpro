export type UserRole = 'client' | 'owner' | 'staff' | 'director';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone: string;
  created_at: string;
  updated_at?: string;
}

export interface Client {
  id: string;
  name: string;
  idNumber: string;
  phone: string;
  address: string;
  license_number: string;
  status: 'active' | 'suspended' | 'banned';
  created_at: string;
  updated_at?: string;
}

export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'unavailable';
export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid' | 'plug_in_hybrid';
export type Transmission = 'manual' | 'automatic' | 'semi_automatic';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  vin: string;
  color: string;
  status: VehicleStatus;
  daily_rate: number;
  owner_id: string;
  mileage: number;
  fuel_type: FuelType;
  transmission: Transmission;
  created_at: string;
  updated_at?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  client_id: string;
  vehicle_id: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  total_amount: number;
  daily_rate: number;
  created_at: string;
  updated_at?: string;
}

export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'rental' | 'maintenance' | 'insurance' | 'cleaning' | 'other';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  booking_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}