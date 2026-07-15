import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Sparkles, ShieldCheck, ArrowRight, Layers, Users, ExternalLink, Unlock } from 'lucide-react';
import api from '../services/api';

export default function Home() {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/documents');
      setDocuments(res.data);
    } catch (error) {
      console.error('Lỗi lấy danh sách tài liệu:', error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/library?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickTagClick = (tag) => {
    navigate(`/library?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="min-h-screen">
      {/* ==================== HERO SECTION V3 (BANNER 2 + TRA CỨU TRẮNG - XANH DƯƠNG) ==================== */}
      <section className="relative overflow-hidden pt-6 pb-16 bg-gradient-to-b from-blue-50/60 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">

          {/* HERO BANNER 2 CARD (TRUNG TÂM NỔI BẬT) */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-blue-200 shadow-xl group bg-white">
            <div className="relative">
              <img 
                src="/image/banner-ctut-2.jpg" 
                alt="Hero Banner Thư Viện CTUT" 
                className="w-full h-auto object-cover max-h-[380px] sm:max-h-[440px] md:max-h-[480px] transition-transform duration-700 group-hover:scale-[1.01]"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/1600x480/0d3b66/ffffff?text=BANNER+CTUT+2+-+THU+VIEN+CTUT'; }}
              />
            </div>
            {/* Thẻ thông điệp nổi bật ở góc banner */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-md border border-blue-200 text-[#0d3b66] text-xs font-bold shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Nơi Khởi Đầu Tri Thức &mdash; Mở Rộng Tương Lai</span>
            </div>
          </div>

          {/* KHUNG TRA CỨU HỌC LIỆU SÁNG TẠO (TRẮNG SẠCH - VIỀN XANH DƯƠNG) */}
          <div className="max-w-4xl mx-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-blue-200 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/40 rounded-full blur-3xl pointer-events-none"></div>

              <div className="text-center space-y-2 mb-6">
                <span className="px-3.5 py-1 rounded-full bg-blue-100 text-[#0d3b66] text-xs font-bold uppercase tracking-wider border border-blue-200">
                  Cổng Tra Cứu Thông Minh CTUT
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-[#0d3b66] pt-1">
                  Tìm Kiếm Học Liệu & Cơ Sở Dữ Liệu Số
                </h2>
                <p className="text-sm text-slate-600 max-w-xl mx-auto">
                  Truy cập nhanh hơn 10,000 tài liệu nội bộ, giáo trình điện tử và các bài báo khoa học quốc tế (arXiv, DOAJ)
                </p>
              </div>

              {/* Search Bar Input + Button */}
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow flex items-center">
                  <Search className="absolute left-4.5 w-5 h-5 text-[#0d3b66] ml-4" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nhập tên sách, tác giả, mã tài liệu hoặc từ khóa Kỹ thuật - Công nghệ..." 
                    className="w-full bg-slate-50 text-slate-800 placeholder-slate-400 pl-12 pr-4 py-4 rounded-2xl border border-blue-200 focus:outline-none focus:border-[#0d3b66] focus:bg-white focus:ring-4 focus:ring-blue-500/15 text-sm font-medium transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  className="flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#0d3b66] hover:bg-[#082540] text-white font-extrabold text-sm transition-all shadow-lg shadow-blue-900/20 flex-shrink-0"
                >
                  <Search className="w-4 h-4 text-amber-300" />
                  Tìm kiếm tài liệu
                </button>
              </form>

              {/* Chuyên ngành mũi nhọn Pill Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
                <span className="font-bold text-[#0d3b66]">Chuyên ngành:</span>
                <button type="button" onClick={() => handleQuickTagClick('Công nghệ thông tin')} className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-[#0d3b66] hover:text-white text-[#0d3b66] transition-all border border-blue-200/60 font-semibold">💻 Công nghệ Thông tin</button>
                <button type="button" onClick={() => handleQuickTagClick('Điện tử')} className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-[#0d3b66] hover:text-white text-[#0d3b66] transition-all border border-blue-200/60 font-semibold">⚡ Kỹ thuật Điện - Điện tử</button>
                <button type="button" onClick={() => handleQuickTagClick('Xây dựng')} className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-[#0d3b66] hover:text-white text-[#0d3b66] transition-all border border-blue-200/60 font-semibold">🏗️ Kỹ thuật Xây dựng</button>
                <button type="button" onClick={() => handleQuickTagClick('Sinh hóa')} className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-[#0d3b66] hover:text-white text-[#0d3b66] transition-all border border-blue-200/60 font-semibold">🧪 Công nghệ Sinh - Hóa</button>
                <button type="button" onClick={() => navigate('/library')} className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-700 hover:bg-amber-500 hover:text-white transition-all border border-amber-300 font-bold flex items-center gap-1">
                  <Unlock className="w-3.5 h-3.5" /> Open Access 100%
                </button>
              </div>
            </div>
          </div>

          {/* QUICK STATS CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-md hover:shadow-lg transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0d3b66] flex items-center justify-center flex-shrink-0 border border-blue-200">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold font-heading text-[#0d3b66]">10,000+</p>
                <p className="text-xs text-slate-600 font-medium">Tài liệu & Giáo trình</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-md hover:shadow-lg transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-200">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold font-heading text-[#0d3b66]">5,000+</p>
                <p className="text-xs text-slate-600 font-medium">Sinh viên & Giảng viên</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-md hover:shadow-lg transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 border border-teal-200">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold font-heading text-[#0d3b66]">100%</p>
                <p className="text-xs text-slate-600 font-medium">Kết nối Số hóa</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-blue-100 shadow-md hover:shadow-lg transition-shadow flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 border border-emerald-200">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold font-heading text-[#0d3b66]">24/7</p>
                <p className="text-xs text-slate-600 font-medium">Truy cập mọi lúc</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ==================== FEATURED DOCUMENTS SECTION (GIỮ NGUYÊN HOÀN TOÀN LOGIC & DỮ LIỆU HIỂN THỊ TÀI LIỆU) ==================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-[#0d3b66] flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-[#0d3b66]" />
              Kho Tài Liệu Nổi Bật Nội Bộ
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              Bao gồm tài liệu mở Open Access và E-book bản quyền giới hạn lượt mượn.
            </p>
          </div>
          <Link
            to="/library"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0d3b66] hover:bg-[#082540] text-sm font-bold text-white transition shadow-md shadow-blue-900/15"
          >
            Xem tất cả tài liệu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.slice(0, 6).map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl p-6 flex flex-col justify-between border border-slate-200 hover:border-[#0d3b66] shadow-sm hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 text-[#0d3b66] border border-blue-200">
                    {doc.category}
                  </span>
                  {doc.is_open_access ? (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Open Access
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      E-book Bản quyền
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#0d3b66] line-clamp-2 group-hover:text-blue-700 transition">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 font-semibold">
                  Tác giả: <span className="text-slate-700 font-medium">{doc.authors}</span>
                </p>

                <p className="text-sm text-slate-600 mt-3 line-clamp-3 leading-relaxed font-normal">
                  {doc.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {doc.is_open_access ? (
                    <span className="text-xs text-emerald-700 font-bold">
                      Đọc trực tiếp 100%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 font-medium">
                      Còn trống: <strong className="text-[#0d3b66] font-bold">{doc.available_copies}/{doc.total_copies}</strong> bản
                    </span>
                  )}
                </div>

                <Link
                  to={`/library/${doc.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-[#0d3b66] text-[#0d3b66] hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-blue-200/80"
                >
                  Chi tiết & Đọc <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
