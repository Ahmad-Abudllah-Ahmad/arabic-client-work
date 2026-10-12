/**
 * Al Hassan Coffee - Global Store Script & E-Commerce Engine
 * Features:
 * - Preloader & Particles
 * - Hero Slider (Sliding Window)
 * - Scroll Reveal & Stats Counter
 * - Live Product Catalog Filter & Search
 * - Product Details Modal
 * - Full E-Commerce Cart Engine (LocalStorage, Drawer, Badge)
 * - Checkout System with Shipping Companies & Rates
 * - Dummy Visa / Mastercard Payment Gateway (Interactive Card Preview & 1-Click Autofill)
 * - Cash on Delivery & Apple Pay options
 * - Order Confirmation Receipt Modal & WhatsApp Integration
 * - Mobile 100% Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  applySavedTheme();
  initPreloader();
  initNavbar();
  initParticles();
  initHeroSlider();
  initStatsCounter();
  initScrollReveal();
  initProductCatalog();
  initProductModal();
  initContactForm();
  initCartAndCheckout();
  initChatbot();
});

/* ===================================
   0. SAVED THEME (default palette)
   =================================== */
function applySavedTheme() {
  const savedTheme = localStorage.getItem('al_hassan_theme') || 'obsidian';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

/* ===================================
   1. PRELOADER
   =================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const hidePreloader = () => {
    preloader.classList.add('hidden');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 800);
  };

  window.addEventListener('load', hidePreloader);
  setTimeout(hidePreloader, 1800);
}

/* ===================================
   2. NAVBAR & MOBILE NAVIGATION
   =================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ===================================
   3. PARTICLES CANVAS (GOLD & EMERALD DUST)
   =================================== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();

  const particleCount = Math.min(45, Math.floor(window.innerWidth / 30));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
      isGold: Math.random() > 0.4
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.speedX;

      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.isGold
        ? `rgba(201, 168, 76, ${p.opacity})`
        : `rgba(218, 178, 102, ${p.opacity * 0.7})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.isGold ? 'rgba(201, 168, 76, 0.5)' : 'rgba(218, 178, 102, 0.4)';
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ===================================
   4. HERO SLIDER - BUTTERY SMOOTH
   =================================== */
function initHeroSlider() {
  const slider = document.getElementById('hero-slider');
  const slides = Array.from(document.querySelectorAll('.hero-slider .slide'));
  const dots   = Array.from(document.querySelectorAll('#slider-dots .dot'));
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');

  if (!slides.length || !slider) return;

  let current = 0;
  let animating = false;
  let slideInterval = null;
  const DURATION = 6500;
  const TRACK_EASE = 'transform 1.45s cubic-bezier(0.22, 1, 0.36, 1)';

  function setActive(index) {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(index, animate = true) {
    const next = ((index % slides.length) + slides.length) % slides.length;
    if (next === current && animate) return;
    if (animating && animate) return;

    animating = animate;
    current = next;
    setActive(current);

    slider.style.transition = animate ? TRACK_EASE : 'none';
    slider.style.transform = `translate3d(-${current * 100}%, 0, 0)`;

    if (animate) {
      setTimeout(() => { animating = false; }, 1500);
    } else {
      animating = false;
    }
  }

  setActive(0);
  goTo(0, false);

  function nextSlide() { goTo(current + 1); }
  function prevSlide() { goTo(current - 1); }

  function startAutoplay() {
    stopAutoplay();
    slideInterval = setInterval(nextSlide, DURATION);
  }
  function stopAutoplay() { if (slideInterval) clearInterval(slideInterval); }

  nextBtn && nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });
  prevBtn && prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });
  dots.forEach(dot => dot.addEventListener('click', () => {
    const idx = parseInt(dot.getAttribute('data-slide'), 10);
    goTo(idx);
    startAutoplay();
  }));

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoplay);
    heroSection.addEventListener('mouseleave', startAutoplay);
    let tx = 0;
    heroSection.addEventListener('touchstart', e => { tx = e.changedTouches[0].screenX; }, { passive: true });
    heroSection.addEventListener('touchend', e => {
      const diff = e.changedTouches[0].screenX - tx;
      if (Math.abs(diff) > 48) {
        diff < 0 ? nextSlide() : prevSlide();
        startAutoplay();
      }
    }, { passive: true });
  }

  startAutoplay();
}

/* ===================================
   5. STATS COUNTER ANIMATION
   =================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-num');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          let current = 0;
          const duration = 1600;
          const stepTime = 25;
          const increment = Math.ceil(target / (duration / stepTime));

          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            stat.textContent = current;
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-bar');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ===================================
   6. SCROLL REVEAL WITH BLUR EFFECT
   =================================== */
