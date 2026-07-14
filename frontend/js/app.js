/**
 * CTUT Open Digital Library - Core Application Logic
 * Integrates OAI-PMH harvested metadata & direct links to arXiv, DOAJ, VJOL, PMC...
 */

const API_BASE = window.location.origin.includes("8000") ? "" : "http://localhost:8000";

// Complete Local Fallback Database Dataset
const DATABASES_DATA = [
    {
        id: 1,
        name: "arXiv (Cornell University)",
        url: "https://arxiv.org/",
        description: "Kho lưu trữ bản thảo điện tử truy cập mở (Open Access Preprints) hàng đầu thế giới với hơn 2.4 triệu bài nghiên cứu thuộc Khoa học Máy tính, Toán học, Vật lý, Trí tuệ nhân tạo (AI), Sinh học định lượng và Tài chính.",
        status: "active",
        logo: "https://static.arxiv.org/static/browse/0.3.4/images/arxiv-logo-fb.png",
        access_type: "100% Miễn phí / Open Access",
        doc_count: "2,400,000+ tài liệu",
        badge_color: "cyan",
        categories: ["CNTT", "TOAN_LY"],
        search_syntax: "ti:deep learning AND au:bengio",
        guide_tip: "Tải toàn văn PDF tức thì không cần đăng ký tài khoản. Là nguồn tài liệu mới nhất trước khi công bố trên các tạp chí."
    },
    {
        id: 2,
        name: "DOAJ (Directory of Open Access Journals)",
        url: "https://doaj.org/",
        description: "Danh mục Tạp chí Truy cập Mở Quốc tế uy tín nhất thế giới, lập chỉ mục hơn 20,000 tạp chí khoa học có bình duyệt (Peer-Reviewed) đa ngành với hơn 9.5 triệu bài báo toàn văn miễn phí.",
        status: "active",
        logo: "https://doaj.org/static/doaj/images/logo-doaj.png",
        access_type: "100% Miễn phí / Peer-Reviewed",
        doc_count: "9,500,000+ bài báo",
        badge_color: "emerald",
        categories: ["CNTT", "TOAN_LY", "Y_DUOC", "KT_CN", "KHXH"],
        search_syntax: "keyword:artificial intelligence AND license:CC-BY",
        guide_tip: "Cho phép lọc theo chứng chỉ Creative Commons và tạp chí không thu phí xử lý bài báo (Diamond Open Access)."
    },
    {
        id: 3,
        name: "VJOL (Vietnam Journals Online)",
        url: "https://vjol.info.vn/",
        description: "Cơ sở dữ liệu Tạp chí Khoa học Việt Nam trực tuyến do Cục Thông tin KH&CN Quốc gia (NASATI) quản lý. Tổng hợp các tạp chí khoa học uy tín xuất bản tại Việt Nam thuộc đủ các lĩnh vực tự nhiên, xã hội và kỹ thuật.",
        status: "active",
        logo: "https://vjol.info.vn/public/site/images/admin/logo-vjol.png",
        access_type: "Miễn phí / Tạp chí KH Việt Nam",
        doc_count: "15,000+ bài nghiên cứu",
        badge_color: "rose",
        categories: ["CNTT", "KT_CN", "KHXH", "KINH_TE"],
        search_syntax: "từ khóa tiếng Việt: chuyển đổi số giáo dục đại học",
        guide_tip: "Nguồn tham khảo cực kỳ giá trị cho đồ án, luận văn gắn liền với thực tiễn nghiên cứu khoa học tại Việt Nam."
    },
    {
        id: 4,
        name: "PubMed Central (PMC - NIH/NLM)",
        url: "https://www.ncbi.nlm.nih.gov/pmc/",
        description: "Thư viện số y sinh học và khoa học sự sống miễn phí của Thư viện Y khoa Quốc gia Hoa Kỳ (NLM) thuộc Viện Y tế Quốc gia (NIH), cung cấp toàn văn miễn phí hàng triệu bài báo nghiên cứu lâm sàng và sinh học.",
        status: "active",
        logo: "https://www.ncbi.nlm.nih.gov/pmc/static/img/pmc-logo.png",
        access_type: "100% Miễn phí / Toàn văn",
        doc_count: "9,000,000+ bài báo",
        badge_color: "blue",
        categories: ["Y_DUOC"],
        search_syntax: "COVID-19 vaccine effectiveness AND free fulltext[sb]",
        guide_tip: "Tài liệu y sinh học đạt độ tin cậy chuẩn mực quốc tế cao nhất từ Viện Y tế Hoa Kỳ."
    },
    {
        id: 5,
        name: "CORE (Connecting Repositories)",
        url: "https://core.ac.uk/",
        description: "Cỗ máy tìm kiếm bài báo truy cập mở toàn cầu lớn nhất, tổng hợp siêu dữ liệu và toàn văn từ hàng ngàn kho lưu trữ của các trường đại học và viện nghiên cứu trên khắp thế giới.",
        status: "active",
        logo: "https://core.ac.uk/images/logo.png",
        access_type: "100% Miễn phí / Aggregator",
        doc_count: "260,000,000+ tài liệu",
        badge_color: "amber",
        categories: ["CNTT", "TOAN_LY", "Y_DUOC", "KT_CN", "KHXH"],
        search_syntax: "title:(quantum computing) AND year:>2022",
        guide_tip: "Giúp bạn quét cùng lúc hàng nghìn kho lưu trữ đại học (institutional repositories) trên toàn thế giới."
    },
    {
        id: 6,
        name: "Zenodo (CERN & OpenAIRE)",
        url: "https://zenodo.org/",
        description: "Kho lưu trữ khoa học mở đa ngành do CERN phát triển, cho phép các nhà nghiên cứu chia sẻ bài báo, bộ dữ liệu (dataset), phần mềm và tài liệu nghiên cứu dưới chứng chỉ Creative Commons.",
        status: "active",
        logo: "https://zenodo.org/static/images/zenodo-logo.svg",
        access_type: "100% Miễn phí / DOI Gán nhãn",
        doc_count: "3,000,000+ bản ghi",
        badge_color: "purple",
        categories: ["CNTT", "TOAN_LY"],
        search_syntax: "resource_type:dataset AND keywords:machine learning",
        guide_tip: "Ngoài bài báo, Zenodo còn cung cấp hàng vạn bộ dữ liệu (Datasets) và mã nguồn mở phục vụ huấn luyện AI."
    },
    {
        id: 7,
        name: "PLOS (Public Library of Science)",
        url: "https://plos.org/",
        description: "Tổ chức xuất bản khoa học phi lợi nhuận truy cập mở hàng đầu, phát hành các tạp chí uy tín toàn cầu như PLOS ONE, PLOS Biology, PLOS Computational Biology với quy trình bình duyệt nghiêm ngặt.",
        status: "active",
        logo: "https://plos.org/wp-content/uploads/2020/06/plos-logo.png",
        access_type: "Open Access / Peer-Reviewed",
        doc_count: "300,000+ bài báo",
        badge_color: "teal",
        categories: ["Y_DUOC", "CNTT"],
        search_syntax: "bioinformatics AND publication_date:[2023 TO 2026]",
        guide_tip: "Tạp chí PLOS ONE nổi tiếng với tiêu chuẩn thẩm định chất lượng thực nghiệm nghiêm ngặt."
    },
    {
        id: 8,
        name: "IEEE Open Access",
        url: "https://open.ieee.org/",
        description: "Cổng truy cập mở của Hiệp hội Kỹ sư Điện & Điện tử (IEEE), bao gồm IEEE Access và các tạp chí truy cập mở hoàn toàn về công nghệ viễn thông, máy tính, tự động hóa và năng lượng.",
        status: "active",
        logo: "https://open.ieee.org/wp-content/uploads/ieee-oa-logo.png",
        access_type: "Open Access Journals",
        doc_count: "120,000+ bài nghiên cứu",
        badge_color: "indigo",
        categories: ["CNTT", "KT_CN"],
        search_syntax: "wireless 6G networks AND open access",
        guide_tip: "Nguồn tài liệu chuẩn mực hàng đầu cho ngành Điện, Điện tử, Viễn thông & Kỹ thuật máy tính."
    }
];

