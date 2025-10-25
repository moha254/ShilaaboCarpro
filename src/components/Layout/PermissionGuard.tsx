import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../lib/permissions';

interface PermissionGuardProps {
  module: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PermissionGuard({ 
  module, 
  action, 
  children, 
  fallback = null 
}: PermissionGuardProps) {
  const { user } = useAuth();

  if (!user || !hasPermission(user.role, module, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}