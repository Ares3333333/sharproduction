document.addEventListener("DOMContentLoaded", function() {

    const cursor = document.querySelector('.custom-cursor');
    if (window.innerWidth > 900 && cursor) {
        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let cursorX = window.innerWidth / 2, cursorY = window.innerHeight / 2;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursor.classList.add('active');
        });
        
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.fade-in-section, .stagger-item').forEach(el => observer.observe(el));

    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('.btn-submit');
            const originalText = btn.textContent;
            btn.textContent = 'ОТПРАВКА...';
            btn.disabled = true;
            
            setTimeout(() => {
                this.reset();
                btn.textContent = originalText;
                btn.disabled = false;
                
                const toast = document.getElementById('toast');
                toast.textContent = 'Заявка отправлена! Мы свяжемся с вами.';
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 4000);
            }, 1500);
        });
    }

    window.openCase = function(id) {
        const modal = document.getElementById('case-' + id);
        if(modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }
    }

    window.closeCase = function(id) {
        const modal = document.getElementById('case-' + id);
        if(modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            const iframe = document.getElementById('vid-' + id);
            if (iframe) { iframe.src = iframe.src; } 
        }
    }

    document.querySelectorAll('.smart-close').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active'); document.body.style.overflow = 'auto';
                const iframe = modal.querySelector('iframe');
                if (iframe) iframe.src = iframe.src;
            });
        });
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
