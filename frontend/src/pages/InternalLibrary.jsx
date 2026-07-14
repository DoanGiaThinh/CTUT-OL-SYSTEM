import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen, CheckCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function InternalLibrary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [openAccessFilter, setOpenAccessFilter] = useState('all'); // 'all', 'open', 'limited'

  const categories = ['Tất cả', 'Công nghệ thông tin', 'Kỹ thuật phần mềm', 'Toán học & Thống kê', 'Cơ sở dữ liệu', 'An toàn thông tin'];

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory, openAccessFilter]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (query.trim()) params.query = query.trim();
      if (selectedCategory !== 'Tất cả') params.category = selectedCategory;
      if (openAccessFilter === 'open') params.open_access_only = true;
      if (openAccessFilter === 'limited') params.open_access_only = false;

      const res = await api.get('/documents', { params });
      setDocuments(res.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách tài liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDocuments();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Kho Tài Liệu Số Nội Bộ</h1>
          <p className="text-sm text-slate-400 mt-1">
            Quản lý sách giáo trình, E-book nghiên cứu với cơ chế kiểm soát quyền đọc và mượn trả có thời hạn.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpenAccessFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              openAccessFilter === 'all'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setOpenAccessFilter('open')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              openAccessFilter === 'open'
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Open Access
          </button>
          <button
            onClick={() => setOpenAccessFilter('limited')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              openAccessFilter === 'limited'
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            E-book Bản Quyền
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mt-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 font-semibold'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full lg:w-80">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên, tác giả..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition"
          >
            Lọc
          </button>
        </form>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Đang tải danh sách tài liệu...</div>
      ) : documents.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-slate-400">Không tìm thấy tài liệu nào phù hợp.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-slate-800/90 hover:border-emerald-500/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {doc.category}
                  </span>
                  {doc.is_open_access ? (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Open Access
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      E-book Bản quyền
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white line-clamp-2">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5">
                  Tác giả: <span className="text-slate-200">{doc.authors}</span> ({doc.publication_year})
                </p>

                <p className="text-sm text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  {doc.is_open_access ? (
                    <span className="text-xs text-emerald-400 font-semibold">
                      • Đọc trực tuyến ngay
                    </span>
                  ) : doc.available_copies > 0 ? (
                    <span className="text-xs text-slate-300">
                      Còn trống: <strong className="text-emerald-400">{doc.available_copies}/{doc.total_copies}</strong> bản
                    </span>
                  ) : (
                    <span className="text-xs text-rose-400 font-semibold">
                      • Hết lượt mượn (0/{doc.total_copies})
                    </span>
                  )}
                </div>

                <Link
                  to={`/library/${doc.id}`}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 hover:from-emerald-500 hover:to-teal-600 hover:text-white text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5 border border-slate-700 hover:border-transparent"
                >
                  Xem chi tiết <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
