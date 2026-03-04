  (function () {
    const preloader = document.getElementById('preloader');
    const bar = document.getElementById('preloaderBar');
    if (!preloader || !bar) return;

    let width = 0;
    const tick = setInterval(() => {
      const step = width < 60 ? 3 : width < 85 ? 1 : 0.4;
      width = Math.min(width + step, 90);
      bar.style.width = width + '%';
    }, 60);

    window.addEventListener('load', () => {
      clearInterval(tick);
      bar.style.transition = 'width 0.4s ease';
      bar.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => preloader.remove(), 800);
      }, 450);
    });
  })();

  const mobileToggle = document.getElementById('mobileToggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      document.getElementById('mainNav').classList.toggle('open');
    });
  }

  document.querySelectorAll('.has-dropdown > a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 1024) {
        e.preventDefault();
        this.parentElement.classList.toggle('active');
        const dropdown = this.nextElementSibling;
        if (dropdown) {
          dropdown.style.display = this.parentElement.classList.contains('active') ? 'block' : 'none';
        }
      }
    });
  });


  (function() {
    const categoryLinks = document.querySelectorAll('.filter-category');
    const priceRange = document.getElementById('priceRange');
    const priceValue = document.getElementById('priceValue');
    const resultsCount = document.getElementById('resultsCount');
    const sortSelect = document.getElementById('sortSelect');
    const productGrid = document.querySelector('.products-grid.shop-grid');
    
    if (!productGrid) return;
    
    let products = Array.from(document.querySelectorAll('.product-card'));
    let currentCategory = 'all';
    let currentPrice = priceRange ? parseInt(priceRange.value) : 1500;

    function filterAndSort() {
      let visibleCount = 0;
      products.forEach(product => {
        const category = product.dataset.category;
        const price = parseInt(product.dataset.price);
        
        const categoryMatch = currentCategory === 'all' || category === currentCategory;
        const priceMatch = price <= currentPrice;

        if (categoryMatch && priceMatch) {
          product.style.display = 'block';
          visibleCount++;
        } else {
          product.style.display = 'none';
        }
      });

      const sortValue = sortSelect ? sortSelect.value : 'default';
      
      const sortedProducts = [...products].sort((a, b) => {
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);
        
        if (sortValue === 'price-low') return priceA - priceB;
        if (sortValue === 'price-high') return priceB - priceA;
        return 0; 
      });

      productGrid.innerHTML = '';
      sortedProducts.forEach(p => productGrid.appendChild(p));

      if (resultsCount) {
        resultsCount.textContent = `Showing 1–${visibleCount} of ${visibleCount} results`;
      }
    }

    categoryLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        categoryLinks.forEach(l => {
          l.classList.remove('active');
          l.style.color = 'var(--text-mid)';
          l.style.fontWeight = '400';
        });
        this.classList.add('active');
        this.style.color = 'var(--primary)';
        this.style.fontWeight = '700';

        currentCategory = this.dataset.category;
        filterAndSort();
      });
    });

    if (priceRange) {
      priceRange.addEventListener('input', function() {
        currentPrice = parseInt(this.value);
        if (priceValue) priceValue.textContent = `₹${currentPrice}`;
        filterAndSort();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', filterAndSort);
    }

    filterAndSort();
  })();

  const scrollBtn = document.getElementById('scroll-top');
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle('show', window.scrollY > 400);
    });
    scrollBtn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
  }

  (function() {
    const sliderNext = document.getElementById('sliderNext');
    const sliderPrev = document.getElementById('sliderPrev');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!sliderNext || !sliderPrev || !slides.length) return;
    
    let current = 0, timer;

    function goTo(n) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    function autoPlay() { timer = setInterval(() => goTo(current + 1), 5000); }
    function reset() { clearInterval(timer); autoPlay(); }

    sliderNext.addEventListener('click', () => { goTo(current+1); reset(); });
    sliderPrev.addEventListener('click', () => { goTo(current-1); reset(); });
    dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.slide); reset(); }));
    autoPlay();
  })();

  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
      this.classList.toggle('open');
    });
  }

  (function() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!revealEls.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  })();

  (function() {
    const stats = document.querySelectorAll('.stat-num[data-target]');
    if (!stats.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '';
        let start = 0;
        const step = target / 60;
        const interval = setInterval(() => {
          start += step;
          if (start >= target) { el.textContent = target + suffix; clearInterval(interval); }
          else { el.textContent = Math.floor(start) + suffix; }
        }, 20);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    stats.forEach(el => observer.observe(el));
  })();

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.qty-btn');
    if (!btn) return;

    const qtyWrap = btn.closest('.qty-control');
    const qtyNum = qtyWrap.querySelector('.qty-num');
    const decBtn = qtyWrap.querySelector('.qty-dec');
    let currentQty = parseInt(qtyNum.textContent);

    if (btn.classList.contains('qty-inc')) {
      currentQty++;
    } else if (btn.classList.contains('qty-dec') && currentQty > 1) {
      currentQty--;
    }

    qtyNum.textContent = currentQty;
    decBtn.disabled = currentQty <= 1;

    qtyNum.classList.remove('bump');
    void qtyNum.offsetWidth; 
    qtyNum.classList.add('bump');
  });

  const CartManager = {
    getCart() {
      return JSON.parse(localStorage.getItem('stackly_cart')) || [];
    },
    saveCart(cart) {
      localStorage.setItem('stackly_cart', JSON.stringify(cart));
      this.updateBadge();
    },
    addItem(item, qty = 1) {
      const cart = this.getCart();
      const existing = cart.find(i => i.id === item.id);
      if (existing) {
        existing.qty += parseInt(qty);
      } else {
        item.qty = parseInt(qty);
        cart.push(item);
      }
      this.saveCart(cart);
    },
    removeItem(id) {
      const cart = this.getCart().filter(i => i.id !== id);
      this.saveCart(cart);
    },
    updateQuantity(id, newQty) {
      const cart = this.getCart();
      const existing = cart.find(i => i.id === id);
      if (existing) {
        existing.qty = Math.max(1, parseInt(newQty));
        this.saveCart(cart);
      }
    },
    updateBadge() {
      const cart = this.getCart();
      const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
      document.querySelectorAll('.cart-count').forEach(badge => {
        badge.textContent = totalItems;
        badge.classList.remove('bump');
        void badge.offsetWidth;
        badge.classList.add('bump');
      });
    },
    renderCartPage() {
      const container = document.getElementById('cartItemsContainer');
      const summaryBlock = document.getElementById('cartSummaryBlock');
      if (!container) return; 

      const cart = this.getCart();
      
      if (cart.length === 0) {
        container.innerHTML = `
          <div class="empty-cart">
            <i class="fa-solid fa-basket-shopping"></i>
            <p>Your cart is currently empty.</p>
            <a href="shop.html" class="btn btn-primary" style="margin-top: 20px;">Return to Shop</a>
          </div>
        `;
        if(summaryBlock) summaryBlock.style.display = 'none';
        return;
      }

      if(summaryBlock) summaryBlock.style.display = 'block';
      let html = '';
      let subtotal = 0;

      cart.forEach(item => {
        const itemTotal = (parseFloat(item.price) * item.qty);
        subtotal += itemTotal;
        html += `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">₹${parseFloat(item.price).toFixed(2)}</div>
              <div class="cart-qty-control">
                <button class="cart-qty-btn cart-dec"><i class="fa-solid fa-minus"></i></button>
                <input type="text" class="cart-qty-input" value="${item.qty}" readonly>
                <button class="cart-qty-btn cart-inc"><i class="fa-solid fa-plus"></i></button>
              </div>
            </div>
            <button class="cart-item-remove" aria-label="Remove item"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        `;
      });

      container.innerHTML = html;
      
      const taxRate = 0.08;
      const tax = (subtotal * taxRate);
      const total = subtotal + tax; 
      
      document.getElementById('cartSubtotal').textContent = '₹' + subtotal.toFixed(2);
      document.getElementById('cartTax').textContent = '₹' + tax.toFixed(2);
      document.getElementById('cartTotal').textContent = '₹' + total.toFixed(2);

      this.attachCartPageListeners();
    },
    attachCartPageListeners() {
      const container = document.getElementById('cartItemsContainer');
      if(!container) return;

      container.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.cart-item-remove');
        if (removeBtn) {
          const id = removeBtn.closest('.cart-item').dataset.id;
          this.removeItem(id);
          this.renderCartPage();
          return;
        }

        const btn = e.target.closest('.cart-qty-btn');
        if (btn) {
          const itemEl = btn.closest('.cart-item');
          const id = itemEl.dataset.id;
          const input = itemEl.querySelector('.cart-qty-input');
          let currentQty = parseInt(input.value);

          if (btn.classList.contains('cart-inc')) currentQty++;
          else if (btn.classList.contains('cart-dec') && currentQty > 1) currentQty--;

          this.updateQuantity(id, currentQty);
          this.renderCartPage();
        }
      });
    }
  };

  CartManager.updateBadge();
  
  if(document.getElementById('cartItemsContainer')) {
    CartManager.renderCartPage();
  }

  document.querySelectorAll('.js-add-cart, .add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      
      let id = this.dataset.id;
      let name = this.dataset.name;
      let price = this.dataset.price;
      let image = this.dataset.image;

      if (!id) {
         const card = this.closest('.product-card');
         if(card) {
             name = card.querySelector('.product-name a')?.textContent || 'Product';
             const priceText = card.querySelector('.price-now')?.textContent || '$0';
             price = priceText.replace(/[^0-9.]/g, '');
             image = card.querySelector('img')?.src || '';
             id = 'prod_' + Math.random().toString(36).substr(2, 9); 
         } else {
             name = 'Product';
             price = '0.00';
             image = '';
             id = 'prod_' + Math.random().toString(36).substr(2, 9);
         }
      }

      const qtyWrap = this.closest('.qty-row');
      const qty = qtyWrap ? (qtyWrap.querySelector('.qty-num')?.textContent || 1) : 1;

      CartManager.addItem({ id, name, price, image }, qty);

      const originalContent = this.innerHTML;
      this.innerHTML = `<i class="fa-solid fa-check"></i> Added`;
      this.style.background = 'var(--primary-light)';
      this.style.color = 'white';
      this.disabled = true;

      setTimeout(() => {
        this.innerHTML = originalContent;
        this.style.background = '';
        this.style.color = '';
        this.disabled = false;
      }, 2000);
    });
  });