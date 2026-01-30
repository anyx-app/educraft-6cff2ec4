
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';

// Placeholder components for routes that don't exist yet
const Courses = () => <div className="p-10 text-center text-slate-500">My Courses Page (Coming Soon)</div>;
const Browse = () => <div className="p-10 text-center text-slate-500">Browse Catalog (Coming Soon)</div>;
const Certificates = () => <div className="p-10 text-center text-slate-500">Certificates (Coming Soon)</div>;
const Community = () => <div className="p-10 text-center text-slate-500">Community Forum (Coming Soon)</div>;

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/community" element={<Community />} />
      </Route>
    </Routes>
  );
}

export default App;
