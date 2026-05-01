// ============================================
// ELIZABETH MENDEZ - FASHION DESIGNER
// JavaScript con Responsive MEJORADO
// ============================================

// ============================================
// VARIABLES GLOBALES
// ============================================
const nav = document.getElementById("navbar");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const scrollTop = document.getElementById("scrollTop");
const stickyCta = document.getElementById("stickyCta");
const footer = document.querySelector("footer");

// ============================================
// NAVEGACIÓN Y EFECTOS SCROLL
// ============================================
let scrollTimeout;
window.addEventListener(
  "scroll",
  () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollY = window.scrollY;

      // Navbar scroll effect
      if (scrollY > 100) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }

      // Scroll to top button
      if (scrollY > 500) {
        scrollTop.classList.add("visible");
      } else {
        scrollTop.classList.remove("visible");
      }

      // Sticky CTA
      if (scrollY > 800) {
        stickyCta.classList.add("visible");
      } else {
        stickyCta.classList.remove("visible");
      }
    }, 10);
  },
  { passive: true },
);

if (stickyCta && footer) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        stickyCta.classList.add("hide");
      } else {
        stickyCta.classList.remove("hide");
      }
    },
    {
      threshold: 0.1,
    },
  );

  observer.observe(footer);
}

// Mobile menu toggle (accesible)
const navOverlay = document.getElementById("navOverlay");

function openMenu() {
  menuToggle.setAttribute("aria-expanded", "true");
  navMenu.classList.add("active");
  if (navOverlay) navOverlay.classList.add("active");
  document.body.classList.add("menu-open");
  menuToggle.setAttribute("aria-label", "Cerrar menú de navegación");
}

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  navMenu.classList.remove("active");
  if (navOverlay) navOverlay.classList.remove("active");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
}

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMenu(); else openMenu();
  });

  // Cerrar al hacer clic en overlay
  if (navOverlay) {
    navOverlay.addEventListener("click", closeMenu);
  }

  // Cerrar menú con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu.classList.contains("active")) {
      closeMenu();
      menuToggle.focus();
    }
  });
}

// Close menu on link click
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Scroll to top
if (scrollTop) {
  scrollTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const offset = 80;
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ============================================
// WHATSAPP CONTEXTUAL
// ============================================
function getWhatsAppMessage() {
  const currentSection = window.location.hash || "#inicio";
  const messages = {
    "#galeria-vestidos":
      "Hola Elizabeth, me interesa saber más sobre tus vestidos de niñas",
    "#servicios": "Hola Elizabeth, necesito información sobre tus servicios",
    "#sobre-mi": "Hola Elizabeth, me gustaría conocer más sobre tu trabajo",
    "#contacto": "Hola Elizabeth, me gustaría solicitar una cotización",
    "#calculadora":
      "Hola Elizabeth, me gustaría obtener una cotización personalizada",
  };
  return (
    messages[currentSection] ||
    "Hola Elizabeth, me interesa solicitar una cotización"
  );
}

function openWhatsApp() {
  const message = encodeURIComponent(getWhatsAppMessage());
  window.open(
    `https://api.whatsapp.com/send?phone=+18492151118&text=${message}`,
    "_blank",
    "noopener",
  );
}

// Botón flotante de WhatsApp
const whatsappBtn = document.getElementById("whatsappBtn");
if (whatsappBtn) {
  whatsappBtn.addEventListener("click", function (e) {
    e.preventDefault();
    openWhatsApp();
  });
}

// Botón de WhatsApp dentro del sticky CTA (desktop)
const stickyCTAWhatsapp = document.getElementById("stickyCTAWhatsapp");
if (stickyCTAWhatsapp) {
  stickyCTAWhatsapp.addEventListener("click", function (e) {
    e.preventDefault();
    openWhatsApp();
  });
}

// ============================================
// SISTEMA DE FAVORITOS (LocalStorage)
// ============================================
class FavoritesManager {
  constructor() {
    this.favorites = JSON.parse(
      localStorage.getItem("elizabethmendez_favorites") || "[]",
    );
    this.init();
  }

  init() {
    this.renderFavoriteButtons();
    this.updateFavoriteCounter();
    this.setupFavoritesModal();
  }

  toggle(itemId) {
    const index = this.favorites.findIndex((f) => f.id === itemId);
    const card = document.querySelector(`[data-id="${itemId}"]`);

    if (!card) return;

    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      const nameEl = card.querySelector(".vestido-name");
      const imageEl = card.querySelector("img");
      const priceEl = card.querySelector(".vestido-price");
      const ageEl = card.querySelector(".vestido-age");

      if (!nameEl || !imageEl || !priceEl || !ageEl) return;

      const itemData = {
        id: itemId,
        name: nameEl.textContent,
        image: imageEl.src,
        price: priceEl.textContent,
        age: ageEl.textContent,
        addedAt: Date.now(),
      };
      this.favorites.push(itemData);
    }

    localStorage.setItem(
      "elizabethmendez_favorites",
      JSON.stringify(this.favorites),
    );
    this.updateUI();
  }

  renderFavoriteButtons() {
    document.querySelectorAll(".favorite-btn").forEach((btn) => {
      const itemId = btn.dataset.id;
      const isFavorite = this.favorites.some((f) => f.id === itemId);

      if (isFavorite) {
        btn.classList.add("active");
      }

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggle(itemId);
      });
    });
  }

  updateUI() {
    document.querySelectorAll(".favorite-btn").forEach((btn) => {
      const itemId = btn.dataset.id;
      const isFavorite = this.favorites.some((f) => f.id === itemId);
      btn.classList.toggle("active", isFavorite);
    });
    this.updateFavoriteCounter();
  }

  updateFavoriteCounter() {
    const counter = document.getElementById("favoritesCounter");
    const btn = document.getElementById("favoritesBtn");
    if (counter && btn) {
      counter.textContent = this.favorites.length;
      btn.style.display = this.favorites.length > 0 ? "flex" : "none";
    }
  }

  setupFavoritesModal() {
    const btn = document.getElementById("favoritesBtn");
    if (btn) {
      btn.addEventListener("click", () => this.showFavorites());
    }
  }

  showFavorites() {
    const modal = document.getElementById("favoritesModal");
    const grid = document.getElementById("favoritesGrid");

    if (!modal || !grid) return;

    if (this.favorites.length === 0) {
      grid.innerHTML =
        '<p style="text-align: center; color: var(--warm-gray); grid-column: 1/-1; padding: 40px 20px;">No tienes vestidos favoritos aún. ¡Explora nuestra colección!</p>';
    } else {
      grid.innerHTML = this.favorites
        .map(
          (fav) => `
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
            `,
        )
        .join("");
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closeFavorites() {
  const modal = document.getElementById("favoritesModal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
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
    document.querySelectorAll(".compare-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const itemId = btn.dataset.id;
        this.toggle(itemId);
      });
    });
  }

  toggle(itemId) {
    const index = this.items.findIndex((i) => i.id === itemId);

    if (index > -1) {
      this.items.splice(index, 1);
    } else {
      if (this.items.length >= this.maxItems) {
        alert(`Solo puedes comparar hasta ${this.maxItems} vestidos a la vez`);
        return;
      }

      const card = document.querySelector(`[data-id="${itemId}"]`);
      if (!card) return;

      const nameEl = card.querySelector(".vestido-name");
      const imageEl = card.querySelector("img");
      const priceEl = card.querySelector(".vestido-price");
      const ageEl = card.querySelector(".vestido-age");
      const descEl = card.querySelector(".vestido-description");

      if (!nameEl || !imageEl || !priceEl || !ageEl || !descEl) return;

      const itemData = {
        id: itemId,
        name: nameEl.textContent,
        image: imageEl.src,
        price: priceEl.textContent,
        age: ageEl.textContent,
        description: descEl.textContent,
      };
      this.items.push(itemData);
    }

    this.updateUI();
  }

  updateUI() {
    // Update buttons
    document.querySelectorAll(".compare-btn").forEach((btn) => {
      const itemId = btn.dataset.id;
      const isSelected = this.items.some((i) => i.id === itemId);
      btn.classList.toggle("active", isSelected);
    });

    // Update compare bar
    const compareBar = document.getElementById("compareBar");
    const compareItems = document.getElementById("compareItems");
    const compareCount = document.getElementById("compareCount");

    if (!compareBar) return;

    if (this.items.length > 0) {
      compareBar.style.display = "flex";
      if (compareItems) {
        compareItems.innerHTML = this.items
          .map(
            (item) => `
                    <div class="compare-item">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                `,
          )
          .join("");
      }
      if (compareCount) {
        compareCount.textContent = this.items.length;
      }
    } else {
      compareBar.style.display = "none";
    }
  }
}

