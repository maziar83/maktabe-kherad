/* ==================================================
   فایل: animation.js
   توضیح: Intersection Observer، انیمیشن سکشن‌ها، پارالاکس، ذرات
   ================================================== */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ---------- مشاهده سکشن‌ها (Fade In / Slide Up / Zoom) ----------
    const sections = document.querySelectorAll('.writer-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // همچنین می‌توان افکت‌های بیشتر اضافه کرد
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // ---------- پارالاکس برای تصاویر نویسندگان ----------
    const writerImages = document.querySelectorAll('.writer-image');
    window.addEventListener('scroll', function () {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        writerImages.forEach((imgWrapper, index) => {
            const rect = imgWrapper.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const viewportCenter = window.innerHeight / 2;
            const offset = (center - viewportCenter) * 0.08; // سرعت پارالاکس
            const img = imgWrapper.querySelector('img');
            if (img) {
                img.style.transform = `translateY(${offset}px) scale(1.05)`;
            }
        });
    }, { passive: true });

    // ---------- ذرات شناور (Particles) ----------
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.parentElement.clientWidth;
            height = canvas.parentElement.clientHeight;
            canvas.width = width;
            canvas.height = height;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3 - 0.1;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(201, 168, 124, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            const count = Math.min(80, Math.floor(width * height / 8000));
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });

        resize();
        initParticles();
        animateParticles();
    }

    // ---------- لود تنبل (Lazy Loading) برای تصاویر ----------
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const lazyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src') || img.src;
                    if (img.getAttribute('data-src')) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    lazyObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => lazyObserver.observe(img));
    }

    // ---------- افکت تایپینگ (عنوان زیر هدر) ----------
    const subtitleElement = document.querySelector('.hero-subtitle');
    if (subtitleElement) {
        const text = subtitleElement.textContent;
        subtitleElement.textContent = '';
        let index = 0;
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                subtitleElement.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                // اضافه کردن کرسر (اختیاری)
                const cursor = document.createElement('span');
                cursor.className = 'typing-cursor';
                subtitleElement.appendChild(cursor);
            }
        }, 80);
    }

    console.log('انیمیشن‌ها فعال شدند.');
});