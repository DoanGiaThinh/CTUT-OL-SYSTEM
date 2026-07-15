import React from 'react';
import { BookOpen, ShieldCheck, Globe, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-20 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#0d3b66] p-1 flex items-center justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Logo_ctuet.png" alt="CTUT" className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-lg font-heading text-[#0d3b66]">THƯ VIỆN SỐ CTUT</span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Hệ thống Thư viện số mở Đại học Kỹ thuật - Công nghệ Cần Thơ, kết nối học thuật quốc tế (arXiv, DOAJ) và tạp chí khoa học trực tuyến Việt Nam (VJOL), phục vụ giảng viên và sinh viên.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#0d3b66] mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500" /> Nguồn Kết Nối
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 font-medium">
              <li>• arXiv API (Cornell University)</li>
              <li>• Directory of Open Access Journals (DOAJ)</li>
              <li>• Vietnam Journals Online (VJOL)</li>
              <li>• Kho E-book Bản Quyền Nội Bộ CTUT</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-[#0d3b66] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Bảo Mật & Bản Quyền
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Tài liệu nội bộ được bảo vệ qua hệ thống phân quyền kỹ thuật số CTUT ID và hạn mức mượn/trả E-book có bản quyền.
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p className="font-semibold text-slate-600">© 2024 Trường Đại học Kỹ thuật - Công nghệ Cần Thơ (Can Tho University of Technology). All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-medium">Hệ Thống Thư Viện Số Mở CTUT &bull; Open Digital Library</p>
        </div>
      </div>
    </footer>
  );
}