function showComparison() {
  if (!compareManager || compareManager.items.length < 2) {
    alert("Selecciona al menos 2 vestidos para comparar");
    return;
  }

  const modal = document.getElementById("comparisonModal");
  const grid = document.getElementById("comparisonGrid");

  if (!modal || !grid) return;

  grid.innerHTML = compareManager.items
    .map(
      (item) => `
        <div class="comparison-card">
            <img src="${item.image}" alt="${item.name}" style="width: 100%; border-radius: 12px; margin-bottom: 16px;">
            <h4 style="font-size: clamp(18px, 3vw, 20px); margin-bottom: 8px;">${item.name}</h4>
            <p style="font-size: clamp(13px, 2vw, 14px); color: var(--warm-gray); margin-bottom: 12px;">${item.description}</p>
            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; gap: 8px; flex-wrap: wrap;">
                <span style="font-size: clamp(11px, 2vw, 12px); color: var(--terracotta); font-weight: 600;">${item.age}</span>
                <span style="font-size: clamp(14px, 2.5vw, 16px); color: var(--gold); font-weight: 600;">${item.price}</span>
            </div>
            <button class="btn btn-primary btn-small" onclick="openQuickView('${item.id}')">Ver detalles</button>
        </div>
    `,
    )
    .join("");

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeComparison() {
  const modal = document.getElementById("comparisonModal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function clearComparison() {
  if (compareManager) {
    compareManager.items = [];
    compareManager.updateUI();
  }
}

// ============================================
// CALCULADORA DE PRESUPUESTO CON SOPORTE DE MONEDAS
// ============================================
function setupBudgetCalculator() {
  const dressType = document.getElementById("dressType");
  const sizeRange = document.getElementById("sizeRange");
  const sizeDisplay = document.getElementById("sizeDisplay");
  const extraCheckboxes = document.querySelectorAll(".extra-checkbox");
  const totalPrice = document.getElementById("totalPrice");
  const totalPriceSecondary = document.getElementById("totalPriceSecondary");

  if (!dressType || !sizeRange || !totalPrice) return;

  // Configuración de monedas
  let currentCurrency = "USD"; // Moneda por defecto
  const exchangeRate = 58; // 1 USD = 58 RD$ (ajustable según tasa actual)

  // Guardar los precios originales en USD para las opciones del select
  const dressTypeOptions = [];
  Array.from(dressType.options).forEach((option) => {
    dressTypeOptions.push({
      element: option,
      text: option.textContent,
      value: parseInt(option.value) || 0,
      // Extraer el texto sin el precio para poder regenerarlo
      baseName: option.textContent.split(" - desde")[0],
    });
  });

  // Crear selector de moneda si no existe
  createCurrencySelector();

  function createCurrencySelector() {
    // Verificar si ya existe
    if (document.querySelector(".currency-selector")) return;

    const calculator = document.querySelector(".quote-calculator");
    if (!calculator) return;

    const selectorHTML = `
            <div class="currency-selector" role="tablist" aria-label="Selector de moneda">
                <button class="currency-btn active" data-currency="USD" role="tab" aria-selected="true" aria-controls="precio-usd">
                    <span class="currency-flag" role="img" aria-label="Bandera de Estados Unidos">🇺🇸</span>
                    <span class="currency-label">
                        <span class="currency-symbol">US$</span>
                        <span class="currency-name">Dólares</span>
                    </span>
                </button>
                <button class="currency-btn" data-currency="RD" role="tab" aria-selected="false" aria-controls="precio-rd">
                    <span class="currency-flag" role="img" aria-label="Bandera de República Dominicana">🇩🇴</span>
                    <span class="currency-label">
                        <span class="currency-symbol">RD$</span>
                        <span class="currency-name">Pesos</span>
                    </span>
                </button>
            </div>
        `;

    calculator.insertAdjacentHTML("afterbegin", selectorHTML);

    // Obtener referencia al contenedor
    const selector = document.querySelector(".currency-selector");

    // Agregar event listeners a los botones de moneda
    document.querySelectorAll(".currency-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        currentCurrency = this.dataset.currency;

        // Actualizar estado visual de los botones
        document.querySelectorAll(".currency-btn").forEach((b) => {
          b.classList.remove("active");
          b.setAttribute("aria-selected", "false");
        });
        this.classList.add("active");
        this.setAttribute("aria-selected", "true");

        // Actualizar clase del selector para la animación del fondo
        if (currentCurrency === "RD") {
          selector.classList.add("rd-active");
        } else {
          selector.classList.remove("rd-active");
        }

        // Actualizar todos los precios
        updateDressTypeOptions();
        updateExtraPrices();
        calculateTotal();
      });
    });
  }

  function formatPrice(amount, currency) {
    const formattedAmount = new Intl.NumberFormat("es-DO", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    if (currency === "RD") {
      return `RD$${formattedAmount}`;
    }
    return `US$${formattedAmount}`;
  }

  function convertPrice(usdAmount) {
    if (currentCurrency === "RD") {
      return Math.round(usdAmount * exchangeRate);
    }
    return usdAmount;
  }

  function updateDressTypeOptions() {
    // Guardar la opción seleccionada actualmente
    const currentValue = dressType.value;

    // Actualizar el texto de cada opción con el precio en la moneda actual
    dressTypeOptions.forEach((optionData) => {
      const displayPrice = convertPrice(optionData.value);
      optionData.element.textContent = `${optionData.baseName} - desde ${formatPrice(displayPrice, currentCurrency)}`;
    });

    // Restaurar la selección
    dressType.value = currentValue;
  }

  function calculateTotal() {
    let totalUSD = parseInt(dressType.value) || 0;

    extraCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        totalUSD += parseInt(checkbox.value) || 0;
      }
    });

    const displayAmount = convertPrice(totalUSD);
    totalPrice.textContent = formatPrice(displayAmount, currentCurrency);

    // Mostrar precio en la otra moneda como referencia
    if (totalPriceSecondary) {
      const secondaryCurrency = currentCurrency === "USD" ? "RD" : "USD";
      const secondaryAmount =
        secondaryCurrency === "RD"
          ? Math.round(totalUSD * exchangeRate)
          : totalUSD;
      totalPriceSecondary.textContent = `≈ ${formatPrice(secondaryAmount, secondaryCurrency)}`;
    }
  }

  function updateExtraPrices() {
    document.querySelectorAll(".extra-price").forEach((priceEl) => {
      const checkbox = priceEl
        .closest(".extra-option")
        .querySelector('input[type="checkbox"]');
      if (!checkbox) return;

      const usdPrice = parseInt(checkbox.value) || 0;
      const displayPrice = convertPrice(usdPrice);
      priceEl.textContent = formatPrice(displayPrice, currentCurrency);
    });
  }

  // Event listeners
  dressType.addEventListener("change", calculateTotal);

  if (sizeRange && sizeDisplay) {
    sizeRange.addEventListener("input", (e) => {
      sizeDisplay.textContent = `${e.target.value} años`;
    });
  }

  extraCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const option = this.closest(".extra-option");
      if (option) {
        option.classList.toggle("selected", this.checked);
      }
      calculateTotal();
    });
  });

  // Inicializar
  calculateTotal();
  updateExtraPrices();
}

