// ========== ОПТИМИЗИРОВАННЫЙ КУРСОР ==========
const cursor = document.querySelector('.custom-cursor');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

// Запускаем курсор только на десктопах, чтобы не сажать батарею телефона
if (window.innerWidth > 900) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!cursor.classList.contains('active')) {
            cursor.classList.add('active');
        }
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.15;
        cursorY += dy * 0.15;
        
        // Используем аппаратное ускорение
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverElements = document.querySelectorAll('a, button, .case, .journal-card, .price-card, .member');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// ========== ОПТИМИЗИРОВАННЫЙ СЕКЦИОННЫЙ СКРОЛЛ ==========
// Мы используем requestAnimationFrame для плавной отрисовки, чтобы не грузить кулер
let lastScrollY = window.scrollY;
let ticking = false;
const heroContent = document.querySelector('.hero-content');
const scrollIndicator = document.querySelector('.scroll-indicator');

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (heroContent && lastScrollY < window.innerHeight) {
                heroContent.style.transform = `translate3d(0, ${lastScrollY * 0.4}px, 0)`;
                heroContent.style.opacity = 1 - (lastScrollY / window.innerHeight) * 1.5;
            }
            if (scrollIndicator) {
                scrollIndicator.style.opacity = lastScrollY > 100 ? '0' : '1';
            }
            ticking = false;
        });
        ticking = true;
    }
});

// ========== INTERSECTION OBSERVER (Отрисовка только видимого) ==========
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-section').forEach(el => observer.observe(el));

const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.stagger-item');
            items.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('is-visible');
                }, index * 100);
            });
            staggerObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.grid, .team-grid, .pricing-grid, .journal-grid, .stats-grid, .clients-grid').forEach(el => {
    staggerObserver.observe(el);
});

// ========== АНИМАЦИЯ ЦИФР ==========
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        if (element.parentElement.classList.contains('stat-item')) {
            element.textContent = Math.floor(current) + (target === 99 ? '' : '+');
        }
    }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ========== ФОРМА И ВАЛИДАЦИЯ ==========
const formInputs = document.querySelectorAll('.form-input');
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(input.value)) {
                input.classList.add('valid');
                input.classList.remove('invalid');
            } else if (input.value) {
                input.classList.add('invalid');
                input.classList.remove('valid');
            }
        } else if (input.required) {
            if (input.value.length > 0) {
                input.classList.add('valid');
                input.classList.remove('invalid');
            } else {
                input.classList.add('invalid');
                input.classList.remove('valid');
            }
        }
    });
    input.addEventListener('input', () => {
        input.classList.remove('valid', 'invalid');
    });
});

document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-submit');
    const originalText = btn.textContent;
    btn.textContent = 'ОТПРАВКА...';
    btn.disabled = true;
    
    setTimeout(() => {
        this.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        formInputs.forEach(input => {
            input.classList.remove('valid', 'invalid');
        });
        showToast('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
    }, 1500);
});

function showToast(message) {
    const toast = document.getElementById('toast');
    if(toast) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}

document.querySelectorAll('.btn-minimal, .order-btn, .btn-submit').forEach(btn => {
    btn.addEventListener('click', function(e) {
        this.classList.add('ripple');
        setTimeout(() => this.classList.remove('ripple'), 600);
    });
});

// ========== ЛОГИКА МОДАЛОК ==========
function openCase(id) {
    const modal = document.getElementById('case-' + id);
    if(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCase(id) {
    const modal = document.getElementById('case-' + id);
    if(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        const iframe = document.getElementById('vid-' + id);
        if (iframe) {
            const src = iframe.src;
            iframe.src = '';
            iframe.src = src;
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            const id = modal.id.split('-')[1];
            if(id) closeCase(id);
        });
    }
});

document.querySelectorAll('.smart-close').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            const iframe = modal.querySelector('iframe');
            if (iframe) {
                const src = iframe.src;
                iframe.src = '';
                iframe.src = src;
            }
        });
    });
});

// Плавный скролл к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#order') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