function initScrollReveal() {
  // Select all reveal elements including cards, grid items, and sections
  const targetSelectors = [
    '.reveal', '.reveal-left', '.reveal-right', '.reveal-blur',
    '.product-card', '.cat-card', '.category-full-card',
    '.testimonial-card', '.value-card', '.stat-item', '.partner-badge',
    '.insta-card'
  ];

  const allElements = document.querySelectorAll(targetSelectors.join(', '));
  if (!allElements.length) return;

  // Apply stagger delay to grid children
  const gridContainers = document.querySelectorAll('.products-grid, .categories-grid, .values-grid, .testimonials-grid, .insta-grid, .shipping-options-grid');
  gridContainers.forEach(container => {
    const children = container.children;
    Array.from(children).forEach((child, index) => {
      child.classList.add('reveal-blur');
      child.style.transitionDelay = `${(index % 4) * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  // Re-query in case classes were added
  document.querySelectorAll(targetSelectors.join(', ')).forEach(el => observer.observe(el));
}

/* ===================================
   7. PRODUCTS CATALOG (SEARCH & FILTER)
   =================================== */
function initProductCatalog() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('product-search');
  const clearBtn = document.getElementById('search-clear');
  const productCards = document.querySelectorAll('.product-card');
  const categorySections = document.querySelectorAll('.category-group');

  if (!filterBtns.length && !searchInput) return;

  let activeCategory = 'all';
  let searchTerm = '';

  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const matchingBtn = document.querySelector(`.filter-btn[data-category="${hash}"]`);
    if (matchingBtn) {
      filterBtns.forEach(btn => btn.classList.remove('active'));
      matchingBtn.classList.add('active');
      activeCategory = hash;
    }
  }

  function applyFilters() {
    let visibleCount = 0;

    productCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('p')?.textContent.toLowerCase() || '';

      const matchesCategory = (activeCategory === 'all' || cardCategory === activeCategory);
      const matchesSearch = (!searchTerm || title.includes(searchTerm) || desc.includes(searchTerm));

      if (matchesCategory && matchesSearch) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    categorySections.forEach(section => {
      const sectionCategory = section.getAttribute('data-category');
      const shouldShowSection = (activeCategory === 'all' || sectionCategory === activeCategory);
      const visibleCardsInSection = section.querySelectorAll('.product-card:not([style*="display: none"])').length;

      if (shouldShowSection && visibleCardsInSection > 0) {
        section.style.display = '';
      } else {
        section.style.display = 'none';
      }
    });

    const countBadge = document.getElementById('total-results-count');
    if (countBadge) {
      countBadge.textContent = `${visibleCount} صنف متوفر`;
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-category');
      applyFilters();

      const catalog = document.querySelector('.products-section');
      if (catalog && window.scrollY > catalog.offsetTop) {
        window.scrollTo({ top: catalog.offsetTop - 120, behavior: 'smooth' });
      }
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = searchTerm ? 'block' : 'none';
      }
      applyFilters();
    });
  }

  if (clearBtn && searchInput) {
    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchTerm = '';
      clearBtn.style.display = 'none';
      searchInput.focus();
      applyFilters();
    });
  }

  applyFilters();
}

/* ===================================
   8. PRODUCT DETAILS MODAL
   =================================== */
function initProductModal() {
  const modalOverlay = document.getElementById('product-modal');
  if (!modalOverlay) return;

  const modalClose = modalOverlay.querySelector('.modal-close');
  const modalEmoji = modalOverlay.querySelector('.modal-emoji');
  const modalCategory = modalOverlay.querySelector('.modal-category');
  const modalTitle = modalOverlay.querySelector('.modal-title');
  const modalDesc = modalOverlay.querySelector('.modal-desc');
  const modalWhatsapp = modalOverlay.querySelector('.btn-whatsapp-order');
  const modalAddToCartBtn = modalOverlay.querySelector('.modal-add-to-cart');
  const weightButtons = modalOverlay.querySelectorAll('.weight-btn');

  let selectedWeight = '500 جم';
  let currentProductTitle = '';
  let currentProductCategory = '';
  let currentProductPrice = 35;
  let currentProductEmoji = '✨';

  weightButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      weightButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedWeight = btn.getAttribute('data-weight') || btn.textContent.trim();
      updateWhatsappLink();
    });
  });

  function updateWhatsappLink() {
    if (!modalWhatsapp) return;
    const phone = '966500000000';
    const msg = encodeURIComponent(
      `مرحباً Al Hassan Coffee ☕\nأود الاستفسار والطلب:\n• المنتج: ${currentProductTitle}\n• التصنيف: ${currentProductCategory}\n• الوزن المطلوب: ${selectedWeight}\n• السعر التقريبي: ${currentProductPrice} ر.س\nيرجى تأكيد توفر المنتج وتفاصيل التوصيل. شكراً!`
    );
    modalWhatsapp.href = `https://wa.me/${phone}?text=${msg}`;
  }

  // Handle click on card for details, ignoring direct add-to-cart button
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn-add-cart')) return;

    const card = e.target.closest('.product-card');
    if (!card) return;

    const emoji = card.querySelector('.product-emoji')?.textContent || '✨';
    const title = card.querySelector('h4')?.textContent || '';
    const desc = card.querySelector('p')?.textContent || '';
    const categoryName = card.getAttribute('data-category-name') || 'صنف فاخر';
    const priceText = card.querySelector('.product-price')?.getAttribute('data-price') || '35';

    currentProductTitle = title;
    currentProductCategory = categoryName;
    currentProductEmoji = emoji;
    currentProductPrice = parseFloat(priceText) || 35;

    if (modalEmoji) modalEmoji.textContent = emoji;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;
    if (modalCategory) modalCategory.textContent = categoryName;

    weightButtons.forEach((b, idx) => b.classList.toggle('active', idx === 1));
    selectedWeight = '500 جم';

    updateWhatsappLink();

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  if (modalAddToCartBtn) {
    modalAddToCartBtn.addEventListener('click', () => {
      if (window.CartStore) {
        window.CartStore.addItem({
          id: `${currentProductTitle}-${selectedWeight}`,
          title: currentProductTitle,
          category: currentProductCategory,
          weight: selectedWeight,
          price: currentProductPrice,
          emoji: currentProductEmoji
        });
        closeModal();
      }
    });
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ===================================
   9. E-COMMERCE CART & CHECKOUT ENGINE
   =================================== */
function initCartAndCheckout() {
  const CART_STORAGE_KEY = 'al_hassan_cart_v1';

  // State
  let cart = [];
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) cart = JSON.parse(saved);
  } catch (err) {
    cart = [];
  }

  let selectedShipping = {
    name: 'أرامكس (Aramex)',
    price: 25,
    time: '1-3 أيام عمل'
  };

  let selectedPaymentMethod = 'visa'; // 'visa', 'cod', 'applepay'

  // DOM Elements
  const cartBackdrop = document.getElementById('cart-drawer-backdrop');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartShippingEl = document.getElementById('cart-shipping');
  const cartTotalEl = document.getElementById('cart-total');
  const navCartBtns = document.querySelectorAll('.nav-cart-btn, #mobile-cart-btn');
  const cartCloseBtn = document.getElementById('cart-close-btn');
  const cartCheckoutBtn = document.getElementById('cart-checkout-btn');
  const cartBadgeEls = document.querySelectorAll('.cart-badge, .mobile-cart-badge');

  // Checkout Elements
  const checkoutBackdrop = document.getElementById('checkout-modal-backdrop');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutCloseBtn = document.getElementById('checkout-close-btn');
  const checkoutForm = document.getElementById('checkout-form');
  const shippingRadios = document.querySelectorAll('input[name="shipping_method"]');
  const paymentTabBtns = document.querySelectorAll('.payment-tab-btn');
  const visaPaymentSection = document.getElementById('visa-payment-section');
  const codPaymentSection = document.getElementById('cod-payment-section');
  const applePaymentSection = document.getElementById('applepay-payment-section');
  const dummyAutofillBtn = document.getElementById('dummy-autofill-btn');
  const cardNumberInput = document.getElementById('card-number-input');
  const cardExpiryInput = document.getElementById('card-expiry-input');
  const cardCvvInput = document.getElementById('card-cvv-input');
  const cardHolderInput = document.getElementById('card-holder-input');
  const cardNumberPreview = document.getElementById('card-number-preview');
  const cardHolderPreview = document.getElementById('card-holder-preview');
  const cardExpiryPreview = document.getElementById('card-expiry-preview');
  const checkoutSummarySubtotal = document.getElementById('checkout-summary-subtotal');
  const checkoutSummaryShipping = document.getElementById('checkout-summary-shipping');
  const checkoutSummaryTotal = document.getElementById('checkout-summary-total');

  // Success Modal Elements
  const orderSuccessBackdrop = document.getElementById('order-success-backdrop');
  const orderSuccessCloseBtn = document.getElementById('order-success-close-btn');
  const successOrderId = document.getElementById('success-order-id');
  const successCustomerName = document.getElementById('success-customer-name');
  const successShippingCompany = document.getElementById('success-shipping-company');
  const successTotalPaid = document.getElementById('success-total-paid');
  const successPaymentMethod = document.getElementById('success-payment-method');
  const successWhatsappBtn = document.getElementById('success-whatsapp-btn');

  // Save Cart helper
  function saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {}
    updateBadges();
    renderCart();
  }

  // Update Cart Badges
  function updateBadges() {
    const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
    cartBadgeEls.forEach(badge => {
      badge.textContent = totalCount;
      badge.classList.add('bump');
      setTimeout(() => badge.classList.remove('bump'), 250);
    });
  }

  // Cart Calculations
  function getSubtotal() {
    return cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  function getTotal() {
    const subtotal = getSubtotal();
    return subtotal > 0 ? (subtotal + selectedShipping.price) : 0;
  }

  // Render Cart Items
  function renderCart() {
    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-icon">🛒</div>
          <h4>سلة مشترياتك فارغة</h4>
          <p style="font-size: 0.85rem; margin-top: 6px;">تصفح منتجاتنا وأضف قهوتك وبهاراتك المفضلة للسلة!</p>
          <a href="products.html" class="btn-primary" style="margin-top: 18px; display: inline-block; padding: 8px 20px; font-size: 0.88rem;">تسوق الآن</a>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = '0 ر.س';
      if (cartShippingEl) cartShippingEl.textContent = '0 ر.س';
      if (cartTotalEl) cartTotalEl.textContent = '0 ر.س';
      if (cartCheckoutBtn) cartCheckoutBtn.disabled = true;
      return;
    }

    if (cartCheckoutBtn) cartCheckoutBtn.disabled = false;

    cartItemsList.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-icon">${item.emoji || '✨'}</div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-weight">${item.weight || '500 جم'} - ${item.category || ''}</div>
          <div class="cart-item-price">${item.price * item.qty} ر.س</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
          <button class="cart-item-remove" data-action="remove" data-id="${item.id}" title="حذف">🗑️</button>
        </div>
      </div>
    `).join('');

    const subtotal = getSubtotal();
    const total = getTotal();

    if (cartSubtotalEl) cartSubtotalEl.textContent = `${subtotal} ر.س`;
    if (cartShippingEl) cartShippingEl.textContent = `${selectedShipping.price} ر.س (${selectedShipping.name})`;
    if (cartTotalEl) cartTotalEl.textContent = `${total} ر.س`;
  }

  // Handle Cart item quantity changes and deletion
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');
      const itemIndex = cart.findIndex(it => it.id === id);

      if (itemIndex === -1) return;

      if (action === 'increase') {
        cart[itemIndex].qty += 1;
        saveCart();
      } else if (action === 'decrease') {
        if (cart[itemIndex].qty > 1) {
          cart[itemIndex].qty -= 1;
        } else {
          cart.splice(itemIndex, 1);
        }
        saveCart();
      } else if (action === 'remove') {
        cart.splice(itemIndex, 1);
        saveCart();
        showToast('تمت إزالة المنتج من السلة');
      }
    });
  }

  // Cart Drawer open / close
  function openCart() {
    if (cartBackdrop && cartDrawer) {
      cartBackdrop.classList.add('active');
      cartDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
      renderCart();
    }
  }

  function closeCart() {
    if (cartBackdrop && cartDrawer) {
      cartBackdrop.classList.remove('active');
      cartDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  navCartBtns.forEach(btn => btn.addEventListener('click', openCart));
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', (e) => {
    if (e.target === cartBackdrop) closeCart();
  });

  // Global Cart Store exposed for other modules & add-to-cart buttons
  window.CartStore = {
    addItem: (item) => {
      const existing = cart.find(i => i.id === item.id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ ...item, qty: 1 });
      }
      saveCart();
      showToast(`تمت إضافة "${item.title}" إلى السلة 🛒`);
    },
    open: openCart,
    close: closeCart
  };

  // Direct "أضف للسلة" button clicks on cards
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.btn-add-cart');
    if (!addBtn) return;

    e.preventDefault();
    e.stopPropagation();

    const card = addBtn.closest('.product-card');
    if (!card) return;

    const title = card.querySelector('h4')?.textContent || 'منتج الحسن';
    const categoryName = card.getAttribute('data-category-name') || 'صنف فاخر';
    const emoji = card.querySelector('.product-emoji')?.textContent || '✨';
    const priceText = card.querySelector('.product-price')?.getAttribute('data-price') || '35';
    const price = parseFloat(priceText) || 35;

    window.CartStore.addItem({
      id: `${title}-500 جم`,
      title: title,
      category: categoryName,
      weight: '500 جم',
      price: price,
      emoji: emoji
    });
  });

  // Checkout modal handling
  function openCheckout() {
    if (cart.length === 0) {
      showToast('سلة المشتريات فارغة!');
      return;
    }
    closeCart();
    if (checkoutBackdrop && checkoutModal) {
      updateCheckoutSummary();
      checkoutBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCheckout() {
    if (checkoutBackdrop && checkoutModal) {
      checkoutBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (cartCheckoutBtn) cartCheckoutBtn.addEventListener('click', openCheckout);
  if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckout);
  if (checkoutBackdrop) checkoutBackdrop.addEventListener('click', (e) => {
    if (e.target === checkoutBackdrop) closeCheckout();
  });

  function updateCheckoutSummary() {
    const subtotal = getSubtotal();
    const total = getTotal();
    if (checkoutSummarySubtotal) checkoutSummarySubtotal.textContent = `${subtotal} ر.س`;
    if (checkoutSummaryShipping) checkoutSummaryShipping.textContent = `${selectedShipping.price} ر.س (${selectedShipping.name})`;
    if (checkoutSummaryTotal) checkoutSummaryTotal.textContent = `${total} ر.س`;
  }

  // Shipping selection change
  shippingRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.shipping-card').forEach(c => c.classList.remove('selected'));
      const card = e.target.closest('.shipping-card');
      if (card) card.classList.add('selected');

      const price = parseFloat(e.target.getAttribute('data-price')) || 25;
      const name = e.target.getAttribute('data-name') || 'شحن سريع';
      const time = e.target.getAttribute('data-time') || '1-3 أيام';

      selectedShipping = { name, price, time };
      updateCheckoutSummary();
      renderCart();
    });
  });

  // Payment tab switching
  paymentTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      paymentTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPaymentMethod = btn.getAttribute('data-method');

      if (visaPaymentSection) visaPaymentSection.style.display = (selectedPaymentMethod === 'visa') ? 'block' : 'none';
      if (codPaymentSection) codPaymentSection.style.display = (selectedPaymentMethod === 'cod') ? 'block' : 'none';
      if (applePaymentSection) applePaymentSection.style.display = (selectedPaymentMethod === 'applepay') ? 'block' : 'none';
    });
  });

  // Dummy credit card autofill & real-time input formatting
  if (dummyAutofillBtn) {
    dummyAutofillBtn.addEventListener('click', () => {
      if (cardNumberInput) cardNumberInput.value = '4242 8890 2026 4242';
      if (cardExpiryInput) cardExpiryInput.value = '12/28';
      if (cardCvvInput) cardCvvInput.value = '849';
      if (cardHolderInput) cardHolderInput.value = 'AHMAD ABDULLAH';

      if (cardNumberPreview) cardNumberPreview.textContent = '4242 •••• •••• 4242';
      if (cardHolderPreview) cardHolderPreview.textContent = 'AHMAD ABDULLAH';
      if (cardExpiryPreview) cardExpiryPreview.textContent = '12/28';

      showToast('تمت تعبئة بيانات بطاقة فيزا تجريبية بنجاح 💳');
    });
  }

  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
      e.target.value = formatted;
      if (cardNumberPreview) {
        cardNumberPreview.textContent = formatted || '•••• •••• •••• ••••';
      }
    });
  }

  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) {
        val = val.substring(0, 2) + '/' + val.substring(2, 4);
      }
      e.target.value = val;
      if (cardExpiryPreview) cardExpiryPreview.textContent = val || 'MM/YY';
    });
  }

  if (cardHolderInput) {
    cardHolderInput.addEventListener('input', (e) => {
      if (cardHolderPreview) cardHolderPreview.textContent = e.target.value.toUpperCase() || 'اسم حامل البطاقة';
    });
  }

  // Handle Checkout Form Submission (Process Dummy Order)
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const customerName = checkoutForm.querySelector('[name="customer_name"]')?.value || 'عميل Al Hassan';
      const customerPhone = checkoutForm.querySelector('[name="customer_phone"]')?.value || '';
      const customerCity = checkoutForm.querySelector('[name="customer_city"]')?.value || 'الرياض';
      const customerAddress = checkoutForm.querySelector('[name="customer_address"]')?.value || '';

      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>جاري معالجة الدفع والطلب...</span> <span class="spinner" style="display:inline-block; animation: spin 1s infinite linear;">⏳</span>`;
      }

      // Simulate payment processing
      setTimeout(() => {
        const orderNum = 'HC-' + Math.floor(10000 + Math.random() * 90000);
        const orderTotal = getTotal();

        let paymentLabel = 'دفع عند الاستلام (COD)';
        if (selectedPaymentMethod === 'visa') paymentLabel = 'بطاقة فيزا تجريبية (مدفوع)';
        if (selectedPaymentMethod === 'applepay') paymentLabel = 'Apple Pay / مدى (مدفوع)';

        // Populate Success Modal
        if (successOrderId) successOrderId.textContent = `رقم الطلب: #${orderNum}`;
        if (successCustomerName) successCustomerName.textContent = customerName;
        if (successShippingCompany) successShippingCompany.textContent = `${selectedShipping.name} (${customerCity})`;
        if (successTotalPaid) successTotalPaid.textContent = `${orderTotal} ر.س`;
        if (successPaymentMethod) successPaymentMethod.textContent = paymentLabel;

        // WhatsApp Order Confirmation link
        if (successWhatsappBtn) {
          const itemsSummary = cart.map(i => `• ${i.title} (${i.qty}x) = ${i.price * i.qty} ر.س`).join('\n');
          const waMessage = encodeURIComponent(
            `*تأكيد طلب جديد من متجر Al Hassan Coffee*\n` +
            `رقم الطلب: #${orderNum}\n` +
            `الاسم: ${customerName}\n` +
            `الهاتف: ${customerPhone}\n` +
            `المدينة والعنوان: ${customerCity} - ${customerAddress}\n` +
            `طريقة الشحن: ${selectedShipping.name}\n` +
            `طريقة الدفع: ${paymentLabel}\n\n` +
            `*المنتجات:*\n${itemsSummary}\n\n` +
            `*المجموع الكلي: ${orderTotal} ر.س*\n` +
            `يرجى تأكيد التجهيز والشحن!`
          );
          successWhatsappBtn.href = `https://wa.me/966500000000?text=${waMessage}`;
        }

        // Clear cart
        cart = [];
        saveCart();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }

        closeCheckout();

        // Open Success Modal
        if (orderSuccessBackdrop) {
          orderSuccessBackdrop.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }, 1400);
    });
  }

  if (orderSuccessCloseBtn) {
    orderSuccessCloseBtn.addEventListener('click', () => {
      if (orderSuccessBackdrop) orderSuccessBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Initial render
  updateBadges();
  renderCart();
}

/* ===================================
   10. CONTACT FORM & TOAST
   =================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';

    if (submitBtn) {
      submitBtn.textContent = 'جاري الإرسال...';
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      contactForm.reset();
      if (submitBtn) {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
      showToast('شكراً لتواصلك! تم استلام رسالتك وسيتواصل معك فريق Al Hassan Coffee بأسرع وقت.');
    }, 800);
  });
}

// Global Toast helper
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4200);
}

/* ===================================
   AI CHATBOT ENGINE
   =================================== */
function initChatbot() {
  const fab        = document.getElementById('chatbot-fab');
  const win        = document.getElementById('chatbot-window');
  const overlay    = document.getElementById('chatbot-overlay');
  const closeBtn   = document.getElementById('chat-close-btn');
  const fsBtn      = document.getElementById('chat-fullscreen-btn');
  const input      = document.getElementById('chat-input');
  const sendBtn    = document.getElementById('chat-send-btn');
  const msgsEl     = document.getElementById('chat-messages');
  const qrEl       = document.getElementById('quick-replies');

  if (!fab || !win) return;

  let isOpen = false;
  let isFullscreen = false;

  /* ---- Knowledge Base ---- */
  const KB = [
    { k: ['قهوة','coffee','بن','عربية','هيل','كيف'], reply: 'قهوتنا العربية الأصيلة متوفرة بمزيج الهيل والزعفران والقرنفل. 🫘 يمكنك الطلب مباشرة من <a href="products.html#coffee" style="color:#e8c97a">صفحة المنتجات</a> أو عبر واتساب!', quick: ['أسعار القهوة', 'طريقة الطلب', 'التوصيل'] },
    { k: ['بهارات','بهار','spice','كبسة','مندي','مشوي','طحون'], reply: 'لدينا أكثر من 90 صنفاً من البهارات الشرقية! 🌶️ بهارات كبسة، مندي، مشويات، مجبوس وغيرها – كلها مطحونة على البارد للحفاظ على النكهة.', quick: ['أسعار البهارات', 'بهارات الكبسة', 'طريقة الطلب'] },
    { k: ['عسل','honey','دوعني','طلح','بري','سدر'], reply: 'عسلنا طبيعي 100% من خلايا جبلية نقية 🍯 يشمل: عسل سدر، دوعني، طلح، وعسل بري نادر. كل قطعة معتمدة الجودة.', quick: ['أسعار العسل', 'أنواع العسل', 'التوصيل'] },
    { k: ['أعشاب','عشب','herb','زهور','شاي','بابونج','يانسون'], reply: 'مجموعتنا من الأعشاب تضم أكثر من 20 نوعاً طبيعياً 🌿 منها: بابونج، نعناع، يانسون، زعتر، ولافندر. مثالية للشاي والعلاج الطبيعي!', quick: ['أسعار الأعشاب', 'أنواع الأعشاب', 'طريقة الطلب'] },
    { k: ['مكسرات','nuts','لوز','كاجو','فستق','جوز'], reply: 'مكسراتنا طازجة ومحمصة يومياً 🥜 لوز، كاجو، فستق، جوز، بندق والمزيد – متوفرة بوزن 250 جم حتى 5 كجم.', quick: ['أسعار المكسرات', 'أنواع المكسرات', 'طريقة الطلب'] },
    { k: ['توصيل','شحن','ارامكس','سمسا','وصول','متى'], reply: 'نوصّل عبر أرامكس وسمسا لجميع مناطق المملكة 🚚 خلال 1-3 أيام عمل. يمكنك أيضاً الاستلام من المخازن الذكية RedBox 24/7!', quick: ['أسعار الشحن', 'تتبع الطلب', 'تواصل معنا'] },
    { k: ['دفع','فيزا','مدى','كاش','عند الاستلام','سداد','visa'], reply: 'نقبل جميع طرق الدفع 💳 فيزا، مدى، Apple Pay، وكاش عند الاستلام (COD). الدفع آمن ومشفر 100%.', quick: ['إتمام الطلب', 'سياسة الإرجاع', 'تواصل معنا'] },
    { k: ['سعر','كم','price','تكلف','غالي','رخيص'], reply: 'أسعارنا تنافسية جداً مقارنة بالجودة الفاخرة 🌟 يبدأ السعر من 15 ريال. تفضّل بزيارة <a href="products.html" style="color:#e8c97a">صفحة المنتجات</a> للاطلاع على الأسعار التفصيلية.', quick: ['منتجات تحت 50 ريال', 'عروض خاصة', 'التواصل'] },
    { k: ['واتساب','whatsapp','تواصل','اتصال','رقم','هاتف'], reply: 'يسعدنا خدمتك عبر واتساب مباشرة! 💬 <a href="https://wa.me/966500000000" target="_blank" style="color:#4ade80">اضغط هنا للتواصل معنا على واتساب</a>', quick: ['أسعار المنتجات', 'التوصيل', 'الرئيسية'] },
    { k: ['انستغرام','instagram','تيك','social','سوشيال'], reply: 'تابعنا على انستغرام @alhassancoffee 📸 لمشاهدة أحدث المنتجات والعروض الحصرية والوصفات الفاخرة!', quick: ['منتجاتنا', 'عروض خاصة', 'تواصل معنا'] },
    { k: ['إرجاع','استرداد','مشكلة','خاطئ','تالف'], reply: 'نضمن رضاكم التام! ✅ في حال وجود أي مشكلة في المنتج، يرجى التواصل معنا خلال 48 ساعة وسنستبدل المنتج فوراً أو نرد المبلغ كاملاً.', quick: ['التواصل معنا', 'واتساب', 'صفحة المنتجات'] },
    { k: ['جملة','wholesale','كميات','كبيرة','تجاري'], reply: 'نوفر أسعاراً خاصة لطلبات الجملة والكميات التجارية الكبيرة 📦 يرجى التواصل معنا مباشرة عبر واتساب للحصول على عرض سعر مخصص.', quick: ['تواصل معنا', 'واتساب', 'المنتجات'] },
  ];

  const QUICK_START = ['أسعار المنتجات', 'طريقة الطلب', 'التوصيل والشحن', 'أنواع العسل', 'البهارات المتوفرة', 'تواصل واتساب'];

  const QUICK_MAP = {
    'أسعار المنتجات':    'ما هي أسعار المنتجات؟',
    'طريقة الطلب':       'كيف أطلب؟',
    'التوصيل والشحن':    'ما هي خيارات التوصيل؟',
    'أنواع العسل':        'ما أنواع العسل لديكم؟',
    'البهارات المتوفرة':  'ما البهارات المتوفرة؟',
    'تواصل واتساب':      'كيف أتواصل معكم عبر واتساب؟',
    'أسعار القهوة':       'ما أسعار القهوة؟',
    'أسعار البهارات':     'ما أسعار البهارات؟',
    'بهارات الكبسة':      'ما بهارات الكبسة المتوفرة؟',
    'أسعار العسل':        'ما أسعار العسل؟',
    'أسعار الأعشاب':     'ما أسعار الأعشاب؟',
    'أنواع الأعشاب':     'ما أنواع الأعشاب؟',
    'أسعار المكسرات':    'ما أسعار المكسرات؟',
    'أنواع المكسرات':    'ما أنواع المكسرات؟',
    'أسعار الشحن':       'كم تكلفة الشحن؟',
    'تتبع الطلب':        'كيف أتتبع طلبي؟',
    'تواصل معنا':        'كيف أتواصل معكم؟',
    'إتمام الطلب':       'كيف أتم طلبي؟',
    'سياسة الإرجاع':    'ما سياسة الإرجاع؟',
    'واتساب':            'كيف أتواصل عبر واتساب؟',
    'صفحة المنتجات':     'أريد مشاهدة المنتجات',
    'منتجاتنا':          'أريد مشاهدة المنتجات',
    'عروض خاصة':         'هل لديكم عروض خاصة؟',
    'الرئيسية':          'الصفحة الرئيسية',
    'منتجات تحت 50 ريال': 'ما المنتجات المتوفرة تحت 50 ريال؟',
    'أنواع القهوة':      'ما أنواع القهوة لديكم؟',
    'طريقة الطلب':       'كيف أطلب؟',
  };

  function getReply(msg) {
    const lower = msg.toLowerCase();
    for (const item of KB) {
      if (item.k.some(k => lower.includes(k))) {
        return item;
      }
    }
    return {
      reply: 'شكراً على سؤالك! 😊 يمكنك تصفح <a href="products.html" style="color:#e8c97a">صفحة المنتجات</a> أو التواصل مع فريقنا عبر <a href="https://wa.me/966500000000" target="_blank" style="color:#4ade80">واتساب</a> للحصول على مساعدة مباشرة.',
      quick: ['أسعار المنتجات', 'التوصيل والشحن', 'تواصل واتساب']
    };
  }

  function now() {
    return new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  }

  function addMsg(type, html) {
    const div = document.createElement('div');
    div.className = `chat-msg ${type}`;
    const isBot = type === 'bot';
    div.innerHTML = `
      <div class="msg-avatar">${isBot ? '🤖' : '👤'}</div>
      <div>
        <div class="msg-bubble">${html}</div>
        <div class="msg-time">${now()}</div>
      </div>`;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function showQuickReplies(list) {
    qrEl.innerHTML = '';
    list.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        const mapped = QUICK_MAP[label] || label;
        addMsg('user', label);
        qrEl.innerHTML = '';
        simulateReply(mapped);
      });
      qrEl.appendChild(btn);
    });
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'chat-msg bot';
    el.id = 'typing-indicator';
    el.innerHTML = `<div class="msg-avatar">🤖</div><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
    msgsEl.appendChild(el);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return el;
  }

  function simulateReply(userMsg) {
    const typing = showTyping();
    const { reply, quick } = getReply(userMsg);
    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      typing.remove();
      addMsg('bot', reply);
      if (quick && quick.length) showQuickReplies(quick);
    }, delay);
  }

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    addMsg('user', text);
    input.value = '';
    input.style.height = 'auto';
    qrEl.innerHTML = '';
    simulateReply(text);
  }

  function openChat() {
    isOpen = true;
    win.classList.add('active');
    overlay.classList.add('active');
    // Remove badge
    const badge = fab.querySelector('.fab-badge');
    if (badge) badge.style.display = 'none';
    setTimeout(() => input && input.focus(), 400);
  }

  function closeChat() {
    isOpen = false;
    win.classList.remove('active');
    overlay.classList.remove('active');
    win.classList.remove('fullscreen');
    isFullscreen = false;
  }

  function toggleFullscreen() {
    isFullscreen = !isFullscreen;
    win.classList.toggle('fullscreen', isFullscreen);
    fsBtn.textContent = isFullscreen ? '⊡' : '⛶';
  }

  fab.addEventListener('click', () => isOpen ? closeChat() : openChat());
  overlay.addEventListener('click', closeChat);
  closeBtn && closeBtn.addEventListener('click', closeChat);
  fsBtn && fsBtn.addEventListener('click', toggleFullscreen);

  document.getElementById('nav-chat-btn')?.addEventListener('click', () => openChat());
  document.getElementById('mobile-chat-btn')?.addEventListener('click', () => openChat());

  window.AlHassanChat = {
    open: openChat,
    close: closeChat,
    toggle: () => (isOpen ? closeChat() : openChat())
  };

  sendBtn && sendBtn.addEventListener('click', sendMessage);
  input && input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  input && input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  // Welcome message
  setTimeout(() => {
    addMsg('bot', 'أهلاً وسهلاً! 👋 أنا مساعد <strong>Al Hassan Coffee</strong> الذكي.<br>يمكنني مساعدتك في معرفة المنتجات، الأسعار، التوصيل وأكثر. بماذا يمكنني خدمتك؟');
    showQuickReplies(QUICK_START);
  }, 300);
}

