import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { bookingService } from '../../services/bookingService';

interface Client {
  _id: string;
  fullName: string;
  phone: string;
}

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  licensePlate: string;
}

interface EditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  onUpdate: () => void;
}

export default function EditBookingModal({ isOpen, onClose, bookingId, onUpdate }: EditBookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<{
    client: string;
    vehicle: string;
    startDate: string;
    endDate: string;
  }>({
    client: '',
    vehicle: '',
    startDate: '',
    endDate: '',
  });

  // Load booking data when modal opens
  useEffect(() => {
    if (isOpen && bookingId) {
      const loadBooking = async () => {
        try {
          setIsLoading(true);
          const booking = await bookingService.getBooking(bookingId);
          setFormData({
            client: booking.client._id,
            vehicle: booking.vehicle._id,
            startDate: format(new Date(booking.startDate), 'yyyy-MM-dd'),
            endDate: format(new Date(booking.endDate), 'yyyy-MM-dd'),
          });
        } catch (err) {
          setError('Failed to load booking details');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      loadBooking();
    }
  }, [isOpen, bookingId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    try {
      setIsLoading(true);
      await bookingService.updateBooking(bookingId, {
        client: formData.client,
        vehicle: formData.vehicle,
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: 'Active', // Keep the status as Active when updating
      });
      setSuccess(true);
      onUpdate(); // Refresh the bookings list
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update booking');
      console.error('Update booking error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // In a real app, you would fetch these from your API
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Load clients and vehicles when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadData = async () => {
        try {
          const [clientsData, vehiclesData] = await Promise.all([
            bookingService.getClients(),
            bookingService.getVehicles()
          ]);
          setClients(clientsData);
          setVehicles(vehiclesData);
        } catch (err) {
          console.error('Failed to load data:', err);
          // Fallback to empty arrays if API fails
          setClients([]);
          setVehicles([]);
        }
      };
      loadData();
    }
  }, [isOpen]);

  return (
    <Transition.Root show={isOpen} as="div">
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      Edit Booking
                    </Dialog.Title>
                    <div className="mt-2 w-full">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                            Client
                          </label>
                          <select
                            id="client"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            required
                          >
                            <option value="">Select a client</option>
                            {clients.map((client) => (
                              <option key={client._id} value={client._id}>
                                {client.fullName} - {client.phone}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700">
                            Vehicle
                          </label>
                          <select
                            id="vehicle"
                            name="vehicle"
                            value={formData.vehicle}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            required
                          >
                            <option value="">Select a vehicle</option>
                            {vehicles.map((vehicle) => (
                              <option key={vehicle._id} value={vehicle._id}>
                                {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                            Start Date
                          </label>
                          <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                            End Date
                          </label>
                          <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            min={formData.startDate}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            required
                          />
                        </div>

                        {error && (
                          <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">{error}</h3>
                              </div>
                            </div>
                          </div>
                        )}

                        {success && (
                          <div className="rounded-md bg-green-50 p-4">
                            <div className="flex">
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">
                                  Booking updated successfully!
                                </h3>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                          <button
                            type="button"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                            onClick={onClose}
                            disabled={isLoading}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                            disabled={isLoading}
                          >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
