import React from 'react';
import { User, UserRole } from '../types';
import { BookOpen, LogOut, LayoutDashboard, Menu, X, ShieldAlert, UserPlus } from 'lucide-react';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLogin: () => void;
}

export default function Header({ 
  currentUser, 
  onLogout, 
  activeTab, 
  setActiveTab, 
  onOpenLogin 
}: HeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'coaching', label: 'Coaching' },
    { id: 'hostel', label: 'Hostel' },
    { id: 'library', label: 'Library' },
    { id: 'flat', label: 'Flat / PG' },
    { id: 'counselling', label: 'Counselling' },
    { id: 'register', label: 'Register' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'news', label: 'Latest News' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => handleNavClick('home')}
            id="logo-container"
          >
            <div className="p-2 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <BookOpen className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-sans">
                coparents.in
              </span>
              <span className="block text-[10px] text-emerald-400 font-mono tracking-wider uppercase">Patna Ecosystem</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'text-emerald-400 bg-slate-800' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Hand Actions */}
          <div className="hidden xl:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <button
                  id="nav-dashboard"
                  onClick={() => handleNavClick('dashboard')}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-300 ${
                    activeTab === 'dashboard'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard ({currentUser.username})</span>
                </button>
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border border-transparent hover:border-slate-700 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-register-trigger"
                  onClick={() => handleNavClick('register')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border transition-all duration-300 ${
                    activeTab === 'register'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                      : 'bg-slate-850 text-slate-200 border-slate-750 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
                <button
                  id="btn-login-trigger"
                  onClick={onOpenLogin}
                  className="px-4 py-2 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 rounded-lg hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 transform active:scale-95 shadow-md shadow-emerald-500/10"
                >
                  Login Portal
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="xl:hidden flex items-center gap-2">
            {currentUser ? (
              <button
                id="btn-mobile-dashboard-direct"
                onClick={() => handleNavClick('dashboard')}
                className="px-3 py-1.5 text-xs font-bold bg-slate-800 text-emerald-400 border border-slate-700 rounded-lg hover:bg-slate-700 transition-all"
              >
                Dashboard
              </button>
            ) : (
              <button
                id="btn-mobile-login-direct"
                onClick={onOpenLogin}
                className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 rounded-lg hover:from-emerald-400 hover:to-teal-400 transition-all"
              >
                Login
              </button>
            )}
            <button
              id="mobile-menu-btn"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="xl:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-emerald-500 text-slate-950 font-bold' 
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            {currentUser ? (
              <>
                <button
                  id="nav-mobile-dashboard"
                  onClick={() => handleNavClick('dashboard')}
                  className={`block w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold transition-all ${
                    activeTab === 'dashboard'
                      ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Go to Dashboard ({currentUser.username})
                </button>
                <button
                  id="btn-mobile-logout"
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2.5 rounded-lg text-base font-medium text-red-400 hover:bg-red-950/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                id="btn-mobile-login"
                onClick={() => {
                  onOpenLogin();
                  setIsOpen(false);
                }}
                className="block w-full text-center px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-all"
              >
                Login Portal
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
