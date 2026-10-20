/**
 * YẾN SÀO HUVATRA - CORE APPLICATION LOGIC
 * Showroom: 164 Nguyễn Công Trứ, Cam Ranh, Khánh Hòa | Hotline: 0974002626
 */

(function () {
  'use strict';

  // State Management
  let productsData = [];
  let currentCategory = 'all';
  let cart = JSON.parse(localStorage.getItem('huvatra_cart')) || [];
  let dosageData = {};

  // DOM Elements
  const productsGrid = document.getElementById('productsGrid');
  const filterTabsContainer = document.getElementById('filterTabs');
  const cartBadgeCount = document.getElementById('cartBadgeCount');
  const btnHeaderCart = document.getElementById('btnHeaderCart');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const btnCloseCart = document.getElementById('btnCloseCart');
  const cartDrawerItems = document.getElementById('cartDrawerItems');
  const cartTotalPrice = document.getElementById('cartTotalPrice');
  const btnCheckoutZalo = document.getElementById('btnCheckoutZalo');
  const btnCheckoutCall = document.getElementById('btnCheckoutCall');

  // Quick View Modal
  const quickViewModal = document.getElementById('quickViewModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const modalImg = document.getElementById('modalImg');
  const modalBadge = document.getElementById('modalBadge');
  const modalCategory = document.getElementById('modalCategory');
  const modalName = document.getElementById('modalName');
  const modalPrice = document.getElementById('modalPrice');
  const modalOldPrice = document.getElementById('modalOldPrice');
  const modalUnit = document.getElementById('modalUnit');
  const modalDesc = document.getElementById('modalDesc');
  const modalGifts = document.getElementById('modalGifts');
  const modalBtnAddCart = document.getElementById('modalBtnAddCart');
  const modalBtnBuyZalo = document.getElementById('modalBtnBuyZalo');

  // Lightbox
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const btnCloseLightbox = document.getElementById('btnCloseLightbox');

  // Dosage Calculator
  const calcTargetButtons = document.querySelectorAll('.calc-target-btn');
  const calcResultTitle = document.getElementById('calcResultTitle');
  const calcDosageVal = document.getElementById('calcDosageVal');
  const calcFreqVal = document.getElementById('calcFreqVal');
  const calcBenefitsText = document.getElementById('calcBenefitsText');
  const calcRecomText = document.getElementById('calcRecomText');
  const calcBtnConsult = document.getElementById('calcBtnConsult');

  // Format Currency
  function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  // Load Data
  async function initApp() {
    try {
      const [resProd, resKb] = await Promise.all([
        fetch('data/products.json'),
        fetch('data/knowledge-base.json')
      ]);

      if (resProd.ok) {
        productsData = await resProd.json();
        renderProducts();
      }

      if (resKb.ok) {
        const kb = await resKb.json();
        dosageData = kb.dosageGuide || {};
      }
    } catch (e) {
      console.error('Lỗi khi tải dữ liệu sản phẩm / tri thức:', e);
    }

    updateCartUI();
    bindEvents();
  }

  // Render Products
  function renderProducts() {
    if (!productsGrid) return;

    const filtered = currentCategory === 'all'
      ? productsData
      : productsData.filter(p => p.category === currentCategory);

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-muted);">
          <p>Hiện chưa có sản phẩm trong danh mục này.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(prod => `
      <article class="product-card" data-id="${prod.id}">
        <div class="product-thumb-box">
          <img src="${prod.image}" alt="${prod.name}" loading="lazy">
          <span class="product-badge-flag">${prod.badge}</span>
          <button class="product-quick-view-btn" data-id="${prod.id}" title="Xem chi tiết nhanh">👁️</button>
        </div>
        <div class="product-info-box">
          <span class="product-cat-tag">${prod.categoryName}</span>
          <h3 class="product-name">${prod.name}</h3>
          <p class="product-highlight">${prod.highlight}</p>
          <div class="product-price-row">
            <span class="product-current-price">${formatMoney(prod.price)}</span>
            ${prod.originalPrice ? `<span class="product-old-price">${formatMoney(prod.originalPrice)}</span>` : ''}
            <span class="product-unit-text">${prod.unit}</span>
          </div>
          <div class="product-card-actions">
            <button class="btn-add-cart" data-id="${prod.id}">
              <span>🛒</span> Thêm giỏ
            </button>
            <button class="btn-buy-now" data-id="${prod.id}">Mua ngay</button>
          </div>
        </div>
      </article>
    `).join('');
  }

  // Cart Management
  function saveCart() {
    localStorage.setItem('huvatra_cart', JSON.stringify(cart));
    updateCartUI();
  }

  function addToCart(productId, qty = 1) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].qty += qty;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        qty: qty
      });
    }

    saveCart();
    openCartDrawer();
  }

  function updateItemQty(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    saveCart();
  }

  function removeItem(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
  }

  function updateCartUI() {
    // Count Badge
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    if (cartBadgeCount) {
      cartBadgeCount.textContent = totalCount;
      cartBadgeCount.style.display = totalCount > 0 ? 'flex' : 'none';
    }

    // Drawer Items
    if (!cartDrawerItems) return;

    if (cart.length === 0) {
      cartDrawerItems.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">🪺</div>
          <h4>Giỏ hàng của bạn đang trống</h4>
          <p style="font-size: 0.88rem; margin-top: 6px;">Hãy lựa chọn những tổ yến thượng hạng để chăm sóc sức khỏe!</p>
        </div>
      `;
      if (cartTotalPrice) cartTotalPrice.textContent = '0 ₫';
      return;
    }

    let totalPrice = 0;
    cartDrawerItems.innerHTML = cart.map(item => {
      const lineTotal = item.price * item.qty;
      totalPrice += lineTotal;
      return `
        <div class="cart-item-row" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.name}</h4>
            <div class="cart-item-price">${formatMoney(item.price)}</div>
            <div class="cart-qty-ctrl">
              <button class="cart-qty-btn btn-qty-minus" data-id="${item.id}">-</button>
              <span class="cart-qty-num">${item.qty}</span>
              <button class="cart-qty-btn btn-qty-plus" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" title="Xóa khỏi giỏ">&times;</button>
        </div>
      `;
    }).join('');

    if (cartTotalPrice) {
      cartTotalPrice.textContent = formatMoney(totalPrice);
    }
  }

  function openCartDrawer() {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.add('active');
  }

  function closeCartDrawer() {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.remove('active');
  }

  // Quick View Modal
  let activeModalProductId = null;

  function openQuickView(productId) {
    const prod = productsData.find(p => p.id === productId);
    if (!prod) return;

    activeModalProductId = productId;
    if (modalImg) modalImg.src = prod.image;
    if (modalBadge) modalBadge.textContent = prod.badge;
    if (modalCategory) modalCategory.textContent = prod.categoryName;
    if (modalName) modalName.textContent = prod.name;
    if (modalPrice) modalPrice.textContent = formatMoney(prod.price);
    if (modalOldPrice) {
      modalOldPrice.textContent = prod.originalPrice ? formatMoney(prod.originalPrice) : '';
      modalOldPrice.style.display = prod.originalPrice ? 'inline' : 'none';
    }
    if (modalUnit) modalUnit.textContent = `Quy cách: ${prod.unit} • Xuất xứ: ${prod.origin}`;
    if (modalDesc) modalDesc.textContent = prod.description;
    if (modalGifts) modalGifts.innerHTML = `<strong>🎁 Quà tặng kèm:</strong> ${prod.gifts}`;

    if (quickViewModal) quickViewModal.classList.add('active');
  }

  function closeQuickView() {
    if (quickViewModal) quickViewModal.classList.remove('active');
    activeModalProductId = null;
  }

  // Checkout via Zalo / Phone
  function handleCheckoutZalo() {
    if (cart.length === 0) {
      alert('Giỏ hàng trống! Quý khách vui lòng chọn sản phẩm trước khi đặt hàng ạ.');
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    let message = `Dạ Yến Sào Huvatra ơi, tôi muốn đặt mua đơn hàng này tại Showroom 164 Nguyễn Công Trứ, Cam Ranh:\n`;
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.unit}) x ${item.qty} = ${formatMoney(item.price * item.qty)}\n`;
    });
    message += `👉 Tổng giá trị: ${formatMoney(total)}\n`;
    message += `Xin tư vấn và hướng dẫn nhận hàng giúp tôi. Xin cảm ơn!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://zalo.me/0974002626?text=${encoded}`, '_blank');
  }

  // Dosage Calculator Logic
  function handleCalculatorChange(targetKey) {
    const info = dosageData[targetKey];
    if (!info) return;

    calcTargetButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-target') === targetKey);
    });

    if (calcResultTitle) calcResultTitle.textContent = info.label;
    if (calcDosageVal) calcDosageVal.textContent = info.dosage;
    if (calcFreqVal) calcFreqVal.textContent = info.frequency;
    if (calcBenefitsText) calcBenefitsText.textContent = info.benefits;
    if (calcRecomText) calcRecomText.innerHTML = `<strong>Khuyên dùng:</strong> ${info.recommended}`;
  }

  // Lightbox View
  function openLightbox(src, caption) {
    if (lightboxImg) lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = caption || 'Yến Sào Huvatra - 164 Nguyễn Công Trứ, Cam Ranh';
    if (lightboxOverlay) lightboxOverlay.classList.add('active');
  }

  function closeLightbox() {
    if (lightboxOverlay) lightboxOverlay.classList.remove('active');
  }

  // Event Listeners
  function bindEvents() {
    // Filter Tabs
    if (filterTabsContainer) {
      filterTabsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-tab-btn');
        if (!btn) return;
        document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        renderProducts();
      });
    }

    // Products Grid Click (Add to cart, Quick View, Buy Now)
    if (productsGrid) {
      productsGrid.addEventListener('click', (e) => {
        const btnAdd = e.target.closest('.btn-add-cart');
        const btnQuick = e.target.closest('.product-quick-view-btn');
        const btnBuy = e.target.closest('.btn-buy-now');

        if (btnAdd) {
          const id = btnAdd.getAttribute('data-id');
          addToCart(id, 1);
        } else if (btnQuick) {
          const id = btnQuick.getAttribute('data-id');
          openQuickView(id);
        } else if (btnBuy) {
          const id = btnBuy.getAttribute('data-id');
          addToCart(id, 1);
        }
      });
    }

    // Cart Drawer Controls
    if (btnHeaderCart) btnHeaderCart.addEventListener('click', openCartDrawer);
    if (btnCloseCart) btnCloseCart.addEventListener('click', closeCartDrawer);
    if (cartDrawerOverlay) {
      cartDrawerOverlay.addEventListener('click', (e) => {
        if (e.target === cartDrawerOverlay) closeCartDrawer();
      });
    }

    // Cart Quantity Buttons & Remove
    if (cartDrawerItems) {
      cartDrawerItems.addEventListener('click', (e) => {
        const btnMinus = e.target.closest('.btn-qty-minus');
        const btnPlus = e.target.closest('.btn-qty-plus');
        const btnRemove = e.target.closest('.cart-item-remove');

        if (btnMinus) {
          updateItemQty(btnMinus.getAttribute('data-id'), -1);
        } else if (btnPlus) {
          updateItemQty(btnPlus.getAttribute('data-id'), 1);
        } else if (btnRemove) {
          removeItem(btnRemove.getAttribute('data-id'));
        }
      });
    }

    if (btnCheckoutZalo) btnCheckoutZalo.addEventListener('click', handleCheckoutZalo);
    if (btnCheckoutCall) {
      btnCheckoutCall.addEventListener('click', () => {
        window.location.href = 'tel:0974002626';
      });
    }

    // Modal Events
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeQuickView);
    if (quickViewModal) {
      quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal) closeQuickView();
      });
    }
    if (modalBtnAddCart) {
      modalBtnAddCart.addEventListener('click', () => {
        if (activeModalProductId) {
          addToCart(activeModalProductId, 1);
          closeQuickView();
        }
      });
    }
    if (modalBtnBuyZalo) {
      modalBtnBuyZalo.addEventListener('click', () => {
        if (activeModalProductId) {
          addToCart(activeModalProductId, 1);
          closeQuickView();
          handleCheckoutZalo();
        }
      });
    }

    // Calculator buttons
    calcTargetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        handleCalculatorChange(target);
      });
    });

    if (calcBtnConsult) {
      calcBtnConsult.addEventListener('click', () => {
        const activeBtn = document.querySelector('.calc-target-btn.active');
        const targetName = activeBtn ? activeBtn.querySelector('.calc-target-name').textContent : 'Tôi';
        const trigger = document.createElement('div');
        trigger.className = 'trigger-brand-chat';
        trigger.setAttribute('data-prompt', `Tư vấn chi tiết khẩu phần dùng yến sào cho ${targetName} giúp tôi`);
        document.body.appendChild(trigger);
        trigger.click();
        trigger.remove();
      });
    }

    // Facility Cards Click (Lightbox)
    document.querySelectorAll('.facility-card').forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        const title = card.querySelector('.facility-title');
        if (img) {
          openLightbox(img.src, title ? title.textContent : '');
        }
      });
    });

    if (btnCloseLightbox) btnCloseLightbox.addEventListener('click', closeLightbox);
    if (lightboxOverlay) {
      lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) closeLightbox();
      });
    }

    // Header sticky shadow on scroll
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header-nav');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 40);
      }
    });

    // Mobile Navigation Toggle
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    if (mobileNavToggle && navMenu) {
      mobileNavToggle.addEventListener('click', () => {
        const isOpen = navMenu.style.display === 'flex';
        navMenu.style.display = isOpen ? 'none' : 'flex';
        if (!isOpen) {
          navMenu.style.flexDirection = 'column';
          navMenu.style.position = 'absolute';
          navMenu.style.top = '100%';
          navMenu.style.left = '0';
          navMenu.style.right = '0';
          navMenu.style.background = '#ffffff';
          navMenu.style.padding = '20px';
          navMenu.style.boxShadow = 'var(--shadow-md)';
          navMenu.style.borderBottom = '1px solid var(--border-gold)';
        }
      });
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