const ARTICLES_DATA = [
    {
        id: 1,
        db_id: 1,
        db_name: "arXiv",
        identifier: "oai:arXiv.org:2401.01234",
        title: "Attention Is All You Need: Advanced Transformer Architectures for Vietnamese Language Processing",
        authors: "Nguyen Van A, Tran Thi B, Le Hoang C",
        abstract: "Nghiên cứu này khảo sát các mô hình Transformer tiên tiến ứng dụng cho xử lý ngôn ngữ tự nhiên tiếng Việt, tối ưu hóa hiệu suất trên các tập dữ liệu quy mô lớn và giảm chi phí tính toán.",
        date_published: "2024-03-15",
        url: "https://arxiv.org/abs/2401.01234"
    },
    {
        id: 2,
        db_id: 1,
        db_name: "arXiv",
        identifier: "oai:arXiv.org:2402.05678",
        title: "Deep Reinforcement Learning for Smart Grid Energy Optimization and Renewable Integration",
        authors: "Pham Minh D, Hoang Quang E",
        abstract: "Bài báo đề xuất mô hình học tăng cường sâu (Deep Reinforcement Learning) nhằm điều phối và tối ưu hóa phân phối năng lượng trong lưới điện thông minh với tích hợp năng lượng tái tạo.",
        date_published: "2024-04-10",
        url: "https://arxiv.org/abs/2402.05678"
    },
    {
        id: 3,
        db_id: 2,
        db_name: "DOAJ",
        identifier: "doaj:article:10.1186/s12859-024-00123",
        title": "Open Access Publishing Trends in Southeast Asian Higher Education Institutions: A 10-Year Study",
        authors: "Nguyen Thanh T, Smith J R, Garcia M",
        abstract: "Phân tích xu hướng phát triển thư viện số mở và xuất bản truy cập mở tại các trường đại học Đông Nam Á trong giai đoạn 2018-2024, phân tích tác động tích cực đến số lượng trích dẫn khoa học.",
        date_published: "2024-02-20",
        url: "https://doaj.org/"
    },
    {
        id: 4,
        db_id: 3,
        db_name: "VJOL",
        identifier: "vjol:article:ctut:2024:101",
        title": "Ứng dụng Trí tuệ Nhân tạo trong Xây dựng Hệ thống Thư viện Số Mở cho Trường Đại học Kỹ thuật Công nghệ",
        authors: "Đoàn Gia T, Nguyễn Văn M",
        abstract: "Bài báo giới thiệu kiến trúc hệ thống Thư viện Số Mở tích hợp chuẩn OAI-PMH nhằm tự động hóa việc thu thập metadata từ các CSDL uy tín như arXiv, DOAJ, VJOL phục vụ giảng viên và sinh viên.",
        date_published: "2024-05-12",
        url: "https://vjol.info.vn/"
    },
    {
        id: 5,
        db_id: 3,
        db_name: "VJOL",
        identifier: "vjol:article:ctut:2024:102",
        title": "Đánh giá hiệu năng giải thuật phân cụm dữ liệu lớn trên nền tảng Apache Spark và Hadoop",
        authors: "Lê Văn K, Trần Thị N",
        abstract: "Thực nghiệm và so sánh hiệu năng các giải thuật K-Means, DBSCAN trên hệ phân tán nhằm xử lý dữ liệu hồ sơ tài liệu thư viện điện tử quy mô hàng triệu bản ghi.",
        date_published: "2024-04-05",
        url: "https://vjol.info.vn/"
    },
    {
        id: 6,
        db_id: 2,
        db_name: "DOAJ",
        identifier: "doaj:article:10.1016/j.oasc.2024.100",
        title": "Open Science Policy Frameworks: Ensuring Reproducibility and Public Value of Academic Research",
        authors: "Anderson L, Lee K H",
        abstract: "Nghiên cứu chính sách khoa học mở tại châu Á và châu Âu, nhấn mạnh tầm quan trọng của việc công khai dữ liệu thô và gắn liên kết DOI cố định cho tài liệu nghiên cứu.",
        date_published: "2024-01-18",
        url: "https://doaj.org/"
    }
];

