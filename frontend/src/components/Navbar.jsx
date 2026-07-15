import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Search, Library, UserCheck, Shield, LogIn, LogOut, UserPlus, MapPin, Mail, PhoneCall, ExternalLink, Home, Info, Newspaper, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const navItems = [
    { name: 'Trang Chủ', path: '/', icon: Home },
    { name: 'Giới Thiệu', path: '/about', icon: Info },
    { name: 'Thư viện số', path: '/library', icon: Library },
    { name: 'Tin tức & Tra cứu', path: '/search', icon: Newspaper },
    { name: 'Tủ sách & Liên hệ', path: '/dashboard', icon: Phone },
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
    if (role === 'admin') return 'bg-amber-100 text-amber-800 border-amber-300';
    if (role === 'lecturer') return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  };

  return (
    <div className="w-full">
      {/* ==================== TOP CONTACT & HOTLINE BAR (XANH DƯƠNG ĐẬM CTUT) ==================== */}
      <div className="bg-[#0d3b66] text-white text-xs py-2 px-4 sm:px-8 border-b border-blue-800 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-blue-100">
            <span className="flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              Số 256 Nguyễn Văn Cừ, P. An Hòa, Q. Ninh Kiều, TP. Cần Thơ
            </span>
            <span className="hidden md:flex items-center gap-1.5 hover:text-amber-300 transition-colors cursor-pointer font-medium">
              <Mail className="w-3.5 h-3.5 text-amber-300" />
              thuvien@ctuet.edu.vn
            </span>
          </div>
          <div className="flex items-center gap-4 font-semibold">
            <span className="text-amber-300 flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
              Hotline: (0292) 3894 050
            </span>
            <span class="text-blue-400">|</span>
            <a href="https://www.ctuet.edu.vn/" target="_blank" rel="noreferrer" className="text-white hover:text-amber-300 transition-colors flex items-center gap-1">
              Cổng thông tin CTUT
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* ==================== 1. FULL-WIDTH HEADER BANNER 1 (NỀN TRẮNG SẠCH) ==================== */}
      <div className="w-full bg-white border-b border-slate-200 relative overflow-hidden group">
        <div className="max-w-7xl mx-auto">
          <img 
            src="/image/banner-ctut-1.jpg" 
            alt="Banner Trường Đại học Kỹ thuật - Công nghệ Cần Thơ" 
            className="w-full h-auto object-cover max-h-[220px] sm:max-h-[260px] md:max-h-[300px] transition-transform duration-700 group-hover:scale-[1.008]"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/1600x300/0d3b66/ffffff?text=BANNER+CTUT+1'; }}
          />
        </div>
      </div>

      {/* ==================== 2. NAVIGATION BAR (NỀN TRẮNG - CHỮ XANH DƯƠNG SANG TRỌNG) ==================== */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Logo & Tên khi cuộn trang */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-white p-1 flex items-center justify-center border border-blue-200 shadow-sm">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Logo_ctuet.png" 
                  alt="Logo CTUT" 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <div>
                <span className="text-sm sm:text-base font-extrabold font-heading text-[#0d3b66] tracking-tight">
                  THƯ VIỆN SỐ CTUT
                </span>
                <p className="text-[10px] text-slate-500 hidden sm:block font-medium leading-none">Open Digital Library</p>
              </div>
            </Link>

            {/* Center: Navigation Tabs (Chuẩn 5 tab mẫu) */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-[#0d3b66] text-white shadow-md shadow-blue-900/20'
                        : 'text-slate-700 hover:text-[#0d3b66] hover:bg-blue-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-[#0d3b66]'}`} />
                    {item.name}
                  </Link>
                );
              })}
              {/* Admin link */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
                    location.pathname === '/admin'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-amber-700 hover:text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </nav>

            {/* Right: Auth Buttons / User Profile */}
            <div className="flex items-center gap-3">
              {user ? (
                /* Đã đăng nhập */
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                    <div className="w-7 h-7 rounded-full bg-[#0d3b66] text-white flex items-center justify-center text-xs font-bold">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-bold text-[#0d3b66] leading-none">{user.full_name.split(' ').slice(-1)[0]}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${roleBadgeColor(user.role)} font-semibold`}>
                        {roleLabel(user.role)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    id="navbar-logout-btn"
                    title="Đăng xuất"
                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
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
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-[#0d3b66] hover:bg-blue-50 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Đăng nhập
                  </Link>
                  <Link
                    to="/register"
                    id="navbar-register-link"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-[#0d3b66] hover:bg-[#082540] transition-all shadow-md shadow-blue-900/20 hover:scale-105 active:scale-95"
                  >
                    <UserPlus className="w-4 h-4 text-amber-300" />
                    Đăng ký CTUT ID
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </div>
  );
}
