// ============================================
// ELIZABETH MENDEZ - FASHION DESIGNER
// JavaScript Premium con Funcionalidades Avanzadas
// ============================================

// ============================================
// VARIABLES GLOBALES
// ============================================
const nav = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const scrollTop = document.getElementById('scrollTop');
const stickyCta = document.getElementById('stickyCta');

// ============================================
// NAVEGACIÓN Y EFECTOS SCROLL
// ============================================
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

// Mobile menu toggle (accesible)
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

        // Estado accesible
        menuToggle.setAttribute('aria-expanded', String(!isOpen));

        // Estado visual
        navMenu.classList.toggle('active', !isOpen);

        // Opcional: bloquear scroll cuando el menú está abierto
        document.body.classList.toggle('menu-open', !isOpen);
    });
}

// Close menu on link click
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
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
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
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
// WHATSAPP CONTEXTUAL
// ============================================
function getWhatsAppMessage() {
    const currentSection = window.location.hash || '#inicio';
    const messages = {
        '#galeria-vestidos': 'Hola Elizabeth, me interesa saber más sobre tus vestidos de niñas',
        '#servicios': 'Hola Elizabeth, necesito información sobre tus servicios',
        '#sobre-mi': 'Hola Elizabeth, me gustaría conocer más sobre tu trabajo',
        '#contacto': 'Hola Elizabeth, me gustaría solicitar una cotización',
        '#calculadora': 'Hola Elizabeth, me gustaría obtener una cotización personalizada'
    };
    return messages[currentSection] || 'Hola Elizabeth, me interesa solicitar una cotización';
}

document.getElementById('whatsappBtn').addEventListener('click', function(e) {
    e.preventDefault();
    const message = encodeURIComponent(getWhatsAppMessage());
    window.open(`https://api.whatsapp.com/send?phone=+18492151118&text=${message}`, '_blank');
});

