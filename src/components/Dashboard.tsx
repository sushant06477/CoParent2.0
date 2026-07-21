import React from 'react';
import { User, EducationService } from '../types';
import SuperAdminDashboard from './SuperAdminDashboard';
import DepartmentDashboard from './DepartmentDashboard';
import StudentParentDashboard from './StudentParentDashboard';
import { ShieldAlert } from 'lucide-react';

interface DashboardProps {
  currentUser: User;
  services: EducationService[];
  onRefreshData: () => void;
}

export default function Dashboard({ currentUser, services, onRefreshData }: DashboardProps) {
  if (!currentUser) {
    return (
      <div className="text-center py-20 bg-slate-900 min-h-screen flex items-center justify-center p-4">
        <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 max-w-sm space-y-4 shadow-xl">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">Access Denied</h3>
          <p className="text-xs text-slate-400">Please log in using your authorized student, parent or staff username credentials to launch the dashboard.</p>
        </div>
      </div>
    );
  }

  const role = currentUser.role;

  if (role === 'Super Admin' || role === 'Co Admin') {
    return (
      <SuperAdminDashboard 
        currentUser={currentUser} 
        onRefreshData={onRefreshData} 
      />
    );
  }

  const isDepartment = ['Coaching', 'Hostel', 'Library', 'Flat / PG', 'Career Counselling'].includes(role);
  if (isDepartment) {
    return (
      <DepartmentDashboard 
        currentUser={currentUser} 
        onRefreshData={onRefreshData} 
      />
    );
  }

  if (role === 'Student' || role === 'Parent') {
    return (
      <StudentParentDashboard 
        currentUser={currentUser} 
        services={services} 
      />
    );
  }

  return (
    <div className="text-center py-20 text-slate-400 text-sm">
      Unauthorized user privilege mapping. Contact coparents.in system admin.
    </div>
  );
}
