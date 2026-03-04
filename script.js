document.addEventListener("DOMContentLoaded", function() {
    const cursor = document.querySelector('.custom-cursor');
    if (window.innerWidth > 900 && cursor) {
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let cursorX = window.innerWidth / 2, cursorY = window.innerHeight / 2;
        document.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; cursor.classList.add('active'); });
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15; cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        document.querySelectorAll('a, button, .case, .journal-card, .price-card, .member, input, textarea').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroContent = document.querySelector('.hero-content');
                if (heroContent && scrollY < window.innerHeight) {
                    heroContent.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
                    heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 1.5;
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    const observer = new IntersectionObserver((entries) => { entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('is-visible'); }); }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in-section, .stagger-item').forEach(el => observer.observe(el));

    function animateCounter(el, target, duration = 2000) {
        let start = 0; const increment = target / (duration / 16); 
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) { start = target; clearInterval(timer); }
            if (el.parentElement.classList.contains('stat-item')) el.textContent = Math.floor(start) + (target === 99 ? '%' : '+');
        }, 16);
    }
    const countObserver = new IntersectionObserver((entries) => { entries.forEach(e => { if(e.isIntersecting) { animateCounter(e.target, parseInt(e.target.dataset.count)); countObserver.unobserve(e.target); } }); });
    document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

    window.openCase = function(id) { const m = document.getElementById('case-'+id); if(m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; } }
    window.closeCase = function(id) { const m = document.getElementById('case-'+id); if(m) { m.classList.remove('active'); document.body.style.overflow = 'auto'; const iframe = document.getElementById('vid-'+id); if(iframe) iframe.src = iframe.src; } }
    
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.querySelectorAll('.modal.active').forEach(m => window.closeCase(m.id.split('-')[1])); });
    document.querySelectorAll('.smart-close').forEach(item => { item.addEventListener('click', () => { document.querySelectorAll('.modal.active').forEach(m => window.closeCase(m.id.split('-')[1])); }); });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') { e.preventDefault(); const target = document.querySelector(href); if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });
});
