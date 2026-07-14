import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, BookOpen, Users, RefreshCw, Trash2, Plus, Search,
  ChevronDown, BookMarked, AlertCircle, Loader2, X, Check,
  Clock, CheckCircle, AlertTriangle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

// ─── Helpers ───────────────────────────────────────────────
const statusBadge = (status) => {
  const map = {
    borrowing: { label: 'Đang mượn', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Clock },
    overdue:   { label: 'Quá hạn',   cls: 'bg-red-500/20 text-red-400 border-red-500/30',    icon: AlertTriangle },
    returned:  { label: 'Đã trả',    cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
  };
  const cfg = map[status] || { label: status, cls: 'bg-slate-700 text-slate-300', icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.cls}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
};

// ─── Modal thêm tài liệu ────────────────────────────────────
function AddDocumentModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    title: '', authors: '', category: 'Khoa học kỹ thuật',
    description: '', cover_url: '', file_path_url: '',
    publication_year: new Date().getFullYear(),
    total_copies: 3, available_copies: 3, is_open_access: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Khoa học kỹ thuật', 'Công nghệ thông tin', 'Kinh tế', 'Ngoại ngữ', 'Khoa học xã hội', 'Toán học', 'Vật lý', 'Hóa học'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.authors || !form.file_path_url) {
      setError('Vui lòng điền đầy đủ: Tên tài liệu, Tác giả, Link PDF.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/admin/documents', form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Lỗi khi thêm tài liệu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-400" />
            Thêm tài liệu mới
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 flex-1">
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}
          <form id="add-doc-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Tên tài liệu *</label>
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="Tiêu đề đầy đủ của tài liệu" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Tác giả *</label>
              <input value={form.authors} onChange={e => setForm({...form, authors: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="Tên tác giả, phân cách bằng dấu phẩy" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Chuyên mục</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Năm xuất bản</label>
              <input type="number" value={form.publication_year} onChange={e => setForm({...form, publication_year: +e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Link PDF / File *</label>
              <input value={form.file_path_url} onChange={e => setForm({...form, file_path_url: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="https://..." />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Ảnh bìa (URL)</label>
              <input value={form.cover_url} onChange={e => setForm({...form, cover_url: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                placeholder="https://..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Tổng số bản</label>
              <input type="number" min="1" value={form.total_copies} onChange={e => setForm({...form, total_copies: +e.target.value, available_copies: +e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`relative w-11 h-6 rounded-full transition-colors ${form.is_open_access ? 'bg-emerald-500' : 'bg-slate-700'}`}
                  onClick={() => setForm({...form, is_open_access: !form.is_open_access})}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.is_open_access ? 'left-6' : 'left-1'}`} />
                </div>
                <span className="text-sm text-slate-300">Open Access (Mở hoàn toàn)</span>
              </label>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-400 mb-1">Mô tả / Tóm tắt</label>
              <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
                placeholder="Tóm tắt nội dung tài liệu..." />
            </div>
          </form>
        </div>

        <div className="flex gap-3 p-6 border-t border-slate-800">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-sm hover:bg-slate-800 transition-colors">Hủy</button>
          <button form="add-doc-form" type="submit" disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Đang lưu...</> : <><Check className="w-4 h-4" />Thêm tài liệu</>}
          </button>
        </div>
      </div>
    </div>
  );
}


// ─── Main Admin Panel ───────────────────────────────────────
export default function AdminPanel() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('documents');
  const [documents, setDocuments] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [borrowFilter, setBorrowFilter] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login', { replace: true });
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    fetchData();
  }, [activeTab, borrowFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'documents') {
        const res = await api.get('/admin/documents', { params: { query: searchQuery || undefined } });
        setDocuments(res.data);
      } else if (activeTab === 'borrows') {
        const res = await api.get('/admin/borrows', { params: { status_filter: borrowFilter || undefined } });
        setBorrows(res.data);
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Bạn chắc chắn muốn xóa tài liệu:\n"${title}"?\n\nHành động này không thể hoàn tác.`)) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/documents/${id}`);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      alert(err.response?.data?.detail || 'Xóa thất bại.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData();
  };

  if (!isAdmin) return null;

  const tabs = [
    { id: 'documents', label: 'Quản lý Tài liệu', icon: BookMarked, count: documents.length },
    { id: 'borrows',   label: 'Lịch sử Mượn/Trả', icon: RefreshCw,   count: borrows.length },
    { id: 'users',     label: 'Danh sách Người dùng', icon: Users,    count: users.length },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Bảng quản trị hệ thống</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Xin chào, <span className="text-amber-400 font-medium">{user?.full_name}</span> — Quản trị viên Thư viện Số CTUT
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Tổng tài liệu', value: documents.length, icon: BookOpen, color: 'emerald' },
            { label: 'Lượt mượn/trả', value: borrows.length, icon: RefreshCw, color: 'blue' },
            { label: 'Người dùng', value: users.length, icon: Users, color: 'purple' },
          ].map(s => (
            <div key={s.label} className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4`}>
              <div className={`w-12 h-12 rounded-xl bg-${s.color}-500/15 flex items-center justify-center`}>
                <s.icon className={`w-6 h-6 text-${s.color}-400`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-slate-400 text-sm">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-800">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-xs">{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab: Documents */}
        {activeTab === 'documents' && (
          <div>
            <div className="flex gap-3 mb-5">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Tìm tên sách, tác giả..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500" />
              </form>
              <button onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-600/20">
                <Plus className="w-4 h-4" />
                Thêm tài liệu
              </button>
              <button onClick={fetchData} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left">
                      <th className="px-5 py-3.5 text-slate-400 font-medium">ID</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium">Tên tài liệu</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium">Tác giả</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium">Thể loại</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium text-center">Bản sao</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium text-center">Loại</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, i) => (
                      <tr key={doc.id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-900/30'}`}>
                        <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">#{doc.id}</td>
                        <td className="px-5 py-3.5">
                          <p className="text-white font-medium line-clamp-1">{doc.title}</p>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 line-clamp-1">{doc.authors}</td>
                        <td className="px-5 py-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs">{doc.category}</span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`font-medium ${doc.available_copies === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {doc.available_copies}/{doc.total_copies}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          {doc.is_open_access
                            ? <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Open Access</span>
                            : <span className="px-2 py-0.5 rounded-full text-xs bg-orange-500/15 text-orange-400 border border-orange-500/30">E-book giới hạn</span>
                          }
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <button
                            onClick={() => handleDelete(doc.id, doc.title)}
                            disabled={deletingId === doc.id}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                            title="Xóa tài liệu"
                          >
                            {deletingId === doc.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {documents.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-12 text-slate-500">Không tìm thấy tài liệu nào.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Borrows */}
        {activeTab === 'borrows' && (
          <div>
            <div className="flex gap-3 mb-5">
              <select value={borrowFilter} onChange={e => setBorrowFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500">
                <option value="">Tất cả trạng thái</option>
                <option value="borrowing">Đang mượn</option>
                <option value="overdue">Quá hạn</option>
                <option value="returned">Đã trả</option>
              </select>
              <button onClick={fetchData} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left">
                      <th className="px-5 py-3.5 text-slate-400 font-medium">ID</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium">Người dùng</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium">Tài liệu</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium">Ngày mượn</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium">Hạn trả</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {borrows.map((b, i) => (
                      <tr key={b.id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-900/30'}`}>
                        <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">#{b.id}</td>
                        <td className="px-5 py-3.5">
                          <p className="text-white text-sm">{b.user?.full_name || `User #${b.user_id}`}</p>
                          <p className="text-slate-500 text-xs">{b.user?.email}</p>
                        </td>
                        <td className="px-5 py-3.5 text-slate-300 line-clamp-1 max-w-xs">{b.document?.title || `Doc #${b.document_id}`}</td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs">{new Date(b.borrow_date).toLocaleDateString('vi-VN')}</td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs">{new Date(b.due_date).toLocaleDateString('vi-VN')}</td>
                        <td className="px-5 py-3.5">{statusBadge(b.status)}</td>
                      </tr>
                    ))}
                    {borrows.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-12 text-slate-500">Chưa có lượt mượn nào.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab: Users */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-end mb-5">
              <button onClick={fetchData} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-800 text-left">
                      <th className="px-5 py-3.5 text-slate-400 font-medium">ID</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium">Họ tên</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium">Email</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium">Vai trò</th>
                      <th className="px-5 py-3.5 text-slate-400 font-medium">Ngày đăng ký</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-900/30'}`}>
                        <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">#{u.id}</td>
                        <td className="px-5 py-3.5 text-white font-medium">{u.full_name}</td>
                        <td className="px-5 py-3.5 text-slate-400">{u.email}</td>
                        <td className="px-5 py-3.5">
                          {u.role === 'admin'
                            ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-amber-500/15 text-amber-400 border border-amber-500/30 font-medium"><Shield className="w-3 h-3" />Admin</span>
                            : <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-blue-500/15 text-blue-400 border border-blue-500/30 font-medium"><Users className="w-3 h-3" />{u.role}</span>
                          }
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs">{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-12 text-slate-500">Chưa có người dùng nào.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <AddDocumentModal
          onClose={() => setShowAddModal(false)}
          onSaved={fetchData}
        />
      )}
    </div>
  );
}
