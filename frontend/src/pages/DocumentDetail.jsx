import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Clock, CheckCircle2, AlertTriangle, ArrowLeft, Eye, RotateCcw, Lock } from 'lucide-react';
import api from '../services/api';
import PDFViewerModal from '../components/PDFViewerModal';

export default function DocumentDetail() {
  const { id } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Trạng thái modal đọc PDF
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [readData, setReadData] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.get(`/documents/${id}`);
      setDoc(res.data);
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || 'Không thể tải chi tiết tài liệu.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý Mượn sách
  const handleBorrow = async () => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      const res = await api.post('/borrow', { document_id: parseInt(id) });
      setSuccessMsg(`Mượn sách số thành công! Bạn có hạn đọc 7 ngày (đến ${new Date(res.data.due_date).toLocaleDateString('vi-VN')}).`);
      fetchDetail(); // Cập nhật lại số bản còn lại và trạng thái
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || 'Lỗi khi mượn sách.');
    }
  };

  // Hàm xử lý Trả sách trước hạn
  const handleReturn = async () => {
    try {
      setErrorMsg(null);
      setSuccessMsg(null);
      const res = await api.post('/return', { document_id: parseInt(id) });
      setSuccessMsg(res.data.message || 'Đã trả sách thành công.');
      fetchDetail();
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || 'Lỗi khi trả sách.');
    }
  };

  // Hàm xử lý Đọc trực tuyến (gọi API /api/documents/{id}/read kiểm tra quyền)
  const handleReadOnline = async () => {
    try {
      setErrorMsg(null);
      const res = await api.get(`/documents/${id}/read`);
      setReadData(res.data);
      setIsViewerOpen(true);
    } catch (error) {
      setErrorMsg(error.response?.data?.detail || 'Bạn không có quyền đọc trực tuyến tài liệu này.');
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-slate-400">Đang tải thông tin tài liệu...</div>;
  }

  if (!doc) {
    return (
      <div className="py-24 text-center">
        <p className="text-rose-400 mb-4">{errorMsg || 'Không tìm thấy tài liệu.'}</p>
        <Link to="/library" className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm">
          Quay lại kho sách
        </Link>
      </div>
    );
  }

  const isBorrowing = doc.current_user_borrow_status === 'borrowing' || doc.current_user_borrow_status === 'overdue';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Link */}
      <Link
        to="/library"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Kho Tài Liệu Nội Bộ
      </Link>

      {/* Messages */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cover / Info Card */}
        <div className="lg:col-span-1 flex flex-col items-center text-center">
          <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 relative shadow-2xl mb-6">
            <img
              src={doc.cover_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'}
              alt={doc.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              {doc.is_open_access ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-lg">
                  OPEN ACCESS
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-lg">
                  E-BOOK BẢN QUYỀN
                </span>
              )}
            </div>
          </div>

          <div className="w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Năm xuất bản:</span>
              <strong className="text-white">{doc.publication_year}</strong>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Lĩnh vực:</span>
              <strong className="text-emerald-400">{doc.category}</strong>
            </div>
            {!doc.is_open_access && (
              <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Số bản đồng thời:</span>
                <strong className="text-white">
                  {doc.available_copies} / {doc.total_copies} bản trống
                </strong>
              </div>
            )}
          </div>
        </div>

        {/* Details & Interactive Action Buttons */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              {doc.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-snug">
              {doc.title}
            </h1>
            <p className="text-sm text-slate-300 mt-2 font-medium">
              Tác giả: <span className="text-white">{doc.authors}</span>
            </p>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <h3 className="text-sm font-semibold text-white mb-2">Tóm tắt & Mô tả tài liệu:</h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {doc.description || 'Chưa có mô tả chi tiết cho tài liệu này.'}
              </p>
            </div>
          </div>

          {/* Smart Action Buttons Area */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            {doc.is_open_access ? (
              /* Trường hợp 1: Tài liệu Open Access -> Nút Đọc ngay */
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-emerald-500/10 border border-emerald-500/30 p-5 rounded-2xl">
                <div>
                  <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Tài liệu truy cập tự do (Open Access)
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Bạn không cần thực hiện thủ tục mượn. Nhấn nút bên dưới để đọc ngay file PDF.
                  </p>
                </div>
                <button
                  onClick={handleReadOnline}
                  className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/30 transition flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> Đọc Ngay (PDF)
                </button>
              </div>
            ) : isBorrowing ? (
              /* Trường hợp 2: Tài liệu giới hạn & Người dùng ĐANG MƯỢN */
              <div className="bg-indigo-500/10 border border-indigo-500/30 p-5 rounded-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" /> Quyền đọc trực tuyến đang hiệu lực
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Hạn mượn: {doc.due_date ? new Date(doc.due_date).toLocaleDateString('vi-VN') : '7 ngày'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleReadOnline}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" /> Đọc Trực Tuyến
                    </button>

                    <button
                      onClick={handleReturn}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Trả sách trước hạn
                    </button>
                  </div>
                </div>
              </div>
            ) : doc.available_copies > 0 ? (
              /* Trường hợp 3: Tài liệu giới hạn & Chưa mượn & Còn bản mượn */
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" /> Tài liệu giới hạn bản quyền E-book
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Nhấn "Mượn sách" để có quyền truy cập trực tuyến trong hạn mức 7 ngày.
                  </p>
                </div>

                <button
                  onClick={handleBorrow}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-sm font-bold shadow-lg transition flex items-center justify-center gap-2"
                >
                  Mượn sách (7 ngày)
                </button>
              </div>
            ) : (
              /* Trường hợp 4: Tài liệu giới hạn & Chưa mượn & HẾT BẢN MƯỢN */
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl">
                <div>
                  <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Hiện đã hết bản mượn đồng thời
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Toàn bộ {doc.total_copies} bản sách số đang được các độc giả khác mượn. Vui lòng quay lại sau.
                  </p>
                </div>

                <button
                  disabled
                  className="px-6 py-3 rounded-xl bg-slate-800 text-slate-500 text-sm font-bold cursor-not-allowed"
                >
                  Hết lượt mượn (0/{doc.total_copies})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Trình xem PDF */}
      <PDFViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        readData={readData}
      />
    </div>
  );
}