// ============================================
// SISTEMA DE FAVORITOS (LocalStorage)
// ============================================
class FavoritesManager {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('elizabethmendez_favorites') || '[]');
        this.init();
    }
    
    init() {
        this.renderFavoriteButtons();
        this.updateFavoriteCounter();
        this.setupFavoritesModal();
    }
    
    toggle(itemId) {
        const index = this.favorites.findIndex(f => f.id === itemId);
        const card = document.querySelector(`[data-id="${itemId}"]`);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            const itemData = {
                id: itemId,
                name: card.querySelector('.vestido-name').textContent,
                image: card.querySelector('img').src,
                price: card.querySelector('.vestido-price').textContent,
                age: card.querySelector('.vestido-age').textContent,
                addedAt: Date.now()
            };
            this.favorites.push(itemData);
        }
        
        localStorage.setItem('elizabethmendez_favorites', JSON.stringify(this.favorites));
        this.updateUI();
    }
    
    renderFavoriteButtons() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const itemId = btn.dataset.id;
            const isFavorite = this.favorites.some(f => f.id === itemId);
            
            if (isFavorite) {
                btn.classList.add('active');
            }
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle(itemId);
            });
        });
    }
    
    updateUI() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const itemId = btn.dataset.id;
            const isFavorite = this.favorites.some(f => f.id === itemId);
            btn.classList.toggle('active', isFavorite);
        });
        this.updateFavoriteCounter();
    }
    
    updateFavoriteCounter() {
        const counter = document.getElementById('favoritesCounter');
        const btn = document.getElementById('favoritesBtn');
        if (counter && btn) {
            counter.textContent = this.favorites.length;
            btn.style.display = this.favorites.length > 0 ? 'flex' : 'none';
        }
    }
    
    setupFavoritesModal() {
        const btn = document.getElementById('favoritesBtn');
        if (btn) {
            btn.addEventListener('click', () => this.showFavorites());
        }
    }
    
    showFavorites() {
        const modal = document.getElementById('favoritesModal');
        const grid = document.getElementById('favoritesGrid');
        
        if (this.favorites.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--warm-gray); grid-column: 1/-1;">No tienes vestidos favoritos aún. ¡Explora nuestra colección!</p>';
        } else {
            grid.innerHTML = this.favorites.map(fav => `
                <div class="vestido-card" data-id="${fav.id}">
                    <div class="vestido-image">
                        <img src="${fav.image}" alt="${fav.name}" loading="lazy">
                        <button class="favorite-btn active" onclick="favManager.toggle('${fav.id}')">
                            <span class="fav-icon">♡</span>
                        </button>
                    </div>
                    <div class="vestido-content">
                        <h3 class="vestido-name">${fav.name}</h3>
                        <div class="vestido-meta">
                            <span class="vestido-age">${fav.age}</span>
                            <span class="vestido-price">${fav.price}</span>
                        </div>
                        <button class="btn btn-outline btn-small" onclick="openQuickView('${fav.id}')">Ver detalles</button>
                    </div>
                </div>
            `).join('');
        }
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeFavorites() {
    const modal = document.getElementById('favoritesModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
}

// ============================================
// SISTEMA DE COMPARACIÓN
// ============================================
class ComparisonManager {
    constructor() {
        this.items = [];
        this.maxItems = 3;
        this.init();
    }
    
    init() {
        this.setupCompareButtons();
        this.updateUI();
    }
    
    setupCompareButtons() {
        document.querySelectorAll('.compare-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemId = btn.dataset.id;
                this.toggle(itemId);
            });
        });
    }
    
    toggle(itemId) {
        const index = this.items.findIndex(i => i.id === itemId);
        
        if (index > -1) {
            this.items.splice(index, 1);
        } else {
            if (this.items.length >= this.maxItems) {
                alert(`Solo puedes comparar hasta ${this.maxItems} vestidos a la vez`);
                return;
            }
            
            const card = document.querySelector(`[data-id="${itemId}"]`);
            const itemData = {
                id: itemId,
                name: card.querySelector('.vestido-name').textContent,
                image: card.querySelector('img').src,
                price: card.querySelector('.vestido-price').textContent,
                age: card.querySelector('.vestido-age').textContent,
                description: card.querySelector('.vestido-description').textContent
            };
            this.items.push(itemData);
        }
        
        this.updateUI();
    }
    
    updateUI() {
        // Update buttons
        document.querySelectorAll('.compare-btn').forEach(btn => {
            const itemId = btn.dataset.id;
            const isSelected = this.items.some(i => i.id === itemId);
            btn.classList.toggle('active', isSelected);
        });
        
        // Update compare bar
        const compareBar = document.getElementById('compareBar');
        const compareItems = document.getElementById('compareItems');
        const compareCount = document.getElementById('compareCount');
        
        if (this.items.length > 0) {
            compareBar.style.display = 'flex';
            compareItems.innerHTML = this.items.map(item => `
                <div class="compare-item">
                    <img src="${item.image}" alt="${item.name}">
                </div>
            `).join('');
            compareCount.textContent = this.items.length;
        } else {
            compareBar.style.display = 'none';
        }
    }
}

