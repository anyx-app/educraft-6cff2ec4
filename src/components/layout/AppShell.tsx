
import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Search, 
  Award, 
  Users, 
  Settings, 
  Menu, 
  X,
  LogOut,
  Bell,
  ChevronDown
} from 'lucide-react';

export default function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'My Courses', href: '/courses', icon: BookOpen },
    { name: 'Browse', href: '/browse', icon: Search },
    { name: 'Certificates', href: '/certificates', icon: Award },
    { name: 'Community', href: '/community', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1E88E5] flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/30">
            E
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">EduCraft</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-72 
        bg-white border-r border-slate-200
        transition-transform duration-300 ease-out lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-8 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E88E5] to-[#42A5F5] flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              E
            </div>
            <span className="ml-3 font-bold text-2xl tracking-tight text-slate-900">
              EduCraft
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group
                    ${active 
                      ? 'bg-[#1E88E5]/10 text-[#1E88E5] font-semibold' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                  `}
                >
                  <item.icon 
                    size={20} 
                    className={`
                      transition-colors duration-300
                      ${active ? 'text-[#1E88E5]' : 'text-slate-400 group-hover:text-slate-600'}
                    `} 
                  />
                  <span>{item.name}</span>
                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#1E88E5]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile / Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 cursor-pointer transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden relative">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">Alex Student</p>
                <p className="text-xs text-slate-500 truncate">Pro Learner</p>
              </div>
              <Settings size={18} className="text-slate-400 group-hover:text-[#1E88E5] transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:ml-72 min-h-screen transition-all duration-300">
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between h-20 px-8 bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-sm font-medium text-slate-500">Welcome back, Alex!</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#1E88E5] transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#FFC107] rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#1E88E5] transition-colors">
              <span>Help Center</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