function requestQuoteFromCalculator() {
  const dressType = document.getElementById("dressType");
  const sizeRange = document.getElementById("sizeRange");

  if (!dressType || !sizeRange) return;

  const extras = Array.from(
    document.querySelectorAll(".extra-checkbox:checked"),
  )
    .map((cb) => {
      const extraName = cb.parentElement.querySelector(".extra-name");
      return extraName ? extraName.textContent : "";
    })
    .filter(Boolean)
    .join(", ");

  const message = `Hola Elizabeth, me interesa un presupuesto para:
- Tipo: ${dressType.options[dressType.selectedIndex].text}
- Talla: ${sizeRange.value} años
${extras ? `- Extras: ${extras}` : ""}

¿Podrías darme más información?`;

  const encodedMessage = encodeURIComponent(message);
  window.open(
    `https://api.whatsapp.com/send?phone=+18492151118&text=${encodedMessage}`,
    "_blank",
  );
}

// ... [El resto del archivo script.js continúa igual]

// ============================================
// FILTROS INTELIGENTES
// ============================================
class SmartFilters {
  constructor() {
    this.activeFilters = {
      edad: [],
      ocasion: [],
      color: [],
      precio: [],
    };
    this.init();
  }

  init() {
    this.setupFilterChips();
    this.setupFilterInputs();
  }