const GUIDES_DATA = [
    {
        id: 1,
        title: "Kỹ thuật tra cứu chuyên sâu trên arXiv.org",
        content: "arXiv hỗ trợ tra cứu chính xác theo trường dữ liệu: ti: (tiêu đề), au: (tác giả), abs: (tóm tắt). Ví dụ: 'ti:transformer AND au:nguyen' sẽ trả về các bản thảo về Transformer của tác giả Nguyen. Có thể bấm tải PDF ngay không cần tài khoản.",
        icon: "fa-solid fa-graduation-cap"
    },
    {
        id: 2,
        title: "Khai thác Tạp chí Khoa học Việt Nam trên VJOL",
        content: "VJOL chia theo lĩnh vực Khoa học Tự nhiên, Kỹ thuật, Xã hội. Bạn có thể tra từ khóa tiếng Việt hoặc tên trường/viện để tìm các bài báo đã thẩm định và tải PDF hoàn toàn miễn phí.",
        icon: "fa-solid fa-flag"
    },
    {
        id: 3,
        title: "Lọc tạp chí có bình duyệt (Peer-Reviewed) trên DOAJ",
        content: "DOAJ đảm bảo 100% bài báo được bình duyệt. Bạn nên sử dụng bộ lọc 'Without APCs' để tìm các tạp chí miễn phí hoàn toàn phí đăng bài cho tác giả.",
        icon: "fa-solid fa-check-to-slot"
    },
    {
        id: 4,
        title: "Quản lý trích dẫn với BibTeX, APA & IEEE",
        content: "Luôn trích dẫn nguồn khi khai thác CSDL mở. Trang web hỗ trợ sao chép tự động định dạng APA 7th, IEEE và BibTeX để dán vào Word hoặc EndNote/Zotero chỉ với 1 cú nhấp chuột.",
        icon: "fa-solid fa-quote-left"
    }
];

