import React, { useState } from 'react';
import { X, ShieldCheck, ZoomIn, ZoomOut, Maximize2, FileText, Lock, CheckCircle2 } from 'lucide-react';

export default function PDFViewerModal({ isOpen, onClose, readData }) {
  const [zoom, setZoom] = useState(100);

  if (!isOpen || !readData) return null;

  const isAccessOpen = readData.access_type === 'OPEN_ACCESS';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white line-clamp-1">
                {readData.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                {isAccessOpen ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Open Access (Đọc không giới hạn)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-indigo-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" /> Quyền đọc hợp lệ (Đang mượn sách)
                  </span>
                )}
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400">Độc giả: {readData.user_name}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setZoom((prev) => Math.max(60, prev - 10))}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-300 transition"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold px-2 text-slate-200">{zoom}%</span>
              <button
                onClick={() => setZoom((prev) => Math.min(150, prev + 10))}
                className="p-1.5 hover:bg-slate-700 rounded text-slate-300 transition"
                title="Phóng to"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 rounded-lg transition"
              title="Đóng trình đọc"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Security / Watermark Banner */}
        <div className="bg-slate-950/70 border-b border-slate-800/60 px-6 py-2 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Xác thực an toàn: <strong className="text-slate-200">{readData.watermark_text}</strong></span>
          </div>
          {readData.expires_at && (
            <span className="text-amber-400 font-medium">
              Hết hạn đọc: {new Date(readData.expires_at).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>

        {/* PDF Reader Content */}
        <div className="flex-1 bg-slate-950 relative overflow-auto flex items-center justify-center p-4">
          <div
            style={{ width: `${zoom}%`, height: '100%' }}
            className="transition-all duration-200 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
          >
            <iframe
              src={readData.file_path_url}
              className="w-full h-full border-0"
              title="Trình đọc tài liệu PDF"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <span>Trình xem tài liệu số bảo mật bởi Open Digital Library CTUT</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Đóng trình đọc
          </button>
        </div>
      </div>
    </div>
  );
}
