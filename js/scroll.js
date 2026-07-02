/* ==================================================
   فایل: scroll.js
   توضیح: اسکرول نرم، اسکرول پروگرس، و افکت‌های مرتبط
   ================================================== */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ---------- اسکرول نرم (همه لینک‌های داخلی) ----------
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- اسکرول پروگرس بار ----------
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    }, { passive: true });

    // ---------- اسکرول با دکمه‌های پایین (افکت Auto Scroll به بخش بعدی) ----------
    // اسکرول خودکار با چرخ ماوس به بخش بعدی (فعال در صورت تمایل)
    // برای جلوگیری از تداخل با اسکرول معمولی، فقط در حالت دسکتاپ و با فاصله زمانی
    let isScrolling = false;
    let scrollTimeout;

    // غیرفعال کردن خودکار برای جلوگیری از مزاحمت، اما کد آماده است
    // می‌توان با کلیک روی دکمه پایین فعال کرد

    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function () {
            const nextSection = document.querySelector('.writer-section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ---------- اسکرول اسنپ (میل به بخش‌ها) اختیاری ----------
    // این قابلیت را می‌توان با CSS scroll-snap-type نیز پیاده‌سازی کرد
    // ولی برای حفظ کنترل، آن را غیرفعال می‌کنیم تا با اسکرول معمولی تداخل نداشته باشد.

    console.log('اسکرول نرم فعال شد.');
});