  setupFilterChips() {
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        if (e.target.closest(".chip-dropdown")) return;

        const isExpanded = chip.getAttribute("aria-expanded") === "true";

        // Close all other dropdowns
        document.querySelectorAll(".filter-chip").forEach((c) => {
          if (c !== chip) c.setAttribute("aria-expanded", "false");
        });

        chip.setAttribute("aria-expanded", String(!isExpanded));
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".filter-chip")) {
        document.querySelectorAll(".filter-chip").forEach((chip) => {
          chip.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  setupFilterInputs() {
    document
      .querySelectorAll('.chip-dropdown input[type="checkbox"]')
      .forEach((input) => {
        input.addEventListener("change", () => {
          const chip = input.closest(".filter-chip");
          if (!chip) return;

          const filterType = chip.dataset.filter;
          const filterValue = input.value;

          if (input.checked) {
            if (!this.activeFilters[filterType].includes(filterValue)) {
              this.activeFilters[filterType].push(filterValue);
            }
          } else {
            this.activeFilters[filterType] = this.activeFilters[
              filterType
            ].filter((v) => v !== filterValue);
          }

          this.applyFilters();
        });
      });
  }

  applyFilters() {
    const cards = document.querySelectorAll(".vestido-card");

    cards.forEach((card) => {
      let show = true;

      // Check each filter type
      for (const [type, values] of Object.entries(this.activeFilters)) {
        if (values.length > 0) {
          const cardValue = card.dataset[type];

          if (type === "precio") {
            // Extract numeric price
            const priceEl = card.querySelector(".vestido-price");
            if (!priceEl) continue;

            const priceText = priceEl.textContent;
            const priceMatch = priceText.match(/\d+/);
            if (!priceMatch) continue;

            const price = parseInt(priceMatch[0]);

            const matchesPrice = values.some((range) => {
              if (range === "0-100") return price < 100;
              if (range === "100-150") return price >= 100 && price < 150;
              if (range === "150-200") return price >= 150 && price < 200;
              if (range === "200+") return price >= 200;
              return false;
            });

            if (!matchesPrice) show = false;
          } else {
            if (!values.includes(cardValue)) show = false;
          }
        }
      }

      const slide = card.closest(".carousel-slide");
      if (slide) {
        slide.style.display = show ? "block" : "none";
      }
    });

    // Mostrar / ocultar empty state
    const visibleCount = Array.from(cards).filter((c) => {
      const slide = c.closest(".carousel-slide");
      return slide && slide.style.display !== "none";
    }).length;

    const emptyState = getOrCreateEmptyState();
    if (emptyState) {
      emptyState.style.display = visibleCount === 0 ? "block" : "none";
    }

    // Update carousel after filtering
    if (window.carouselVestidosInstance) {
      window.carouselVestidosInstance.updateCarousel();
    }
  }
}

function resetFilters() {
  // Uncheck all filter inputs
  document
    .querySelectorAll('.chip-dropdown input[type="checkbox"]')
    .forEach((input) => {
      input.checked = false;
    });

  // Show all cards
  document.querySelectorAll(".carousel-slide").forEach((slide) => {
    slide.style.display = "block";
  });

  // Ocultar empty state
  const emptyState = document.getElementById("gallery-empty-state");
  if (emptyState) emptyState.style.display = "none";

  // Reset filter manager
  if (window.smartFilters) {
    window.smartFilters.activeFilters = {
      edad: [],
      ocasion: [],
      color: [],
      precio: [],
    };

    // Update carousel
    if (window.carouselVestidosInstance) {
      window.carouselVestidosInstance.updateCarousel();
    }
  }
}

// ============================================
// QUICK VIEW MODAL
// ============================================
function openQuickView(vestidoId) {
  const card = document.querySelector(`[data-id="${vestidoId}"]`);
  if (!card) return;

  const modal = document.getElementById("quickViewModal");
  const modalBody = document.getElementById("modalBody");

  if (!modal || !modalBody) return;

  const nameEl = card.querySelector(".vestido-name");
  const imageEl = card.querySelector("img");
  const descEl = card.querySelector(".vestido-description");
  const priceEl = card.querySelector(".vestido-price");
  const ageEl = card.querySelector(".vestido-age");

  if (!nameEl || !imageEl || !descEl || !priceEl || !ageEl) return;

  const name = nameEl.textContent;
  const image = imageEl.src;
  const description = descEl.textContent;
  const price = priceEl.textContent;
  const age = ageEl.textContent;

  modalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr; gap: 32px; align-items: start;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px;">
                <div>
                    <img src="${image}" alt="${name}" style="width: 100%; border-radius: 16px;">
                </div>
                <div>
                    <h2 style="font-size: clamp(28px, 5vw, 36px); margin-bottom: 16px;">${name}</h2>
                    <p style="font-size: clamp(15px, 2vw, 16px); color: var(--warm-gray); margin-bottom: 24px;">${description}</p>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 24px;">
                        <div style="background: var(--gradient-soft); padding: 16px 24px; border-radius: 12px;">
                            <div style="font-size: 12px; color: var(--warm-gray); margin-bottom: 4px;">Talla</div>
                            <div style="font-size: clamp(16px, 3vw, 18px); font-weight: 600; color: var(--charcoal);">${age}</div>
                        </div>
                        <div style="background: var(--gradient-soft); padding: 16px 24px; border-radius: 12px;">
                            <div style="font-size: 12px; color: var(--warm-gray); margin-bottom: 4px;">Precio</div>
                            <div style="font-size: clamp(16px, 3vw, 18px); font-weight: 600; color: var(--gold);">${price}</div>
                        </div>
                    </div>
                    
                    <div style="background: white; border: 2px solid var(--beige); padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                        <h3 style="font-size: clamp(16px, 3vw, 18px); margin-bottom: 12px;">Características</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li style="padding: 8px 0; padding-left: 24px; position: relative; font-size: clamp(13px, 2vw, 14px);">
                                <span style="position: absolute; left: 0; color: var(--gold);">✓</span>
                                Diseño exclusivo y único
                            </li>
                            <li style="padding: 8px 0; padding-left: 24px; position: relative; font-size: clamp(13px, 2vw, 14px);">
                                <span style="position: absolute; left: 0; color: var(--gold);">✓</span>
                                Telas premium importadas
                            </li>
                            <li style="padding: 8px 0; padding-left: 24px; position: relative; font-size: clamp(13px, 2vw, 14px);">
                                <span style="position: absolute; left: 0; color: var(--gold);">✓</span>
                                Confección artesanal
                            </li>
                            <li style="padding: 8px 0; padding-left: 24px; position: relative; font-size: clamp(13px, 2vw, 14px);">
                                <span style="position: absolute; left: 0; color: var(--gold);">✓</span>
                                Ajuste personalizado
                            </li>
                        </ul>
                    </div>
                    
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <button class="btn btn-primary" style="flex: 1; min-width: 200px;" onclick="requestQuoteForDress('${name.replace(/'/g, "\\'")}')">Solicitar cotización</button>
                        <button class="btn btn-outline" onclick="favManager.toggle('${vestidoId}')">Agregar a favoritos</button>
                    </div>
                </div>
            </div>
        </div>
    `;

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeQuickView() {
  const modal = document.getElementById("quickViewModal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function requestQuoteForDress(dressName) {
  const message = `Hola Elizabeth, me interesa el vestido "${dressName}". ¿Podrías darme más información y una cotización?`;
  const encodedMessage = encodeURIComponent(message);
  window.open(
    `https://api.whatsapp.com/send?phone=+18492151118&text=${encodedMessage}`,
    "_blank",
  );
  closeQuickView();
}

