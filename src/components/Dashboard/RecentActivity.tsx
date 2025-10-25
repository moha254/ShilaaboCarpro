import React from 'react';
import { Clock, Car, User, DollarSign, AlertCircle } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'booking',
      title: 'New booking created',
      description: 'Sarah Johnson booked Honda Civic for 5 days',
      time: '2 hours ago',
      icon: Car,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment received',
      description: 'KSH 200.00 from Robert Brown',
      time: '4 hours ago',
      icon: DollarSign,
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 3,
      type: 'client',
      title: 'New client registered',
      description: 'Emily Davis completed registration',
      time: '6 hours ago',
      icon: User,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 4,
      type: 'maintenance',
      title: 'Vehicle maintenance due',
      description: 'Ford Explorer requires service',
      time: '1 day ago',
      icon: AlertCircle,
      color: 'text-amber-600 bg-amber-100'
    },
    {
      id: 5,
      type: 'booking',
      title: 'Booking completed',
      description: 'Toyota Camry returned by Robert Brown',
      time: '2 days ago',
      icon: Car,
      color: 'text-gray-600 bg-gray-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <p className="text-sm text-gray-600 mt-1">Latest updates from your business</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {activities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <div className="flex items-center mt-1">
                      <Clock className="w-3 h-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-600 mt-1">Common tasks and shortcuts</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Car className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">New Booking</p>
              <p className="text-xs text-gray-500">Create reservation</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <User className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Add Client</p>
              <p className="text-xs text-gray-500">Register new client</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <DollarSign className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Record Payment</p>
              <p className="text-xs text-gray-500">Add transaction</p>
            </button>
            <button className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <AlertCircle className="w-6 h-6 text-amber-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Maintenance</p>
              <p className="text-xs text-gray-500">Schedule service</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}