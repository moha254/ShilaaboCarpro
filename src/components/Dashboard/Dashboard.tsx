import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardStats from './DashboardStats';
import RecentActivity from './RecentActivity';
import { mockClients, mockVehicles, mockBookings, mockTransactions } from '../../lib/mockData';

export default function Dashboard() {
  const { user } = useAuth();

  // Calculate stats based on mock data
  const totalClients = mockClients.length;
  const activeClients = mockClients.filter(c => c.status === 'active').length;
  const totalVehicles = mockVehicles.length;
  const availableVehicles = mockVehicles.filter(v => v.status === 'available').length;
  const rentedVehicles = mockVehicles.filter(v => v.status === 'rented').length;
  const activeBookings = mockBookings.filter(b => b.status === 'active').length;
  
  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      title: 'Total Clients',
      value: totalClients.toString(),
      subtitle: `${activeClients} active`,
      trend: '+12%',
      color: 'blue'
    },
    {
      title: 'Fleet Status',
      value: totalVehicles.toString(),
      subtitle: `${availableVehicles} available, ${rentedVehicles} rented`,
      trend: '+5%',
      color: 'green'
    },
    {
      title: 'Active Bookings',
      value: activeBookings.toString(),
      subtitle: 'Current rentals',
      trend: '+8%',
      color: 'purple'
    },
    {
      title: 'Monthly Revenue',
      value: `KSH ${totalIncome.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtitle: `KSH ${totalExpenses.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} expenses`,
      trend: '+15%',
      color: 'amber'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || user?.email}
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your car hire business today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Today</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      <DashboardStats stats={stats} />
      <RecentActivity />
    </div>
  );
}