// App State
let currentDatabases = [...DATABASES_DATA];
let currentArticles = [...ARTICLES_DATA];
let activeCategory = "ALL";
let activeSourceFilter = "ALL";
let globalSearchQuery = "";

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    initGlobalSearch();
    initCategoryTabs();
    initQuickPillButtons();
    initArticlesFilter();
    renderDatabases();
    renderArticles();
    renderGuides();
    initModals();
    animateCounters();
    tryFetchBackendData();
});

/**
 * Fetch live data from FastAPI backend if available
 */
async function tryFetchBackendData() {
    try {
        const res = await fetch(`${API_BASE}/api/databases`);
        if (res.ok) {
            const result = await res.json();
            if (result.status === "success" && result.data && result.data.length > 0) {
                // Merge or augment with UI metadata
                console.log("Connected to backend API successfully.");
            }
        }
    } catch (e) {
        console.log("Backend offline or running in standalone mode. Using full fallback dataset.");
    }
}

/**
 * Theme Switcher
 */
function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    const htmlElem = document.documentElement;
    const savedTheme = localStorage.getItem("ctut_theme") || "dark";
    htmlElem.setAttribute("data-theme", savedTheme);

    toggleBtn.addEventListener("click", () => {
        const current = htmlElem.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        htmlElem.setAttribute("data-theme", next);
        localStorage.setItem("ctut_theme", next);
    });
}

