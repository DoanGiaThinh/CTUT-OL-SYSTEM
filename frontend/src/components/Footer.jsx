import React from 'react';
import { BookOpen, ShieldCheck, Globe, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-6 h-6 text-emerald-400" />
              <span className="font-bold text-lg text-white">Open Digital Library</span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Hệ thống Thư viện số mở tích hợp kết nối học thuật quốc tế (arXiv, DOAJ) và tạp chí khoa học trực tuyến Việt Nam (VJOL), phục vụ nghiên cứu và học tập không giới hạn.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" /> Nguồn Kết Nối
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• arXiv API (Cornell University)</li>
              <li>• Directory of Open Access Journals (DOAJ)</li>
              <li>• Vietnam Journals Online (VJOL)</li>
              <li>• Kho E-book Bản Quyền Nội Bộ</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Bảo Mật & Bản Quyền
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tài liệu nội bộ được kiểm soát qua hệ thống phân quyền kỹ thuật số và watermark truy xuất bảo mật theo hạn mức mượn/trả.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Open Digital Library - CTUT. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Thiết kế bởi Chuyên gia Kiến trúc Phần mềm Full-Stack</p>
        </div>
      </div>
    </footer>
  );
}
