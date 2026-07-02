/* ==================================================
   فایل: app.js
   توضیح: کنترل‌های اصلی، افکت ماوس، کارت‌ها، جستجو و فیلتر
   ================================================== */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ---------- هدر اسکرول ----------
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ---------- افکت ماوس (Cursor Glow) ----------
    const glow = document.createElement('div');
    glow.classList.add('cursor-glow');
    document.body.appendChild(glow);

    const glowStyle = `
        .cursor-glow {
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(201,168,124,0.08) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%);
            transition: left 0.15s ease-out, top 0.15s ease-out;
            will-change: left, top;
        }
    `;
    const styleSheet = document.createElement('style');
    styleSheet.textContent = glowStyle;
    document.head.appendChild(styleSheet);

    document.addEventListener('mousemove', function (e) {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    // ---------- کتاب‌ها: کلیک و باز شدن صفحه ----------
    const bookCards = document.querySelectorAll('.book-card, .book-item');
    bookCards.forEach(card => {
        card.addEventListener('click', function () {
            const bookId = this.dataset.book;
            if (bookId) {
                // در صورت وجود صفحه کتاب، هدایت می‌کند
                // اینجا می‌توان لینک‌دهی کرد، مثلاً book.html?book=boof-e-koor
                window.location.href = `book.html?book=${bookId}`;
            }
        });
    });

    // ---------- جستجو و فیلتر در صفحه کتاب‌ها ----------
    const searchInput = document.getElementById('searchBooks');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const booksGrid = document.getElementById('booksGrid');

    if (searchInput && booksGrid) {
        // داده‌های نمونه (در صورت نبود داده از سرور)
        const booksData = [
            { id: 'boof-e-koor', title: 'بوف کور', author: 'صادق هدایت', year: ۱۳۱۵, category: 'dastan', cover: 'images/books/boof-e-koor.jpg' },
            { id: 'sooratakha', title: 'سورعتکها', author: 'صادق هدایت', year: ۱۳۲۱, category: 'dastan', cover: 'images/books/sooratakha.jpg' },
            // افزودن کتاب‌های بیشتر
        ];

        function renderBooks(filter = 'all', query = '') {
            const filtered = booksData.filter(book => {
                const matchFilter = filter === 'all' || book.category === filter;
                const matchQuery = book.title.includes(query) || book.author.includes(query);
                return matchFilter && matchQuery;
            });

            booksGrid.innerHTML = '';
            filtered.forEach(book => {
                const item = document.createElement('div');
                item.className = 'book-item';
                item.dataset.book = book.id;
                item.innerHTML = `
                    <img src="${book.cover}" alt="${book.title}" loading="lazy" />
                    <div class="book-meta">
                        <div class="book-title">${book.title}</div>
                        <div class="book-author">${book.author}</div>
                        <div class="book-year">${book.year}</div>
                    </div>
                `;
                item.addEventListener('click', function () {
                    window.location.href = `book.html?book=${book.id}`;
                });
                booksGrid.appendChild(item);
            });
        }

        // فیلتر
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filter = this.dataset.filter;
                renderBooks(filter, searchInput.value);
            });
        });

        // جستجو
        searchInput.addEventListener('input', function () {
            const activeFilter = document.querySelector('.filter-btn.active');
            const filter = activeFilter ? activeFilter.dataset.filter : 'all';
            renderBooks(filter, this.value);
        });

        // رندر اولیه
        renderBooks('all', '');
    }

    // ---------- شمارنده انیمیشن (نمایش آمار در فوتر یا هرجا) ----------
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.target);
                    let current = 0;
                    const increment = Math.ceil(target / 60);
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        entry.target.textContent = current;
                    }, 20);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => observer.observe(c));
    }

    console.log('مکتب خرد بارگذاری شد.');
});