function showComparison() {
    if (compareManager.items.length < 2) {
        alert('Selecciona al menos 2 vestidos para comparar');
        return;
    }
    
    const modal = document.getElementById('comparisonModal');
    const grid = document.getElementById('comparisonGrid');
    
    grid.innerHTML = compareManager.items.map(item => `
        <div class="comparison-card">
            <img src="${item.image}" alt="${item.name}" style="width: 100%; border-radius: 12px; margin-bottom: 16px;">
            <h4 style="font-size: 20px; margin-bottom: 8px;">${item.name}</h4>
            <p style="font-size: 14px; color: var(--warm-gray); margin-bottom: 12px;">${item.description}</p>
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                <span style="font-size: 12px; color: var(--terracotta); font-weight: 600;">${item.age}</span>
                <span style="font-size: 16px; color: var(--gold); font-weight: 600;">${item.price}</span>
            </div>
            <button class="btn btn-primary btn-small" onclick="openQuickView('${item.id}')">Ver detalles</button>
        </div>
    `).join('');
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

function closeComparison() {
    const modal = document.getElementById('comparisonModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
}

function clearComparison() {
    compareManager.items = [];
    compareManager.updateUI();
}

// ============================================
// CALCULADORA DE PRESUPUESTO
// ============================================
function setupBudgetCalculator() {
    const dressType = document.getElementById('dressType');
    const sizeRange = document.getElementById('sizeRange');
    const sizeDisplay = document.getElementById('sizeDisplay');
    const extraCheckboxes = document.querySelectorAll('.extra-checkbox');
    const totalPrice = document.getElementById('totalPrice');
    
    if (!dressType || !sizeRange) return;
    
    function calculateTotal() {
        let total = parseInt(dressType.value);
        
        extraCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                total += parseInt(checkbox.value);
            }
        });
        
        totalPrice.textContent = `$${total}`;
    }
    
    dressType.addEventListener('change', calculateTotal);
    
    sizeRange.addEventListener('input', (e) => {
        sizeDisplay.textContent = `${e.target.value} años`;
    });
    
    extraCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotal);
    });
    
    calculateTotal();
}

