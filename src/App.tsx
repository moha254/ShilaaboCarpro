import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Dashboard from './components/Dashboard/Dashboard';
import ClientManagement from './components/Clients/ClientManagement';
import VehicleManagement from './components/Vehicles/VehicleManagement';
import BookingManagement from './components/Bookings/BookingManagement';
import PermissionGuard from './components/Layout/PermissionGuard';
import { hasPermission, getUserModules } from './lib/permissions';
import { Car, Users, Calendar, BarChart3, Settings, LogOut } from 'lucide-react';
import Reports from './components/Reports/Reports';

function AppContent() {
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = React.useState('dashboard');

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <LoginForm />
      </div>
    );
  }

  // Get available modules for current user role
  const availableModules = getUserModules(user.role);
  
  // Filter menu items based on user permissions
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'vehicles', label: 'Vehicles', icon: Car },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const menuItems = allMenuItems.filter(item => availableModules.includes(item.id));
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return (
          <PermissionGuard module="clients" action="view">
            <ClientManagement />
          </PermissionGuard>
        );
      case 'vehicles':
        return (
          <PermissionGuard module="vehicles" action="view">
            <VehicleManagement />
          </PermissionGuard>
        );
      case 'bookings':
        return (
          <PermissionGuard module="bookings" action="view">
            <BookingManagement />
          </PermissionGuard>
        );
      case 'reports':
        return (
          <PermissionGuard module="reports" action="view">
            <Reports />
          </PermissionGuard>
        );
      case 'settings':
        return (
          <PermissionGuard module="settings" action="view">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">User Role: {user.role.toUpperCase()}</h3>
                    <p className="text-sm text-gray-600">Your current permissions and access level</p>
                  </div>
                  {hasPermission(user.role, 'settings', 'system_config') && (
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">System Configuration</h4>
                      <p className="text-sm text-gray-600">Advanced system settings</p>
                    </div>
                  )}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium">Profile Settings</h4>
                    <p className="text-sm text-gray-600">Update your profile information</p>
                  </div>
                </div>
              </div>
            </div>
          </PermissionGuard>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b bg-white">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-full flex justify-center">
              <img 
                src="/img/logo.jpg" 
                alt="CarHire Pro Logo" 
                className="h-20 w-auto object-contain"
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">CarHire Pro</h1>
              <p className="text-sm text-gray-600 font-medium">Management System</p>
            </div>
          </div>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;