/**
 * Global Search
 */
function initGlobalSearch() {
    const searchInput = document.getElementById("global-search-input");
    const searchBtn = document.getElementById("btn-global-search");
    const clearBtn = document.getElementById("btn-clear-search");

    const handleSearch = () => {
        globalSearchQuery = searchInput.value.trim().toLowerCase();
        if (globalSearchQuery.length > 0) {
            clearBtn.classList.remove("hidden");
        } else {
            clearBtn.classList.add("hidden");
        }
        applyAllFilters();
    };

    searchInput.addEventListener("input", handleSearch);
    searchBtn.addEventListener("click", () => {
        handleSearch();
        document.getElementById("databases-section").scrollIntoView({ behavior: "smooth" });
    });

    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        globalSearchQuery = "";
        clearBtn.classList.add("hidden");
        applyAllFilters();
    });
}

/**
 * Category Explorer Tabs
 */
function initCategoryTabs() {
    const tabs = document.querySelectorAll(".cat-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            activeCategory = tab.getAttribute("data-category");
            applyAllFilters();
        });
    });
}

/**
 * Quick Pill Buttons
 */
function initQuickPillButtons() {
    const pills = document.querySelectorAll(".pill-btn");
    pills.forEach(pill => {
        pill.addEventListener("click", () => {
            pills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            const filterValue = pill.getAttribute("data-filter");
            if (filterValue === "ALL") {
                globalSearchQuery = "";
                document.getElementById("global-search-input").value = "";
            } else {
                globalSearchQuery = filterValue.toLowerCase();
                document.getElementById("global-search-input").value = filterValue;
                document.getElementById("btn-clear-search").classList.remove("hidden");
            }
            applyAllFilters();
            document.getElementById("databases-section").scrollIntoView({ behavior: "smooth" });
        });
    });
}

/**
 * Articles filter
 */
function initArticlesFilter() {
    const selectElem = document.getElementById("article-db-select");
    const searchInput = document.getElementById("article-search-input");
    const searchBtn = document.getElementById("btn-article-search");

    const filterArticles = () => {
        const dbVal = selectElem.value;
        const query = searchInput.value.trim().toLowerCase();

        currentArticles = ARTICLES_DATA.filter(art => {
            const matchesDb = !dbVal || art.db_id == dbVal;
            const matchesQuery = !query ||
                art.title.toLowerCase().includes(query) ||
                art.authors.toLowerCase().includes(query) ||
                art.abstract.toLowerCase().includes(query);
            return matchesDb && matchesQuery;
        });

        renderArticles();
    };

    selectElem.addEventListener("change", filterArticles);
    searchInput.addEventListener("input", filterArticles);
    searchBtn.addEventListener("click", filterArticles);
}

/**
 * Apply All Filters across Databases
 */
function applyAllFilters() {
    currentDatabases = DATABASES_DATA.filter(db => {
        const matchesCat = activeCategory === "ALL" || (db.categories && db.categories.includes(activeCategory));
        const matchesSearch = !globalSearchQuery ||
            db.name.toLowerCase().includes(globalSearchQuery) ||
            db.description.toLowerCase().includes(globalSearchQuery);
        return matchesCat && matchesSearch;
    });

    renderDatabases();
}

/**
 * Render Databases Grid
 */
