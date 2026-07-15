import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import InternalLibrary from './pages/InternalLibrary';
import DocumentDetail from './pages/DocumentDetail';
import Dashboard from './pages/Dashboard';
import AcademicSearch from './pages/AcademicSearch';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 selection:bg-[#0d3b66] selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/library" element={<InternalLibrary />} />
              <Route path="/library/:id" element={<DocumentDetail />} />
              <Route path="/search" element={<AcademicSearch />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