function requestQuoteFromCalculator() {
    const dressType = document.getElementById('dressType');
    const sizeRange = document.getElementById('sizeRange');
    const extras = Array.from(document.querySelectorAll('.extra-checkbox:checked'))
        .map(cb => cb.parentElement.querySelector('.extra-name').textContent)
        .join(', ');
    
    const message = `Hola Elizabeth, me interesa un presupuesto para:
- Tipo: ${dressType.options[dressType.selectedIndex].text}
- Talla: ${sizeRange.value} años
${extras ? `- Extras: ${extras}` : ''}

¿Podrías darme más información?`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=+18492151118&text=${encodedMessage}`, '_blank');
}

// ============================================
// FILTROS INTELIGENTES
// ============================================
class SmartFilters {
    constructor() {
        this.activeFilters = {
            edad: [],
            ocasion: [],
            color: [],
            precio: []
        };
        this.init();
    }
    
    init() {
        this.setupFilterChips();
        this.setupFilterInputs();
    }
    
    setupFilterChips() {
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                if (e.target.closest('.chip-dropdown')) return;
                
                const isExpanded = chip.getAttribute('aria-expanded') === 'true';
                
                // Close all other dropdowns
                document.querySelectorAll('.filter-chip').forEach(c => {
                    if (c !== chip) c.setAttribute('aria-expanded', 'false');
                });
                
                chip.setAttribute('aria-expanded', !isExpanded);
            });
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-chip')) {
                document.querySelectorAll('.filter-chip').forEach(chip => {
                    chip.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }
    
    setupFilterInputs() {
        document.querySelectorAll('.chip-dropdown input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => {
                const filterType = input.closest('.filter-chip').dataset.filter;
                const filterValue = input.value;
                
                if (input.checked) {
                    this.activeFilters[filterType].push(filterValue);
                } else {
                    this.activeFilters[filterType] = this.activeFilters[filterType].filter(v => v !== filterValue);
                }
                
                this.applyFilters();
            });
        });
    }
    
    applyFilters() {
        const cards = document.querySelectorAll('.vestido-card');
        
        cards.forEach(card => {
            let show = true;
            
            // Check each filter type
            for (const [type, values] of Object.entries(this.activeFilters)) {
                if (values.length > 0) {
                    const cardValue = card.dataset[type];
                    
                    if (type === 'precio') {
                        // Extract numeric price
                        const priceMatch = card.dataset.precio;
                        const price = parseInt(priceMatch);
                        
                        const matchesPrice = values.some(range => {
                            if (range === '0-100') return price < 100;
                            if (range === '100-150') return price >= 100 && price < 150;
                            if (range === '150-200') return price >= 150 && price < 200;
                            if (range === '200+') return price >= 200;
                            return false;
                        });
                        
                        if (!matchesPrice) show = false;
                    } else {
                        if (!values.includes(cardValue)) show = false;
                    }
                }
            }
            
            const slide = card.closest('.carousel-slide');
            if (slide) {
                slide.style.display = show ? 'block' : 'none';
            }
        });
    }
}

function resetFilters() {
    // Uncheck all filter inputs
    document.querySelectorAll('.chip-dropdown input[type="checkbox"]').forEach(input => {
        input.checked = false;
    });
    
    // Show all cards
    document.querySelectorAll('.carousel-slide').forEach(slide => {
        slide.style.display = 'block';
    });
    
    // Reset filter manager
    if (window.smartFilters) {
        window.smartFilters.activeFilters = {
            edad: [],
            ocasion: [],
            color: [],
            precio: []
        };
    }
}

// ============================================
// QUICK VIEW MODAL
// ============================================
function openQuickView(vestidoId) {
    const card = document.querySelector(`[data-id="${vestidoId}"]`);
    if (!card) return;
    
    const modal = document.getElementById('quickViewModal');
    const modalBody = document.getElementById('modalBody');
    
    const name = card.querySelector('.vestido-name').textContent;
    const image = card.querySelector('img').src;
    const description = card.querySelector('.vestido-description').textContent;
    const price = card.querySelector('.vestido-price').textContent;
    const age = card.querySelector('.vestido-age').textContent;
    
    modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start;">
            <div>
                <img src="${image}" alt="${name}" style="width: 100%; border-radius: 16px;">
            </div>
            <div>
                <h2 style="font-size: 36px; margin-bottom: 16px;">${name}</h2>
                <p style="font-size: 16px; color: var(--warm-gray); margin-bottom: 24px;">${description}</p>
                
                <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                    <div style="background: var(--gradient-soft); padding: 16px 24px; border-radius: 12px; flex: 1;">
                        <div style="font-size: 12px; color: var(--warm-gray); margin-bottom: 4px;">Talla</div>
                        <div style="font-size: 18px; font-weight: 600; color: var(--charcoal);">${age}</div>
                    </div>
                    <div style="background: var(--gradient-soft); padding: 16px 24px; border-radius: 12px; flex: 1;">
                        <div style="font-size: 12px; color: var(--warm-gray); margin-bottom: 4px;">Precio</div>
                        <div style="font-size: 18px; font-weight: 600; color: var(--gold);">${price}</div>
                    </div>
                </div>
                
                <div style="background: white; border: 2px solid var(--beige); padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                    <h3 style="font-size: 18px; margin-bottom: 12px;">Características</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 8px 0; padding-left: 24px; position: relative;">
                            <span style="position: absolute; left: 0; color: var(--gold);">✓</span>
                            Diseño exclusivo y único
                        </li>
                        <li style="padding: 8px 0; padding-left: 24px; position: relative;">
                            <span style="position: absolute; left: 0; color: var(--gold);">✓</span>
                            Telas premium importadas
                        </li>
                        <li style="padding: 8px 0; padding-left: 24px; position: relative;">
                            <span style="position: absolute; left: 0; color: var(--gold);">✓</span>
                            Confección artesanal
                        </li>
                        <li style="padding: 8px 0; padding-left: 24px; position: relative;">
                            <span style="position: absolute; left: 0; color: var(--gold);">✓</span>
                            Ajuste personalizado
                        </li>
                    </ul>
                </div>
                
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-primary" onclick="requestQuoteForDress('${name}')">Solicitar cotización</button>
                    <button class="btn btn-outline" onclick="favManager.toggle('${vestidoId}')">Agregar a favoritos</button>
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
}

function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
}

function requestQuoteForDress(dressName) {
    const message = `Hola Elizabeth, me interesa el vestido "${dressName}". ¿Podrías darme más información y una cotización?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=+18492151118&text=${encodedMessage}`, '_blank');
    closeQuickView();
}

// ============================================
// VALIDACIÓN DE FORMULARIO MEJORADA
// ============================================
const form = document.getElementById('contactForm');
if (form) {
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const mensajeInput = document.getElementById('mensaje');
    const charCount = document.getElementById('charCount');
    
    // Character counter
    if (mensajeInput && charCount) {
        mensajeInput.addEventListener('input', (e) => {
            const count = e.target.value.length;
            charCount.textContent = count;
            
            if (count > 500) {
                charCount.style.color = 'var(--error)';
            } else {
                charCount.style.color = 'var(--warm-gray)';
            }
        });
    }
    
    // Real-time validation
    function validateField(field, validator, errorMessage) {
        const group = field.closest('.form-group');
        const errorSpan = group.querySelector('.error-message');
        
        field.addEventListener('blur', () => {
            if (!validator(field.value)) {
                group.classList.add('has-error');
                group.classList.remove('has-success');
                if (errorSpan) errorSpan.textContent = errorMessage;
            } else {
                group.classList.remove('has-error');
                group.classList.add('has-success');
                if (errorSpan) errorSpan.textContent = '';
            }
        });
        
        field.addEventListener('input', () => {
            if (group.classList.contains('has-error')) {
                if (validator(field.value)) {
                    group.classList.remove('has-error');
                    group.classList.add('has-success');
                    if (errorSpan) errorSpan.textContent = '';
                }
            }
        });
    }
    
    if (nombreInput) {
        validateField(
            nombreInput,
            (value) => value.trim().length >= 2,
            'Por favor, ingresa tu nombre completo'
        );
    }
    
    if (emailInput) {
        validateField(
            emailInput,
            (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            'Por favor, ingresa un correo electrónico válido'
        );
    }
    
    if (mensajeInput) {
        validateField(
            mensajeInput,
            (value) => value.trim().length >= 20,
            'Por favor, describe tu proyecto con más detalle (mínimo 20 caracteres)'
        );
    }
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Validate all fields
        if (nombreInput && nombreInput.value.trim().length < 2) {
            nombreInput.closest('.form-group').classList.add('has-error');
            isValid = false;
        }
        
        if (emailInput && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            emailInput.closest('.form-group').classList.add('has-error');
            isValid = false;
        }
        
        if (mensajeInput && mensajeInput.value.trim().length < 20) {
            mensajeInput.closest('.form-group').classList.add('has-error');
            isValid = false;
        }
        
        if (isValid) {
            // Show success message
            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Enviando...</span>';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form submission)
            setTimeout(() => {
                submitBtn.innerHTML = '<span>✓ Mensaje enviado</span>';
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Remove validation classes
                    form.querySelectorAll('.form-group').forEach(group => {
                        group.classList.remove('has-error', 'has-success');
                    });
                }, 2000);
            }, 1500);
            
            // If you have actual PHP backend, uncomment this:
            // form.submit();
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// ============================================
// NOTIFICACIONES PUSH
// ============================================
function setupNotifications() {
    // Check if notifications are supported
    if (!('Notification' in window)) return;
    
    // Check if user already decided
    const notificationDecision = localStorage.getItem('elizabethmendez_notifications');
    
    if (!notificationDecision && Notification.permission === 'default') {
        // Show prompt after 10 seconds
        setTimeout(() => {
            const prompt = document.getElementById('notificationPrompt');
            if (prompt) {
                prompt.classList.add('visible');
                prompt.setAttribute('aria-hidden', 'false');
            }
        }, 10000);
    }
}

function subscribeNotifications() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                localStorage.setItem('elizabethmendez_notifications', 'granted');
                new Notification('¡Gracias!', {
                    body: 'Te notificaremos cuando tengamos nuevos diseños',
                    icon: './favicon.png'
                });
            }
            dismissPrompt();
        });
    }
}

function dismissPrompt() {
    const prompt = document.getElementById('notificationPrompt');
    if (prompt) {
        prompt.classList.remove('visible');
        prompt.setAttribute('aria-hidden', 'true');
        localStorage.setItem('elizabethmendez_notifications', 'dismissed');
    }
}

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
            dot.setAttribute('role', 'tab');
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
        
        // Pause on hover
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
            this.currentIndex = this.maxIndex;
        }
        this.updateCarousel();
    }
    
    next() {
        if (this.currentIndex < this.maxIndex) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.maxIndex));
        this.updateCarousel();
    }
    
    updateCarousel() {
        if (!this.slides.length) return;
        
        // Count visible slides
        const visibleSlides = Array.from(this.slides).filter(slide => 
            slide.style.display !== 'none'
        );
        
        if (visibleSlides.length === 0) return;
        
        const slideWidth = visibleSlides[0].offsetWidth;
        const offset = -(this.currentIndex * (slideWidth + this.gap));
        
        this.track.style.transform = `translateX(${offset}px)`;
        this.updateDots();
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
            dot.setAttribute('aria-selected', index === this.currentIndex);
        });
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
            dot.setAttribute('role', 'tab');
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
        
        // Pause on hover
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
            this.currentIndex = this.totalSlides - 1;
        }
        this.updateCarousel();
    }
    
    next() {
        if (this.currentIndex < this.totalSlides - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.updateCarousel();
    }
    
    goToSlide(index) {
        this.currentIndex = Math.max(0, Math.min(index, this.totalSlides - 1));
        this.updateCarousel();
    }
    
    updateCarousel() {
        const offset = -(this.currentIndex * 100);
        this.track.style.transform = `translateX(${offset}%)`;
        this.updateDots();
    }
    
    updateDots() {
        if (!this.dotsContainer) return;
        const dots = this.dotsContainer.querySelectorAll('.testimonial-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
            dot.setAttribute('aria-selected', index === this.currentIndex);
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
// INTERSECTION OBSERVER (ANIMATIONS)
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
// INICIALIZACIÓN
// ============================================
let carouselVestidosInstance = null;
let carouselTestimoniosInstance = null;
let favManager = null;
let compareManager = null;
let smartFilters = null;

function initAll() {
    // Prevent double initialization
    if (!carouselVestidosInstance) {
        carouselVestidosInstance = new CarouselVestidos();
        console.log('✅ Carrusel de vestidos inicializado');
    }
    
    if (!carouselTestimoniosInstance) {
        carouselTestimoniosInstance = new CarouselTestimonios();
        console.log('✅ Carrusel de testimonios inicializado');
    }
    
    if (!favManager) {
        favManager = new FavoritesManager();
        console.log('✅ Sistema de favoritos inicializado');
    }
    
    if (!compareManager) {
        compareManager = new ComparisonManager();
        console.log('✅ Sistema de comparación inicializado');
    }
    
    if (!smartFilters) {
        smartFilters = new SmartFilters();
        console.log('✅ Filtros inteligentes inicializados');
    }
    
    // Setup other features
    setupBudgetCalculator();
    setupNotifications();
    
    console.log('✅ Todas las funcionalidades inicializadas');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

// Make functions globally accessible
window.openQuickView = openQuickView;
window.closeQuickView = closeQuickView;
window.requestQuoteForDress = requestQuoteForDress;
window.requestQuoteFromCalculator = requestQuoteFromCalculator;
window.showComparison = showComparison;
window.closeComparison = closeComparison;
window.clearComparison = clearComparison;
window.closeFavorites = closeFavorites;
window.subscribeNotifications = subscribeNotifications;
window.dismissPrompt = dismissPrompt;
window.resetFilters = resetFilters;
window.favManager = favManager;
window.compareManager = compareManager;