// ... [El resto continúa en el siguiente bloque]

// ============================================
// VALIDACIÓN DE FORMULARIO MEJORADA
// ============================================
const form = document.getElementById("contactForm");
if (form) {
  const nombreInput = document.getElementById("nombre");
  const emailInput = document.getElementById("email");
  const mensajeInput = document.getElementById("mensaje");
  const charCount = document.getElementById("charCount");

  // Character counter mejorado
  const charCounterEl = document.querySelector(".char-counter");
  if (mensajeInput && charCount) {
    mensajeInput.addEventListener("input", (e) => {
      const count = e.target.value.length;
      charCount.textContent = count;
      if (charCounterEl) {
        charCounterEl.classList.remove("warning", "limit");
        if (count > 900) charCounterEl.classList.add("limit");
        else if (count > 700) charCounterEl.classList.add("warning");
      }
    });
  }

  // Real-time validation con aria-invalid y success hints
  function validateField(field, validator, errorMessage, successMessage) {
    if (!field) return;

    const group = field.closest(".form-group");
    if (!group) return;

    const errorSpan = group.querySelector(".error-message");
    const successSpan = group.querySelector(".success-hint");

    function applyValidation() {
      const valid = validator(field.value);
      if (!valid) {
        group.classList.add("has-error");
        group.classList.remove("has-success");
        field.setAttribute("aria-invalid", "true");
        if (errorSpan) errorSpan.textContent = errorMessage;
        if (successSpan) { successSpan.textContent = ""; successSpan.setAttribute("aria-hidden", "true"); }
      } else {
        group.classList.remove("has-error");
        group.classList.add("has-success");
        field.setAttribute("aria-invalid", "false");
        if (errorSpan) errorSpan.textContent = "";
        if (successSpan && successMessage) {
          successSpan.textContent = successMessage;
          successSpan.setAttribute("aria-hidden", "false");
        }
      }
      return valid;
    }

    field.addEventListener("blur", applyValidation);

    field.addEventListener("input", () => {
      if (group.classList.contains("has-error")) applyValidation();
    });

    return applyValidation;
  }

  // Validación y formateo de teléfono dominicano
  const telefonoInput = document.getElementById("telefono");
  if (telefonoInput) {
    // Actualizar placeholder
    telefonoInput.placeholder = "+1 (809) 123-4567";

    // Formateo automático mientras el usuario escribe
    telefonoInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, ""); // Eliminar todo excepto números

      // Limitar a 11 dígitos (1 + 3 código área + 7 número)
      if (value.length > 11) {
        value = value.substring(0, 11);
      }

      // Formatear según la cantidad de dígitos
      let formatted = "";

      if (value.length > 0) {
        // Agregar +1
        formatted = "+1";

        if (value.length > 1) {
          // Agregar código de área entre paréntesis
          formatted += " (" + value.substring(1, Math.min(4, value.length));

          if (value.length >= 4) {
            formatted += ")";

            if (value.length > 4) {
              // Agregar primera parte del número
              formatted += " " + value.substring(4, Math.min(7, value.length));

              if (value.length > 7) {
                // Agregar segunda parte del número con guión
                formatted += "-" + value.substring(7, 11);
              }
            }
          }
        }
      }

      e.target.value = formatted;
    });

    // Validación específica para números dominicanos
    validateField(
      telefonoInput,
      (value) => {
        // Permitir campo vacío (es opcional según el diseño)
        if (value.trim() === "") return true;

        // Extraer solo números
        const numbers = value.replace(/\D/g, "");

        // Validar:
        // 1. Debe tener 11 dígitos (1 + código área de 3 + número de 7)
        // 2. Debe empezar con 1 (código país)
        // 3. El código de área debe ser 809, 829, o 849
        if (numbers.length !== 11) return false;
        if (!numbers.startsWith("1")) return false;

        const areaCode = numbers.substring(1, 4);
        const validAreaCodes = ["809", "829", "849"];

        return validAreaCodes.includes(areaCode);
      },
      "Por favor, ingresa un número válido de RD: +1 (809/829/849) 123-4567",
    );

    // Agregar ayuda visual cuando el campo está enfocado
    telefonoInput.addEventListener("focus", function () {
      const group = this.closest(".form-group");
      if (group) {
        let helper = group.querySelector(".phone-helper");
        if (!helper) {
          helper = document.createElement("small");
          helper.className = "phone-helper";
          helper.style.cssText = `
                        display: block;
                        margin-top: 6px;
                        font-size: 12px;
                        color: var(--info);
                        font-style: italic;
                    `;
          helper.textContent = "Códigos válidos: 809, 829, 849";
          this.parentNode.appendChild(helper);
        }
        helper.style.display = "block";
      }
    });

    telefonoInput.addEventListener("blur", function () {
      const helper =
        this.closest(".form-group")?.querySelector(".phone-helper");
      if (helper) {
        setTimeout(() => {
          helper.style.display = "none";
        }, 200);
      }
    });
  }

  if (nombreInput) {
    validateField(
      nombreInput,
      (value) => value.trim().length >= 2,
      "Por favor, ingresa tu nombre completo",
      "Nombre válido ✓",
    );
  }

  if (emailInput) {
    validateField(
      emailInput,
      (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Por favor, ingresa un correo electrónico válido",
      "Correo válido ✓",
    );
  }

  if (mensajeInput) {
    validateField(
      mensajeInput,
      (value) => value.trim().length >= 10,
      "Por favor, describe tu proyecto con más detalle (mínimo 10 caracteres)",
      "Descripción lista ✓",
    );
  }

  const servicioInput = document.getElementById("servicio");
  if (servicioInput) {
    validateField(
      servicioInput,
      (value) => value !== "",
      "Por favor, selecciona un tipo de servicio",
      "Servicio seleccionado ✓",
    );
  }

  // Toast helper
  function showFormToast(type, message) {
    const toast = document.getElementById("formToast");
    const icon = document.getElementById("formToastIcon");
    const msg = document.getElementById("formToastMsg");
    const status = document.getElementById("form-status");
    if (!toast || !icon || !msg) return;

    toast.className = `form-toast ${type} visible`;
    icon.textContent = type === "success" ? "✓" : "⚠";
    msg.textContent = message;
    if (status) status.textContent = message;

    setTimeout(() => {
      toast.classList.remove("visible");
      if (status) status.textContent = "";
    }, 6000);
  }

  // Form submission — envía al backend PHP real
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");

    // Validar todos los campos obligatorios antes de enviar
    let isValid = true;
    const fieldsToValidate = [
      { el: nombreInput, fn: (v) => v.trim().length >= 2, msg: "Por favor, ingresa tu nombre completo" },
      { el: emailInput, fn: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: "Por favor, ingresa un correo electrónico válido" },
      { el: mensajeInput, fn: (v) => v.trim().length >= 10, msg: "Por favor, describe tu proyecto (mínimo 10 caracteres)" },
    ];

    const servicioEl = document.getElementById("servicio");
    if (servicioEl) {
      fieldsToValidate.push({ el: servicioEl, fn: (v) => v !== "", msg: "Por favor, selecciona un tipo de servicio" });
    }

    fieldsToValidate.forEach(({ el, fn, msg }) => {
      if (!el) return;
      const group = el.closest(".form-group");
      if (!group) return;
      const errorSpan = group.querySelector(".error-message");
      if (!fn(el.value)) {
        group.classList.add("has-error");
        group.classList.remove("has-success");
        el.setAttribute("aria-invalid", "true");
        if (errorSpan) errorSpan.textContent = msg;
        isValid = false;
      }
    });

    if (!isValid) {
      const firstError = form.querySelector(".has-error");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      showFormToast("error", "Por favor corrige los campos marcados antes de enviar.");
      return;
    }

    // Activar estado de carga
    if (submitBtn) submitBtn.classList.add("loading");

    // Enviar al backend PHP
    const formData = new FormData(form);
    fetch(form.action, { method: "POST", body: formData })
      .then((res) => {
        // PHP redirige con ?status=success — interceptamos la URL final
        const url = new URL(res.url);
        const status = url.searchParams.get("status");
        if (status === "success") {
          showFormToast("success", "¡Mensaje enviado! Elizabeth te contactará pronto.");
          form.reset();
          if (charCount) charCount.textContent = "0";
          form.querySelectorAll(".form-group").forEach((g) => g.classList.remove("has-error", "has-success"));
          form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
        } else {
          showFormToast("error", "Hubo un problema al enviar. Inténtalo de nuevo o contáctanos por WhatsApp.");
        }
      })
      .catch(() => {
        showFormToast("error", "Sin conexión. Por favor escríbenos por WhatsApp o inténtalo más tarde.");
      })
      .finally(() => {
        if (submitBtn) submitBtn.classList.remove("loading");
      });
  });
}

