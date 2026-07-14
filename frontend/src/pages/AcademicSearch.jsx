import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Globe, Bookmark, ExternalLink, Check, Sparkles, Filter } from 'lucide-react';
import api from '../services/api';

export default function AcademicSearch() {
  const [searchParams] = useSearchParams();
  const initialSource = searchParams.get('source') || 'all';

  const [query, setQuery] = useState('Artificial Intelligence');
  const [source, setSource] = useState(initialSource);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());

  useEffect(() => {
    fetchResults();
  }, [source]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await api.get('/external/search', {
        params: { query: query.trim() || 'all', source }
      });
      setResults(res.data);
      const saved = new Set();
      res.data.forEach(item => {
        if (item.is_saved) saved.add(item.external_id);
      });
      setSavedIds(saved);
    } catch (error) {
      console.error('Lỗi khi tra cứu học thuật:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResults();
  };

  const handleSaveArticle = async (article) => {
    try {
      await api.post('/saved-articles', {
        external_id: article.external_id,
        source: article.source,
        title: article.title,
        authors: article.authors,
        abstract: article.abstract,
        pdf_url: article.pdf_url
      });
      setSavedIds(prev => new Set(prev).add(article.external_id));
    } catch (error) {
      console.error('Lỗi khi lưu bài báo:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <Globe className="w-3.5 h-3.5" /> Tra cứu Học thuật Quốc tế & Việt Nam
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Cổng Tìm Kiếm Học Thuật Mở (arXiv / DOAJ / VJOL)
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Kết nối thời gian thực tới các kho lưu trữ bài báo khoa học hàng đầu thế giới và tạp chí nghiên cứu Việt Nam.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nhập từ khóa bài báo nghiên cứu (ví dụ: Transformer, NLP, Thư viện số...)..."
                className="w-full pl-10 pr-4 py-2.5 bg-transparent border-0 text-white placeholder-slate-500 text-sm focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none"
              >
                <option value="all">Tất cả kho (arXiv + DOAJ + VJOL)</option>
                <option value="arxiv">arXiv API (Cornell Univ)</option>
                <option value="doaj">DOAJ (Open Access Journals)</option>
                <option value="vjol">VJOL (Tạp chí VN)</option>
              </select>

              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition whitespace-nowrap"
              >
                Tra cứu
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results */}
      <div className="mt-12">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="inline-block animate-spin w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full mb-2"></div>
            <p>Đang tìm kiếm bài báo khoa học thời gian thực...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            Không tìm thấy bài báo nào cho từ khóa "{query}".
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-400 font-medium">
              Tìm thấy <strong className="text-white">{results.length}</strong> bài báo học thuật:
            </p>

            {results.map((item) => {
              const isSaved = savedIds.has(item.external_id);
              return (
                <div
                  key={item.external_id}
                  className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row md:items-start justify-between gap-6"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.source === 'arXiv'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : item.source === 'DOAJ'
                            ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        Kho: {item.source}
                      </span>
                      {item.published_date && (
                        <span className="text-xs text-slate-400">• Năm/Ngày công bố: {item.published_date}</span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white hover:text-emerald-400 transition">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-300 mt-1 font-medium">
                      Tác giả: <span className="text-slate-400">{item.authors}</span>
                    </p>

                    <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                      {item.abstract}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-center justify-end gap-2 flex-shrink-0">
                    <a
                      href={item.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      Mở PDF <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      onClick={() => !isSaved && handleSaveArticle(item)}
                      disabled={isSaved}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                        isSaved
                          ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Đã lưu vào tủ sách
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" /> Lưu bài báo
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
