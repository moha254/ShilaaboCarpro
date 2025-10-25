import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Edit, Trash2, X, AlertCircle, User, Car } from 'lucide-react';
import EditBookingModal from './EditBookingModal';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../lib/permissions';
import PermissionGuard from '../Layout/PermissionGuard';

interface Client {
  _id: string;
  fullName: string;
  phone: string;
  address?: string;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  licensePlate: string;
  dailyRate: number;
  color?: string;
}

interface Booking {
  _id: string;
  client: Client;
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export default function BookingManagement() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Completed' | 'Cancelled'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);

  // Fetch data from backend
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bookings');
      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        setError('Failed to fetch bookings');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      if (response.data.success) {
        setClients(response.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch clients:', err);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await api.get('/vehicles');
      if (response.data.success) {
        setVehicles(response.data.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch vehicles:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchClients();
    fetchVehicles();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const clientName = booking.client?.fullName || '';
    const vehicleMake = booking.vehicle?.make || '';
    const vehicleModel = booking.vehicle?.model || '';
    const vehicleLicensePlate = booking.vehicle?.licensePlate || '';
    
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicleMake.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicleLicensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Don't render the table if still loading
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  const handleDeleteClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDeleteConfirm(true);
  };

  const handleDeleteBooking = async () => {
    if (!selectedBooking) return;
    
    try {
      await api.delete(`/bookings/${selectedBooking._id}`);
      setBookings(prev => prev.filter(booking => booking._id !== selectedBooking._id));
      setShowDeleteConfirm(false);
      setShowDetailsModal(false);
      setSelectedBooking(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to delete booking');
    }
  };

  const handleEdit = (booking: Booking) => {
    setEditingBookingId(booking._id);
    setShowEditModal(true);
  };

  const handleBookingUpdated = () => {
    fetchBookings();
    setShowEditModal(false);
    setEditingBookingId(null);
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings(prev => prev.map(booking => 
        booking._id === bookingId ? { ...booking, status: newStatus as any } : booking
      ));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleBookingAdded = () => {
    fetchBookings(); // Refresh the list
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6">
      {showAddModal && (
        <AddBookingForm 
          onClose={() => setShowAddModal(false)} 
          onBookingAdded={handleBookingAdded}
          clients={clients}
          vehicles={vehicles}
        />
      )}
      
      {showDetailsModal && selectedBooking && (
        <BookingDetailsModal 
          booking={selectedBooking}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showDeleteConfirm && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">Delete Booking</h3>
              <p className="mt-2 text-sm text-gray-500">
                Are you sure you want to delete this booking? This action cannot be undone.
              </p>
              <div className="mt-5 flex justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteBooking}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-600 mt-1">Manage vehicle reservations and rentals</p>
        </div>
        <PermissionGuard module="bookings" action="create">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </button>
        </PermissionGuard>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search bookings by client or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => {
                const days = calculateDays(booking.startDate, booking.endDate);
                const totalAmount = days * booking.vehicle?.dailyRate;
                
                return (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">#{booking._id.slice(-6)}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{booking.client?.fullName}</div>
                      <div className="text-xs text-gray-500">{booking.client?.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{booking.vehicle?.make} {booking.vehicle?.model}</div>
                      <div className="text-xs text-gray-500">{booking.vehicle?.licensePlate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.startDate).toLocaleDateString()}<br />
                        <span className="text-gray-500">to</span><br />
                        {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {days} day{days !== 1 ? 's' : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KSH {totalAmount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <div className="inline-flex items-center space-x-2">
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                          className="text-xs border rounded p-1 bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          disabled={!hasPermission(user?.role || '', 'bookings', 'edit')}
                        >
                          <option value="Active">Active</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="View booking details"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(booking)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="Edit booking"
                            disabled={!hasPermission(user?.role || '', 'bookings', 'edit')}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(booking)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete booking"
                            disabled={!hasPermission(user?.role || '', 'bookings', 'delete')}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBookings.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Get started by creating your first booking'
            }
          </p>
        </div>
      )}

      <EditBookingModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingBookingId(null);
        }}
        bookingId={editingBookingId || ''}
        onUpdate={handleBookingUpdated}
      />
    </div>
  );
}

// Add Booking Form Component
function AddBookingForm({ 
  onClose, 
  onBookingAdded, 
  clients, 
  vehicles 
}: { 
  onClose: () => void; 
  onBookingAdded?: () => void;
  clients: Client[];
  vehicles: Vehicle[];
}) {
  const [formData, setFormData] = useState({
    client: '',
    vehicle: '',
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.client || !formData.vehicle || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/bookings', formData);
      
      if (response.data.success) {
        onClose();
        if (onBookingAdded) {
          onBookingAdded();
        }
      } else {
        setError(response.data.message || 'Failed to create booking');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedVehicle = vehicles.find(v => v._id === formData.vehicle);
  const days = formData.startDate && formData.endDate ? 
    calculateDays(formData.startDate, formData.endDate) : 0;
  const totalAmount = days * (selectedVehicle?.dailyRate || 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Create New Booking</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                Client *
              </label>
              <select
                id="client"
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.fullName} - {client.phone}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle *
              </label>
              <select
                id="vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle._id} value={vehicle._id}>
                    {vehicle.make} {vehicle.model} - {vehicle.licensePlate} (KSH {vehicle.dailyRate}/day)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {days > 0 && selectedVehicle && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{days} day{days > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Rate:</span>
                    <span>KSH {selectedVehicle.dailyRate.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Amount:</span>
                    <span>KSH {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="-ml-1 mr-2 h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Booking Details Modal Component
function BookingDetailsModal({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  const days = calculateDays(booking.startDate, booking.endDate);
  const totalAmount = days * booking.vehicle?.dailyRate;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Booking Details</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="space-y-6">
            {/* Booking Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Booking #{booking._id.slice(-6)}</h2>
                  <p className="text-sm text-gray-500">Created on {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Client Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Name:</span>
                    <p className="font-medium">{booking.client?.fullName}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Phone:</span>
                    <p className="font-medium">{booking.client?.phone}</p>
                  </div>
                  {booking.client?.address && (
                    <div>
                      <span className="text-sm text-gray-500">Address:</span>
                      <p className="font-medium">{booking.client.address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 flex items-center">
                  <Car className="w-4 h-4 mr-2" />
                  Vehicle Information
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Vehicle:</span>
                    <p className="font-medium">{booking.vehicle?.make} {booking.vehicle?.model}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">License Plate:</span>
                    <p className="font-medium">{booking.vehicle?.licensePlate}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Daily Rate:</span>
                    <p className="font-medium">KSH {booking.vehicle?.dailyRate?.toLocaleString()}</p>
                  </div>
                  {booking.vehicle?.color && (
                    <div>
                      <span className="text-sm text-gray-500">Color:</span>
                      <p className="font-medium">{booking.vehicle.color}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Booking Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Start Date:</span>
                  <p className="font-medium">{new Date(booking.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">End Date:</span>
                  <p className="font-medium">{new Date(booking.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Duration:</span>
                  <p className="font-medium">{days} day{days !== 1 ? 's' : ''}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'Active' ? 'bg-green-100 text-green-800' :
                    booking.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-blue-600">
                  KSH {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for calculating days
function calculateDays(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}