// ============================================
// NOTIFICACIONES PUSH
// ============================================
function setupNotifications() {
  // Check if notifications are supported
  if (!("Notification" in window)) return;

  // Check if user already decided
  const notificationDecision = localStorage.getItem(
    "elizabethmendez_notifications",
  );

  if (!notificationDecision && Notification.permission === "default") {
    // Show prompt after 10 seconds
    setTimeout(() => {
      const prompt = document.getElementById("notificationPrompt");
      if (prompt) {
        prompt.classList.add("visible");
        prompt.setAttribute("aria-hidden", "false");
      }
    }, 10000);
  }
}

function subscribeNotifications() {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        localStorage.setItem("elizabethmendez_notifications", "granted");
        new Notification("¡Gracias!", {
          body: "Te notificaremos cuando tengamos nuevos diseños",
          icon: "./favicon.png",
        });
      }
      dismissPrompt();
    });
  }
}

function dismissPrompt() {
  const prompt = document.getElementById("notificationPrompt");
  if (prompt) {
    prompt.classList.remove("visible");
    prompt.setAttribute("aria-hidden", "true");
    localStorage.setItem("elizabethmendez_notifications", "dismissed");
  }
}

// ... [Carruseles y el resto del código continúan]

// ============================================
// CARRUSEL DE VESTIDOS (Multi-slide) - MEJORADO
// ============================================
class CarouselVestidos {
  constructor() {
    this.track = document.getElementById("carouselTrack");
    if (!this.track) return;

    this.slides = Array.from(
      document.querySelectorAll("#carouselTrack .carousel-slide"),
    );
    this.prevBtn = document.querySelector(
      ".galeria-vestidos .carousel-btn-prev",
    );
    this.nextBtn = document.querySelector(
      ".galeria-vestidos .carousel-btn-next",
    );
    this.dotsContainer = document.getElementById("carouselDots");

    this.currentIndex = 0;
    this.slidesPerView = this.getSlidesPerView();
    this.totalSlides = this.slides.length;
    this.maxIndex = Math.max(0, this.totalSlides - this.slidesPerView);
    this.autoPlayInterval = null;
    this.isTransitioning = false;
    this.lastVisibleCount = this.totalSlides; // para detectar cambios de filtro

    this.init();
  }

  getSlidesPerView() {
    const width = window.innerWidth;
    if (width <= 768) return 1;
    if (width <= 1200) return 2;
    return 3;
  }

  getGap() {
    const width = window.innerWidth;
    if (width <= 768) return 16;
    if (width <= 1200) return 24;
    return 32;
  }

  init() {
    this.createDots();
    this.setupEventListeners();
    this.updateCarousel();
    this.startAutoPlay();
  }

  createDots() {
    if (!this.dotsContainer) return;

    this.dotsContainer.innerHTML = "";
    const dotsCount = this.maxIndex + 1;

    for (let i = 0; i < dotsCount; i++) {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot");
      dot.setAttribute("aria-label", `Ir a slide ${i + 1}`);
      dot.setAttribute("role", "tab");
      dot.addEventListener("click", () => {
        this.goToSlide(i);
        this.resetAutoPlay();
      });
      this.dotsContainer.appendChild(dot);
    }

    this.updateDots();
  }

  setupEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        if (!this.isTransitioning) {
          this.prev();
          this.resetAutoPlay();
        }
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        if (!this.isTransitioning) {
          this.next();
          this.resetAutoPlay();
        }
      });
    }

    // Touch events
    let touchStartX = 0;
    let touchEndX = 0;

    this.track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    this.track.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50 && !this.isTransitioning) {
          if (diff > 0) this.next();
          else this.prev();
          this.resetAutoPlay();
        }
      },
      { passive: true },
    );

    // Pause on hover
    const container = document.querySelector(".carousel-container");
    if (container) {
      container.addEventListener("mouseenter", () => this.stopAutoPlay());
      container.addEventListener("mouseleave", () => this.startAutoPlay());
    }

    // Resize with debounce
    let resizeTimer;
    window.addEventListener("resize", () => {
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

    this.isTransitioning = true;

    // Lee el gap real del CSS (clamp puede dar un valor distinto al de getGap())
    const computedGap =
      parseFloat(window.getComputedStyle(this.track).columnGap) ||
      parseFloat(window.getComputedStyle(this.track).gap) ||
      this.getGap();

    // Calcula slideWidth a partir del contenedor real, no del offsetWidth del slide
    const wrapperWidth = this.track.parentElement.offsetWidth;
    const slideWidth =
      (wrapperWidth - (this.slidesPerView - 1) * computedGap) /
      this.slidesPerView;

    // Aplica ancho exacto a cada slide para evitar desajustes de layout
    this.slides.forEach((slide) => {
      slide.style.width    = `${slideWidth}px`;
      slide.style.minWidth = `${slideWidth}px`;
      slide.style.flexShrink = "0";
    });

    const offset = -(this.currentIndex * (slideWidth + computedGap));
    this.track.style.transform = `translateX(${offset}px)`;
    this.updateDots();

    // Actualiza maxIndex por si el número de slides visibles cambió
    const visibleSlides = this.slides.filter(
      (s) => s.style.display !== "none",
    );
    const visibleCount = visibleSlides.length;
    if (visibleCount !== this.lastVisibleCount) {
      this.lastVisibleCount = visibleCount;
      this.maxIndex = Math.max(0, visibleCount - this.slidesPerView);
      this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
      this.createDots();
    }

    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }

  updateDots() {
    if (!this.dotsContainer) return;
    const dots = this.dotsContainer.querySelectorAll(".carousel-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex);
      dot.setAttribute("aria-selected", String(index === this.currentIndex));
    });
  }

  startAutoPlay() {
    this.stopAutoPlay();
    if (this.totalSlides > this.slidesPerView) {
      this.autoPlayInterval = setInterval(() => {
        if (!this.isTransitioning) {
          this.next();
        }
      }, 4000);
    }
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
// CARRUSEL DE TESTIMONIOS (Single-slide) - MEJORADO
// ============================================
class CarouselTestimonios {
  constructor() {
    this.track = document.getElementById("testimonialsTrack");
    if (!this.track) return;

    this.slides = Array.from(
      document.querySelectorAll("#testimonialsTrack .testimonial-slide"),
    );
    this.prevBtn = document.querySelector(".testimonial-btn-prev");
    this.nextBtn = document.querySelector(".testimonial-btn-next");
    this.dotsContainer = document.getElementById("testimonialsDots");

    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.autoPlayInterval = null;
    this.isTransitioning = false;

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

    this.dotsContainer.innerHTML = "";

    for (let i = 0; i < this.totalSlides; i++) {
      const dot = document.createElement("button");
      dot.classList.add("testimonial-dot");
      dot.setAttribute("aria-label", `Ir a testimonio ${i + 1}`);
      dot.setAttribute("role", "tab");
      dot.addEventListener("click", () => {
        this.goToSlide(i);
        this.resetAutoPlay();
      });
      this.dotsContainer.appendChild(dot);
    }

    this.updateDots();
  }

  setupEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        if (!this.isTransitioning) {
          this.prev();
          this.resetAutoPlay();
        }
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        if (!this.isTransitioning) {
          this.next();
          this.resetAutoPlay();
        }
      });
    }

    // Touch events
    let touchStartX = 0;
    let touchEndX = 0;

    this.track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    this.track.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50 && !this.isTransitioning) {
          if (diff > 0) this.next();
          else this.prev();
          this.resetAutoPlay();
        }
      },
      { passive: true },
    );

    // Pause on hover
    const container = document.querySelector(
      ".testimonials-carousel-container",
    );
    if (container) {
      container.addEventListener("mouseenter", () => this.stopAutoPlay());
      container.addEventListener("mouseleave", () => this.startAutoPlay());
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
    this.isTransitioning = true;

    const offset = -(this.currentIndex * 100);
    this.track.style.transform = `translateX(${offset}%)`;
    this.updateDots();

    // Reset transition flag after animation
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }

  updateDots() {
    if (!this.dotsContainer) return;
    const dots = this.dotsContainer.querySelectorAll(".testimonial-dot");
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex);
      dot.setAttribute("aria-selected", String(index === this.currentIndex));
    });
  }

  startAutoPlay() {
    this.stopAutoPlay();
    if (this.totalSlides > 1) {
      this.autoPlayInterval = setInterval(() => {
        if (!this.isTransitioning) {
          this.next();
        }
      }, 5000);
    }
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
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el);
});

// ============================================
// CSRF TOKEN — generado en cliente, validado en PHP
// ============================================
function generateCSRFToken() {
  const token = crypto.randomUUID ? crypto.randomUUID() :
    ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
      (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
  sessionStorage.setItem("csrf_token", token);
  const field = document.getElementById("csrfToken");
  if (field) field.value = token;
}

// ============================================
// NAV ACTIVO — resalta la sección visible
// ============================================
function setupActiveNav() {
  const sections = document.querySelectorAll("section[id], div[id='main-content']");
  const navLinks = document.querySelectorAll(".nav-menu a[href^='#']");

  if (!sections.length || !navLinks.length) return;

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const href = link.getAttribute("href").replace("#", "");
          link.classList.toggle("active", href === id);
        });
      }
    });
  }, { rootMargin: "-40% 0px -55% 0px", threshold: 0 });

  sections.forEach((s) => navObserver.observe(s));
}

