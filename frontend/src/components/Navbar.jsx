import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Library, UserCheck, Shield, LogIn, LogOut, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const navItems = [
    { name: 'Khám phá', path: '/', icon: BookOpen },
    { name: 'Kho sách Nội bộ', path: '/library', icon: Library },
    { name: 'Tra cứu Học thuật', path: '/search', icon: Search },
    { name: 'Tủ sách của tôi', path: '/dashboard', icon: UserCheck },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleLabel = (role) => {
    if (role === 'admin') return 'Quản trị viên';
    if (role === 'lecturer') return 'Giảng viên';
    return 'Sinh viên';
  };

  const roleBadgeColor = (role) => {
    if (role === 'admin') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (role === 'lecturer') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                Open Digital Library
              </span>
              <p className="text-xs text-slate-400 font-medium">Thư viện Số Mở CTUT</p>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
            {/* Admin link - chỉ hiển thị với admin */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === '/admin'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-amber-400/70 hover:text-amber-400 hover:bg-amber-500/10'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* User Area */}
          <div className="flex items-center gap-3">
            {user ? (
              /* Đã đăng nhập */
              <div className="flex items-center gap-3">
                {/* Avatar + Tên */}
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    isAdmin ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-white leading-none">{user.full_name.split(' ').slice(-1)[0]}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${roleBadgeColor(user.role)}`}>
                      {roleLabel(user.role)}
                    </span>
                  </div>
                </div>
                {/* Đăng xuất */}
                <button
                  onClick={handleLogout}
                  id="navbar-logout-btn"
                  title="Đăng xuất"
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Chưa đăng nhập */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  id="navbar-login-link"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  id="navbar-register-link"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md shadow-emerald-600/20"
                >
                  <UserPlus className="w-4 h-4" />
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
