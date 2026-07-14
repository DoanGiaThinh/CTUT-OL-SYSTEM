import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BookOpen, Sparkles, ShieldCheck, ArrowRight, Layers, Users, ExternalLink } from 'lucide-react';
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-indigo-500/20 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Nền tảng Thư viện Số Mở Tích hợp Học thuật Quốc tế & Nội bộ</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Khám Phá Tri Thức <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Không Giới Hạn & Quản Trị Số
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Tra cứu trực tiếp hàng triệu bài báo học thuật từ <strong className="text-white">arXiv, DOAJ, VJOL</strong> cùng hệ thống đọc trực tuyến và mượn/trả E-book có bản quyền hiện đại.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="mt-10 max-w-2xl mx-auto">
            <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 shadow-2xl focus-within:border-emerald-500/60 transition">
              <Search className="w-5 h-5 text-slate-400 ml-3 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tài liệu nội bộ hoặc từ khóa học thuật (AI, Deep Learning...)..."
                className="w-full bg-transparent border-0 text-white placeholder-slate-400 text-sm focus:outline-none py-2.5"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
              >
                Tìm kiếm <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick links */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
            <span>Tìm kiếm chuyên sâu:</span>
            <Link to="/search?source=arxiv" className="hover:text-emerald-400 underline transition">
              arXiv (Khoa học & AI)
            </Link>
            <span>•</span>
            <Link to="/search?source=doaj" className="hover:text-emerald-400 underline transition">
              DOAJ (Open Access)
            </Link>
            <span>•</span>
            <Link to="/search?source=vjol" className="hover:text-emerald-400 underline transition">
              VJOL (Tạp chí Việt Nam)
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-5 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">2.4M+</div>
              <p className="text-xs text-slate-400 mt-1">Bài báo arXiv & DOAJ</p>
            </div>
            <div className="glass-card p-5 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">100%</div>
              <p className="text-xs text-slate-400 mt-1">Đọc trực tuyến PDF</p>
            </div>
            <div className="glass-card p-5 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">{documents.length}</div>
              <p className="text-xs text-slate-400 mt-1">E-book & Giáo trình Nội bộ</p>
            </div>
            <div className="glass-card p-5 rounded-2xl text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">7 Ngày</div>
              <p className="text-xs text-slate-400 mt-1">Hạn mức mượn sách số</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Documents Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              Kho Tài Liệu Nổi Bật Nội Bộ
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Bao gồm tài liệu mở Open Access và E-book bản quyền giới hạn lượt mượn.
            </p>
          </div>
          <Link
            to="/library"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-emerald-500/50 text-sm font-medium text-slate-200 hover:text-white transition"
          >
            Xem tất cả tài liệu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.slice(0, 6).map((doc) => (
            <div
              key={doc.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-slate-800 hover:border-emerald-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700">
                    {doc.category}
                  </span>
                  {doc.is_open_access ? (
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Open Access
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      E-book Bản quyền
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white line-clamp-2 group-hover:text-emerald-400 transition">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 font-medium">
                  Tác giả: <span className="text-slate-300">{doc.authors}</span>
                </p>

                <p className="text-sm text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  {doc.is_open_access ? (
                    <span className="text-xs text-emerald-400 font-medium">
                      Đọc trực tiếp 100%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Còn trống: <strong className="text-white">{doc.available_copies}/{doc.total_copies}</strong> bản
                    </span>
                  )}
                </div>

                <Link
                  to={`/library/${doc.id}`}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-white text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
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