// ============================================
// INICIALIZACIÓN
// ============================================
let carouselVestidosInstance = null;
let carouselTestimoniosInstance = null;
let favManager = null;
let compareManager = null;
let smartFilters = null;

function initAll() {
  console.log("🚀 Iniciando Elizabeth Mendez Website...");

  // Prevent double initialization
  if (!carouselVestidosInstance) {
    carouselVestidosInstance = new CarouselVestidos();
    window.carouselVestidosInstance = carouselVestidosInstance;
    console.log("✅ Carrusel de vestidos inicializado");
  }

  if (!carouselTestimoniosInstance) {
    carouselTestimoniosInstance = new CarouselTestimonios();
    window.carouselTestimoniosInstance = carouselTestimoniosInstance;
    console.log("✅ Carrusel de testimonios inicializado");
  }

  if (!favManager) {
    favManager = new FavoritesManager();
    window.favManager = favManager;
    console.log("✅ Sistema de favoritos inicializado");
  }

  if (!compareManager) {
    compareManager = new ComparisonManager();
    window.compareManager = compareManager;
    console.log("✅ Sistema de comparación inicializado");
  }

  if (!smartFilters) {
    smartFilters = new SmartFilters();
    window.smartFilters = smartFilters;
    console.log("✅ Filtros inteligentes inicializados");
  }

  // Setup other features
  setupBudgetCalculator();
  setupNotifications();
  generateCSRFToken();
  setupActiveNav();
  setupCounters();

  // ── Nuevas mejoras UX ──
  setupRipple();
  setupSkeletonLoaders();
  getOrCreateEmptyState();
  updateFilterCounts();
  setupLabelFocus();

  console.log("✅ Todas las funcionalidades inicializadas correctamente");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAll);
} else {
  initAll();
}

// ============================================
// BARRA DE PROGRESO DE SCROLL
// ============================================
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(pct, 100)}%`;
  }, { passive: true });
}

// ============================================
// CONTADORES ANIMADOS (count-up al entrar en viewport)
// ============================================
function animateCounter(el, target, suffix, duration = 1600) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = isFloat
      ? (target * ease).toFixed(1)
      : Math.round(target * ease);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function setupCounters() {
  const counterEls = document.querySelectorAll('.stat-number, .feature-number');
  if (!counterEls.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const suffix = raw.replace(/[\d.]/g, '');  // "+", "%", etc.
      const value  = parseFloat(raw.replace(/[^\d.]/g, ''));
      if (!isNaN(value)) animateCounter(el, value, suffix);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });

  counterEls.forEach((el) => counterObserver.observe(el));
}

// ============================================
// RIPPLE EFFECT EN BOTONES
// ============================================
function setupRipple() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      // No aplicar en botones deshabilitados o con loading
      if (btn.classList.contains("loading") || btn.disabled) return;

      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

// ============================================
// SKELETON LOADER — IMÁGENES DE VESTIDOS
// ============================================
function setupSkeletonLoaders() {
  document.querySelectorAll(".vestido-image img").forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("img-loaded");
      return;
    }
    img.classList.add("img-loading");
    img.addEventListener("load", () => {
      img.classList.remove("img-loading");
      img.classList.add("img-loaded");
    });
    img.addEventListener("error", () => {
      img.classList.remove("img-loading");
    });
  });
}

// ============================================
// EMPTY STATE — GALERÍA SIN RESULTADOS
// ============================================
function getOrCreateEmptyState() {
  let el = document.getElementById("gallery-empty-state");
  if (!el) {
    el = document.createElement("div");
    el.id = "gallery-empty-state";
    el.className = "gallery-empty-state";
    el.innerHTML = `
      <div class="empty-icon">👗</div>
      <h3>No encontramos vestidos con esos filtros</h3>
      <p>Prueba con otras opciones o
        <button onclick="resetFilters()" class="btn-link">limpia los filtros</button>
      </p>`;
    const track = document.getElementById("carouselTrack");
    if (track && track.parentNode) {
      track.parentNode.insertBefore(el, track.nextSibling);
    }
  }
  return el;
}

// ============================================
// FILTER COUNT BADGES
// ============================================
function updateFilterCounts() {
  const cards = Array.from(document.querySelectorAll(".vestido-card"));
  if (!cards.length) return;

  document.querySelectorAll(".filter-chip").forEach((chip) => {
    const filterType = chip.dataset.filter;

    chip.querySelectorAll('.chip-dropdown input[type="checkbox"]').forEach((input) => {
      const value = input.value;
      let count = 0;

      if (filterType === "precio") {
        count = cards.filter((c) => {
          const priceEl = c.querySelector(".vestido-price");
          if (!priceEl) return false;
          const price = parseInt(priceEl.textContent.replace(/\D/g, "") || "0");
          if (value === "0-100")   return price < 100;
          if (value === "100-150") return price >= 100 && price < 150;
          if (value === "150-200") return price >= 150 && price < 200;
          if (value === "200+")    return price >= 200;
          return false;
        }).length;
      } else {
        count = cards.filter((c) => c.dataset[filterType] === value).length;
      }

      const label = input.closest("label");
      if (!label) return;

      let badge = label.querySelector(".filter-count");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "filter-count";
        label.appendChild(badge);
      }
      badge.textContent = count;
      badge.style.display = count > 0 ? "inline-flex" : "none";
    });
  });
}

// ============================================
// LABEL FOCUS — ANIMACIÓN SUAVE
// ============================================
function setupLabelFocus() {
  document.querySelectorAll(".contact-form .form-group").forEach((group) => {
    const field = group.querySelector("input, select, textarea");
    if (!field) return;

    const updateState = () => {
      const hasValue =
        field.value !== "" && field.value !== field.getAttribute("placeholder");
      group.classList.toggle("has-value", hasValue);
    };

    field.addEventListener("focus", () => group.classList.add("has-focus"));
    field.addEventListener("blur",  () => {
      group.classList.remove("has-focus");
      updateState();
    });
    field.addEventListener("input", updateState);

    // Revisar estado inicial (ej. autocompletado del navegador)
    updateState();
  });
}

// ============================================
// INICIALIZACIÓN — AÑADIR NUEVAS LLAMADAS
// ============================================

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
