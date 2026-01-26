// ============================================
// NAVEGACIÓN Y EFECTOS GENERALES
// ============================================

const nav = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const scrollTop = document.getElementById('scrollTop');
const stickyCta = document.getElementById('stickyCta');

// Scroll effects
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Navbar scroll effect
    if (scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Scroll to top button
    if (scrollY > 500) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }

    // Sticky CTA
    if (scrollY > 800) {
        stickyCta.classList.add('visible');
    } else {
        stickyCta.classList.remove('visible');
    }
});

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Scroll to top
scrollTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// PORTFOLIO FILTERS
// ============================================

const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        portfolioItems.forEach(item => {
            if (filter === 'todos' || item.getAttribute('data-category') === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ============================================
// FORM VALIDATION
// ============================================

const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', function(e) {
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        if (nombre.length < 2) {
            e.preventDefault();
            alert('Por favor, ingresa tu nombre completo');
            return false;
        }

        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            e.preventDefault();
            alert('Por favor, ingresa un correo electrónico válido');
            return false;
        }

        if (mensaje.length < 20) {
            e.preventDefault();
            alert('Por favor, describe tu proyecto con más detalle (mínimo 20 caracteres)');
            return false;
        }
    });
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ============================================
// CARRUSEL DE VESTIDOS (Multi-slide)
// ============================================

class CarouselVestidos {
    constructor() {
        this.track = document.getElementById('carouselTrack');
        if (!this.track) return;
        
        this.slides = document.querySelectorAll('#carouselTrack .carousel-slide');
        this.prevBtn = document.querySelector('.galeria-vestidos .carousel-btn-prev');
        this.nextBtn = document.querySelector('.galeria-vestidos .carousel-btn-next');
        this.dotsContainer = document.getElementById('carouselDots');
        
        this.currentIndex = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.totalSlides = this.slides.length;
        this.maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
        this.autoPlayInterval = null;
        this.gap = 32;
        
        this.init();
    }
    
    getSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1024) return 2;
        return 3;
    }
    
    init() {
        this.createDots();
        this.setupEventListeners();
        this.updateCarousel();
        this.startAutoPlay();
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        const dotsCount = this.maxIndex + 1;
        
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Ir a slide ${i + 1}`);
            dot.addEventListener('click', () => {
                this.goToSlide(i);
                this.resetAutoPlay();
            });
            this.dotsContainer.appendChild(dot);
        }
        
        this.updateDots();
    }
    
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prev();
                this.resetAutoPlay();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.next();
                this.resetAutoPlay();
            });
        }
        
        // Touch events
        let touchStartX = 0;
        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.next();
                else this.prev();
                this.resetAutoPlay();
            }
        }, { passive: true });
        
        // Pausar en hover
        const container = document.querySelector('.carousel-container');
        if (container) {
            container.addEventListener('mouseenter', () => this.stopAutoPlay());
            container.addEventListener('mouseleave', () => this.startAutoPlay());
        }
        
        // Resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const newSlidesPerView = this.getSlidesPerView();
                if (newSlidesPerView !== this.slidesPerView) {
                    this.slidesPerView = newSlidesPerView;
                    this.maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
                    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
                    this.createDots();
                    this.updateCarousel();
                }
            }, 250);
        });
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.maxIndex; // Loop al final
        }
        this.updateCarousel();
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop al inicio
        }
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (!this.slides.length) return;
        
        const slideWidth = this.slides[0].offsetWidth;
        const offset = -(this.currentIndex * (slideWidth + this.gap));
        
        this.track.style.transform = `translateX(${offset}px)`;
        this.updateDots();
        this.updateButtons();
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    updateButtons() {
        // Los botones siempre están activos por el loop infinito
        if (this.prevBtn) {
            this.prevBtn.style.opacity = '1';
            this.prevBtn.style.cursor = 'pointer';
        }
        if (this.nextBtn) {
            this.nextBtn.style.opacity = '1';
            this.nextBtn.style.cursor = 'pointer';
        }
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.next(), 4000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        setTimeout(() => this.startAutoPlay(), 3000);
    }
}

// ============================================
// CARRUSEL DE TESTIMONIOS (Single-slide)
// ============================================

class CarouselTestimonios {
    constructor() {
        this.track = document.getElementById('testimonialsTrack');
        if (!this.track) return;
        
        this.slides = document.querySelectorAll('#testimonialsTrack .testimonial-slide');
        this.prevBtn = document.querySelector('.testimonial-btn-prev');
        this.nextBtn = document.querySelector('.testimonial-btn-next');
        this.dotsContainer = document.getElementById('testimonialsDots');
        
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.setupEventListeners();
        this.updateCarousel();
        this.startAutoPlay();
    }
    
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('testimonial-dot');
            dot.setAttribute('aria-label', `Ir a testimonio ${i + 1}`);
            dot.addEventListener('click', () => {
                this.goToSlide(i);
                this.resetAutoPlay();
            });
            this.dotsContainer.appendChild(dot);
        }
        
        this.updateDots();
    }
    
    setupEventListeners() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prev();
                this.resetAutoPlay();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.next();
                this.resetAutoPlay();
            });
        }
        
        // Touch events
        let touchStartX = 0;
        this.track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.next();
                else this.prev();
                this.resetAutoPlay();
            }
        }, { passive: true });
        
        // Pausar en hover
        const container = document.querySelector('.testimonials-carousel-container');
        if (container) {
            container.addEventListener('mouseenter', () => this.stopAutoPlay());
            container.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.totalSlides - 1; // Loop al final
        }
        this.updateCarousel();
    }
    
    next() {
        if (this.currentIndex < this.totalSlides - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0; // Loop al inicio
        }
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.totalSlides - 1));
        this.updateCarousel();
    }
    
    updateCarousel() {
        // Para testimonios: cada slide es 100% del ancho
        const offset = -(this.currentIndex * 100);
        this.track.style.transform = `translateX(${offset}%)`;
        this.updateDots();
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        const dots = this.dotsContainer.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => this.next(), 5000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    resetAutoPlay() {
        this.stopAutoPlay();
        setTimeout(() => this.startAutoPlay(), 3000);
    }
}

// ============================================
// INICIALIZACIÓN ÚNICA
// ============================================

let carouselVestidosInstance = null;
let carouselTestimoniosInstance = null;

function initCarousels() {
    // Evitar doble inicialización
    if (!carouselVestidosInstance) {
        carouselVestidosInstance = new CarouselVestidos();
        console.log('✅ Carrusel de vestidos inicializado');
    }
    
    if (!carouselTestimoniosInstance) {
        carouselTestimoniosInstance = new CarouselTestimonios();
        console.log('✅ Carrusel de testimonios inicializado');
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
} else {
    initCarousels();
}