function renderDatabases() {
    const gridElem = document.getElementById("databases-grid");
    const countLabel = document.getElementById("db-count-label");

    countLabel.textContent = `Hiển thị ${currentDatabases.length}/${DATABASES_DATA.length} CSDL`;

    if (currentDatabases.length === 0) {
        gridElem.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
                <i class="fa-solid fa-folder-open" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-muted);"></i>
                <h3>Không tìm thấy cơ sở dữ liệu phù hợp</h3>
                <p>Vui lòng thử từ khóa tìm kiếm khác hoặc chọn "Tất cả lĩnh vực".</p>
            </div>
        `;
        return;
    }

    gridElem.innerHTML = currentDatabases.map(db => `
        <div class="db-card">
            <div>
                <div class="db-card-header">
                    <div class="db-logo-wrapper">
                        <img src="${db.logo}" alt="${db.name} logo" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3389/3389081.png'">
                    </div>
                    <span class="db-access-badge">${db.access_type}</span>
                </div>
                <h3 class="db-title">${db.name}</h3>
                <p class="db-desc">${db.description}</p>
            </div>

            <div>
                <div class="db-meta">
                    <span class="db-doc-count"><i class="fa-solid fa-file-lines"></i> ${db.doc_count}</span>
                    <span><i class="fa-solid fa-check-circle" style="color: #10b981;"></i> Trực tuyến</span>
                </div>

                <div class="db-actions">
                    <a href="${db.url}" target="_blank" rel="noopener noreferrer" class="btn-db-visit">
                        Truy cập CSDL <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                    <button class="btn-db-detail" onclick="openDbModal(${db.id})">
                        Chi tiết <i class="fa-solid fa-circle-info"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

/**
 * Render Articles List
 */
function renderArticles() {
    const listElem = document.getElementById("articles-list");

    if (currentArticles.length === 0) {
        listElem.innerHTML = `
            <div style="text-align: center; padding: 2.5rem; color: var(--text-secondary);">
                <p>Không tìm thấy bài báo nào khớp điều kiện tra cứu.</p>
            </div>
        `;
        return;
    }

    listElem.innerHTML = currentArticles.map(art => `
        <div class="article-card">
            <div class="article-header">
                <div class="article-badges">
                    <span class="badge-source">${art.db_name}</span>
                    <span class="article-id">${art.identifier}</span>
                </div>
                <span class="article-date"><i class="fa-regular fa-calendar"></i> ${art.date_published}</span>
            </div>

            <h3 class="article-title">${art.title}</h3>
            <p class="article-authors"><i class="fa-solid fa-user-pen"></i> Tác giả: ${art.authors}</p>
            <p class="article-abstract">${art.abstract}</p>

            <div class="article-actions">
                <a href="${art.url}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                    <i class="fa-solid fa-file-pdf"></i> Xem toàn văn trên ${art.db_name}
                </a>
                <button class="btn btn-primary" onclick="openCitationModal(${art.id})">
                    <i class="fa-solid fa-quote-right"></i> Trích dẫn bài báo
                </button>
            </div>
        </div>
    `).join("");
}

/**
 * Render Research Guides
 */
function renderGuides() {
    const gridElem = document.getElementById("guides-grid");
    gridElem.innerHTML = GUIDES_DATA.map(g => `
        <div class="guide-card">
            <div class="guide-icon">
                <i class="${g.icon}"></i>
            </div>
            <h3 class="guide-title">${g.title}</h3>
            <p class="guide-content">${g.content}</p>
        </div>
    `).join("");
}

/**
 * Database Detail Modal
 */
window.openDbModal = function(dbId) {
    const db = DATABASES_DATA.find(d => d.id === dbId);
    if (!db) return;

    document.getElementById("modal-db-title").textContent = db.name;
    document.getElementById("modal-db-body").innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1.25rem;">
            <div class="db-logo-wrapper" style="width: 70px; height: 70px;">
                <img src="${db.logo}" alt="${db.name}" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3389/3389081.png'">
            </div>
            <div>
                <span class="db-access-badge" style="display: inline-block; margin-bottom: 0.35rem;">${db.access_type}</span>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">Quy mô: <strong>${db.doc_count}</strong></p>
            </div>
        </div>

        <p style="margin-bottom: 1.25rem; line-height: 1.6;">${db.description}</p>

        <div style="background: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); border-radius: 12px; padding: 1rem; margin-bottom: 1.25rem;">
            <h4 style="color: var(--cyan-primary); font-size: 0.95rem; margin-bottom: 0.5rem;">
                <i class="fa-solid fa-lightbulb"></i> Mẹo tìm kiếm nhanh:
            </h4>
            <p style="font-size: 0.875rem;">${db.guide_tip}</p>
        </div>

        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-glass); border-radius: 12px; padding: 1rem;">
            <h4 style="font-size: 0.9rem; margin-bottom: 0.4rem;">Cú pháp tra cứu mẫu:</h4>
            <code style="display: block; background: rgba(0,0,0,0.4); padding: 0.6rem; border-radius: 8px; font-family: monospace; color: #38bdf8;">${db.search_syntax}</code>
        </div>
    `;

    document.getElementById("modal-db-external-btn").setAttribute("href", db.url);
    document.getElementById("db-detail-modal").classList.remove("hidden");
};

/**
 * Citation Modal
 */
window.openCitationModal = function(artId) {
    const art = ARTICLES_DATA.find(a => a.id === artId);
    if (!art) return;

    const authorsList = art.authors.split(", ");
    const firstAuthor = authorsList[0];
    const year = art.date_published ? art.date_published.substring(0, 4) : "2024";

    // APA format
    const apaText = `${art.authors} (${year}). ${art.title}. Thư Viện Số Mở CTUT [Nguồn: ${art.db_name}]. Truy cập từ ${art.url}`;
    
    // IEEE format
    const ieeeText = `${firstAuthor} et al., "${art.title}," ${art.db_name} Repository, ${year}. [Online]. Available: ${art.url}`;
    
    // BibTeX format
    const cleanId = art.identifier.replace(/[^a-zA-Z0-9]/g, "_");
    const bibtexText = `@article{${cleanId},
  author    = {${art.authors}},
  title     = {${art.title}},
  journal   = {${art.db_name} Open Access},
  year      = {${year}},
  url       = {${art.url}}
}`;

    document.getElementById("cite-apa").value = apaText;
    document.getElementById("cite-ieee").value = ieeeText;
    document.getElementById("cite-bibtex").value = bibtexText;

    document.getElementById("citation-modal").classList.remove("hidden");
};

/**
 * Modal & Toast Handlers
 */
function initModals() {
    const dbModal = document.getElementById("db-detail-modal");
    const citeModal = document.getElementById("citation-modal");

    document.getElementById("btn-close-db-modal").addEventListener("click", () => {
        dbModal.classList.add("hidden");
    });

    document.getElementById("btn-close-citation-modal").addEventListener("click", () => {
        citeModal.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
        if (e.target === dbModal) dbModal.classList.add("hidden");
        if (e.target === citeModal) citeModal.classList.add("hidden");
    });

    // Copy buttons
    document.querySelectorAll(".btn-copy").forEach(btn => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");
            const textarea = document.getElementById(targetId);
            textarea.select();
            navigator.clipboard.writeText(textarea.value);

            showToast("Đã sao chép định dạng trích dẫn vào bộ nhớ tạm!");
        });
    });
}

function showToast(msg) {
    const toastElem = document.getElementById("toast");
    document.getElementById("toast-message").textContent = msg;
    toastElem.classList.remove("hidden");

    setTimeout(() => {
        toastElem.classList.add("hidden");
    }, 3000);
}

/**
 * Animated Counters
 */
function animateCounters() {
    const statNumbers = document.querySelectorAll(".stat-number[data-target]");
    statNumbers.forEach(elem => {
        const target = +elem.getAttribute("data-target");
        let current = 0;
        const increment = target / 30;

        const updateCount = () => {
            if (current < target) {
                current += increment;
                elem.textContent = Math.ceil(current) + "+";
                requestAnimationFrame(updateCount);
            } else {
                elem.textContent = target + (target > 10 ? "M+" : "+");
            }
        };

        updateCount();
    });
}
