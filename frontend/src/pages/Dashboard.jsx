import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle2, RotateCcw, Eye, Bookmark, Trash2, AlertCircle, ShieldCheck, ExternalLink } from 'lucide-react';
import api from '../services/api';
import PDFViewerModal from '../components/PDFViewerModal';

export default function Dashboard() {
  const [borrowedList, setBorrowedList] = useState([]);
  const [savedArticles, setSavedArticles] = useState([]);
  const [activeTab, setActiveTab] = useState('borrowed'); // 'borrowed' | 'saved'
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);

  // Trạng thái modal đọc trực tuyến
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [readData, setReadData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [borrowRes, savedRes] = await Promise.all([
        api.get('/user/borrowed-list'),
        api.get('/saved-articles')
      ]);
      setBorrowedList(borrowRes.data);
      setSavedArticles(savedRes.data);
    } catch (error) {
      console.error('Lỗi khi tải tủ sách cá nhân:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReturn = async (borrowRecordId) => {
    try {
      setMsg(null);
      const res = await api.post('/return', { borrow_record_id: borrowRecordId });
      setMsg({ type: 'success', text: res.data.message });
      fetchData();
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.detail || 'Lỗi khi trả sách.' });
    }
  };

  const handleReadOnline = async (documentId) => {
    try {
      setMsg(null);
      const res = await api.get(`/documents/${documentId}/read`);
      setReadData(res.data);
      setIsViewerOpen(true);
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.detail || 'Lỗi kiểm tra quyền đọc.' });
    }
  };

  const handleRemoveSavedArticle = async (id) => {
    try {
      await api.delete(`/saved-articles/${id}`);
      setSavedArticles(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Lỗi khi xóa bài báo:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Profile Summary */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Khu vực cá nhân sinh viên / độc giả
          </span>
          <h1 className="text-3xl font-extrabold text-white mt-1">Tủ Sách Cá Nhân & Lịch Sử Mượn Trả</h1>
          <p className="text-sm text-slate-400 mt-1">
            Quản lý sách số đang giữ, theo dõi hạn trả trước khi hết hạn và các bài báo khoa học đã lưu.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-lg font-bold text-emerald-400">{borrowedList.length}</div>
            <p className="text-[11px] text-slate-400">Sách đang mượn</p>
          </div>
          <div className="px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-lg font-bold text-teal-400">{savedArticles.length}</div>
            <p className="text-[11px] text-slate-400">Bài báo đã lưu</p>
          </div>
        </div>
      </div>

      {/* Alert Message */}
      {msg && (
        <div
          className={`mt-6 p-4 rounded-xl border text-sm flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-xs underline ml-4">
            Đóng
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mt-8 flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab('borrowed')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'borrowed'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Sách Số Đang Mượn ({borrowedList.length})
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'saved'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" /> Bài Báo Đã Lưu từ arXiv/DOAJ/VJOL ({savedArticles.length})
        </button>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">Đang tải thông tin...</div>
      ) : activeTab === 'borrowed' ? (
        borrowedList.length === 0 ? (
          <div className="py-20 text-center glass-card rounded-2xl mt-6">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Bạn hiện chưa mượn cuốn sách số nào.</p>
            <Link
              to="/library"
              className="mt-4 inline-block px-5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition"
            >
              Khám phá Kho Sách Nội Bộ ngay
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {borrowedList.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-16 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0">
                    <img
                      src={item.document?.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'}
                      alt={item.document?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                        E-BOOK BẢN QUYỀN
                      </span>
                      {item.status === 'overdue' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          QUÁ HẠN TRẢ
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          ĐANG TRONG HẠN
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mt-1.5">
                      {item.document?.title || 'Tài liệu số'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-2">
                      <span>Mượn ngày: {new Date(item.borrow_date).toLocaleDateString('vi-VN')}</span>
                      <span>•</span>
                      <span>Hạn trả: <strong className="text-white">{new Date(item.due_date).toLocaleDateString('vi-VN')}</strong></span>
                      <span>•</span>
                      <span className="text-amber-400 font-semibold">
                        Còn lại: {item.days_remaining} ngày
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <button
                    onClick={() => handleReadOnline(item.document_id)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Đọc trực tuyến
                  </button>

                  <button
                    onClick={() => handleQuickReturn(item.id)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Trả sách nhanh
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Saved Articles Tab */
        savedArticles.length === 0 ? (
          <div className="py-20 text-center glass-card rounded-2xl mt-6">
            <Bookmark className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Bạn chưa lưu bài báo nghiên cứu nào.</p>
            <Link
              to="/search"
              className="mt-4 inline-block px-5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition"
            >
              Tra cứu arXiv/DOAJ/VJOL ngay
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedArticles.map((article) => (
              <div
                key={article.id}
                className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Nguồn: {article.source}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Lưu ngày {new Date(article.saved_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {article.authors || 'Tác giả mở'}
                  </p>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {article.abstract || 'Không có tóm tắt.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  {article.pdf_url ? (
                    <a
                      href={article.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:underline"
                    >
                      Mở file PDF gốc <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500">Xem tóm tắt</span>
                  )}

                  <button
                    onClick={() => handleRemoveSavedArticle(article.id)}
                    className="p-1.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition"
                    title="Xóa khỏi tủ sách"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Modal Đọc trực tuyến */}
      <PDFViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        readData={readData}
      />
    </div>
  );
}
