/**
 * Flow Phantom Website JavaScript
 * Handles mobile menu, smooth scrolling, and animations
 */

document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", function () {
      const isExpanded = this.getAttribute("aria-expanded") === "true";
      this.setAttribute("aria-expanded", !isExpanded);
      navLinks.classList.toggle("active");

      // Animate hamburger
      this.classList.toggle("active");
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        mobileMenuBtn.setAttribute("aria-expanded", "false");
        mobileMenuBtn.classList.remove("active");
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector(".header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)";
    } else {
      header.style.boxShadow = "none";
    }

    lastScroll = currentScroll;
  });

  // Animate elements on scroll
  const observerOptions = {
    root: null,
    rootMargin: "100px",
    threshold: 0.05,
  };

  const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-visible");
        fadeInObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add fade-in class to elements
  const animateElements = document.querySelectorAll(".feature-card, .app-card, .testimonial-card, .spec-row");
  animateElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(12px)";
    el.style.transition = "opacity 0.3s ease-out, transform 0.3s ease-out";
    fadeInObserver.observe(el);
  });

  // Add visible class styles dynamically
  const style = document.createElement("style");
  style.textContent = `
        .fade-in-visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
  document.head.appendChild(style);

  // FAQ accordion functionality
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const summary = item.querySelector("summary");
    summary.addEventListener("click", (e) => {
      // Close other open items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.hasAttribute("open")) {
          otherItem.removeAttribute("open");
        }
      });
    });
  });

  // Form submission handling with Formspree
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);

      // Simple validation
      const requiredFields = ["name", "email", "organization"];
      let isValid = true;

      requiredFields.forEach((field) => {
        const input = this.querySelector(`[name="${field}"]`);
        if (!input.value.trim()) {
          input.style.borderColor = "#ef4444";
          isValid = false;
        } else {
          input.style.borderColor = "";
        }
      });

      if (!isValid) {
        return;
      }

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      try {
        const response = await fetch(this.action, {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          // Success
          submitBtn.textContent = "Message Sent! ✓";
          submitBtn.style.background = "#10b981";

          // Show success message
          const successMsg = document.createElement("div");
          successMsg.className = "form-success-message";
          successMsg.innerHTML = `
            <p><strong>Thank you for your inquiry!</strong></p>
            <p>We'll respond within 1-2 business days.</p>
          `;
          successMsg.style.cssText = `
            background: #10b981;
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
            text-align: center;
          `;
          this.appendChild(successMsg);

          // Reset form after delay
          setTimeout(() => {
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.style.background = "";
            submitBtn.disabled = false;
            successMsg.remove();
          }, 5000);
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        // Error handling
        submitBtn.textContent = "Error - Try Again";
        submitBtn.style.background = "#ef4444";

        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.style.background = "";
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  }

  // Velocity display animation
  const velocityReading = document.querySelector(".velocity-reading");
  if (velocityReading) {
    let currentVelocity = 25.0;
    const targetVelocities = [25.0, 50.0, 75.0, 100.0, 50.0, 25.0];
    let velocityIndex = 0;

    setInterval(() => {
      const target = targetVelocities[velocityIndex];
      const step = target > currentVelocity ? 0.5 : -0.5;

      if (Math.abs(currentVelocity - target) > 0.5) {
        currentVelocity += step;
      } else {
        velocityIndex = (velocityIndex + 1) % targetVelocities.length;
      }

      velocityReading.textContent = currentVelocity.toFixed(1);
    }, 100);
  }

  // Screen value animation in specs section
  const screenValue = document.querySelector(".screen-value");
  if (screenValue) {
    let screenVelocity = 25.0;
    setInterval(() => {
      screenVelocity = 20 + Math.random() * 10;
      screenValue.textContent = screenVelocity.toFixed(1);
    }, 2000);
  }
});

// Lazy load images when they come into view
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
          imageObserver.unobserve(img);
        }
      });
    },
    {rootMargin: "200px"}
  );

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// Service Worker registration for PWA capabilities (optional)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // navigator.serviceWorker.register('/sw.js')
    //     .then(registration => console.log('SW registered'))
    //     .catch(error => console.log('SW registration failed'));
  });
}

// ==========================================
// INTERNATIONALIZATION (i18n) SUPPORT
// Languages: English, Hindi, Chinese, Japanese
// Translation files are loaded from /locales/*.json
// ==========================================

// Supported languages configuration
const SUPPORTED_LANGUAGES = ["en", "zh", "ja", "hi"];
const DEFAULT_LANGUAGE = "en";

// Translation cache - stores loaded translations
const translationsCache = {};

// Runtime translations store - populated dynamically from /locales/*.json files
const translations = {};

const languageNames = {
  en: {short: "EN", full: "English"},
  hi: {short: "हिं", full: "हिन्दी"},
  zh: {short: "中", full: "中文"},
  ja: {short: "日", full: "日本語"},
};

class I18n {
  constructor() {
    this.currentLang = DEFAULT_LANGUAGE;
    this.isLoading = false;
    this.loadPromise = null;
  }

  async init() {
    this.currentLang = this.getStoredLanguage() || this.detectLanguage();
    
    await this.loadTranslations(this.currentLang);
    
    if (this.currentLang !== DEFAULT_LANGUAGE) {
      await this.loadTranslations(DEFAULT_LANGUAGE);
    }
    
    this.setupLanguageSelector();
    this.applyTranslations();
    this.updateDocumentLang();

    if (!this.getStoredLanguage()) {
      this.detectCountry().then((lang) => {
        if (lang && lang !== this.currentLang && SUPPORTED_LANGUAGES.includes(lang)) {
          this.changeLanguage(lang);
        }
      });
    }
  }

  async loadTranslations(lang) {
    if (translationsCache[lang]) {
      translations[lang] = translationsCache[lang];
      return translationsCache[lang];
    }

    try {
      const response = await fetch(`/locales/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang} translations`);
      }
      const data = await response.json();
      translationsCache[lang] = data;
      translations[lang] = data;
      return data;
    } catch (error) {
      console.warn(`Could not load translations for ${lang}:`, error.message);
      return null;
    }
  }

  detectLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get("lang");
    if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
      return urlLang;
    }

    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split("-")[0];

    if (SUPPORTED_LANGUAGES.includes(langCode)) {
      return langCode;
    }

    if (browserLang.startsWith("zh")) {
      return "zh";
    }

    return DEFAULT_LANGUAGE;
  }

  getStoredLanguage() {
    try {
      const stored = localStorage.getItem("preferred_language");
      if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
        return stored;
      }
    } catch (e) {}
    return null;
  }

  storeLanguage(lang) {
    try {
      localStorage.setItem("preferred_language", lang);
    } catch (e) {}
  }

  async detectCountry() {
    try {
      const cachedGeo = sessionStorage.getItem("geo_language");
      if (cachedGeo) return cachedGeo;

      const response = await fetch("https://ipapi.co/json/");
      if (!response.ok) return null;
      const data = await response.json();
      const country = data.country_code;

      let lang = null;
      if (country === "CN") lang = "zh";
      else if (country === "JP") lang = "ja";
      else if (country === "IN") lang = "hi";

      if (lang) {
        sessionStorage.setItem("geo_language", lang);
        return lang;
      }
    } catch (e) {}
    return null;
  }

  setupLanguageSelector() {
    const langSelector = document.querySelector(".lang-selector");
    const langBtn = document.querySelector(".lang-btn");
    const currentLangDisplay = document.querySelector(".current-lang");

    if (!langSelector || !langBtn) return;

    if (currentLangDisplay) {
      currentLangDisplay.textContent = languageNames[this.currentLang]?.short || this.currentLang.toUpperCase();
    }

    document.querySelectorAll(".lang-dropdown button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === this.currentLang);
    });

    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      langSelector.classList.toggle("active");
      langBtn.setAttribute("aria-expanded", langSelector.classList.contains("active"));
    });

    document.addEventListener("click", () => {
      langSelector.classList.remove("active");
      langBtn.setAttribute("aria-expanded", "false");
    });

    document.querySelectorAll(".lang-dropdown button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.changeLanguage(btn.dataset.lang);
        langSelector.classList.remove("active");
      });
    });
  }

  async changeLanguage(lang) {
    if (!SUPPORTED_LANGUAGES.includes(lang)) return;

    await this.loadTranslations(lang);
    
    this.currentLang = lang;
    this.storeLanguage(lang);
    this.applyTranslations();
    this.updateDocumentLang();

    const url = new URL(window.location);
    if (lang === DEFAULT_LANGUAGE) {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", lang);
    }
    window.history.pushState({}, "", url);

    const currentLangDisplay = document.querySelector(".current-lang");
    if (currentLangDisplay) {
      currentLangDisplay.textContent = languageNames[lang]?.short || lang.toUpperCase();
    }

    document.querySelectorAll(".lang-dropdown button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    });
  }

  applyTranslations() {
    const currentTranslations = translations[this.currentLang] || {};
    const fallbackTranslations = translations[DEFAULT_LANGUAGE] || {};

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      const translation = currentTranslations[key] || fallbackTranslations[key];

      if (translation) {
        if (translation.includes("<")) {
          el.innerHTML = translation;
        } else {
          el.textContent = translation;
        }
      }
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.dataset.i18nAria;
      const translation = currentTranslations[key] || fallbackTranslations[key];
      if (translation) {
        el.setAttribute("aria-label", translation);
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.dataset.i18nPlaceholder;
      const translation = currentTranslations[key] || fallbackTranslations[key];
      if (translation) {
        el.setAttribute("placeholder", translation);
      }
    });

    const titleTranslation = currentTranslations["meta.title"] || fallbackTranslations["meta.title"];
    if (titleTranslation) {
      document.title = titleTranslation;
    }
  }

  updateDocumentLang() {
    document.documentElement.lang = this.currentLang;
    document.documentElement.dir = "ltr";
  }

  t(key) {
    return translations[this.currentLang]?.[key] || translations[DEFAULT_LANGUAGE]?.[key] || key;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  window.i18n = new I18n();
  await window.i18n.init();
});

// ==========================================
// BLOG FUNCTIONALITY
// ==========================================

class Blog {
  constructor() {
    // API base URL - configurable for development/production
    this.apiBase = window.BLOG_API_URL || "https://jja-instruments-website-production.up.railway.app/api";

    // State
    this.currentPage = 1;
    this.currentCategory = "all";
    this.currentSlug = null;
    this.postsPerPage = 6;

    // DOM Elements
    this.listView = document.getElementById("blog-list-view");
    this.postView = document.getElementById("blog-post-view");
    this.postsContainer = document.getElementById("blog-posts-container");
    this.paginationContainer = document.getElementById("blog-pagination");
    this.categoryFilters = document.getElementById("blog-category-filters");
    this.backBtn = document.getElementById("blog-back-btn");
    this.commentForm = document.getElementById("comment-form");
    this.commentsList = document.getElementById("comments-list");

    // Initialize
    this.init();
  }

  async init() {
    if (!this.postsContainer) return;

    // Load categories and posts
    await Promise.all([this.loadCategories(), this.loadPosts()]);

    // Setup event listeners
    this.setupEventListeners();

    // Check for post slug in URL hash
    this.handleHashChange();
    window.addEventListener("hashchange", () => this.handleHashChange());
  }

  setupEventListeners() {
    // Back button
    if (this.backBtn) {
      this.backBtn.addEventListener("click", () => this.showListView());
    }

    // Category filter buttons
    document.querySelectorAll(".blog-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        this.filterByCategory(category);
      });
    });

    // Comment form
    if (this.commentForm) {
      this.commentForm.addEventListener("submit", (e) => this.handleCommentSubmit(e));
    }

    // Cancel reply button
    const cancelReply = document.getElementById("cancel-reply");
    if (cancelReply) {
      cancelReply.addEventListener("click", () => this.cancelReply());
    }
  }

  handleHashChange() {
    const hash = window.location.hash;
    if (hash.startsWith("#blog/")) {
      const slug = hash.replace("#blog/", "");
      if (slug) {
        this.loadPost(slug);
      }
    } else if (hash === "#blog") {
      this.showListView();
    }
  }

  // ============ API Methods ============

  async fetchAPI(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.apiBase}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      // Check content type to ensure we got JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("API returned non-JSON response:", contentType);
        throw new Error("API returned invalid response format");
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({error: "Request failed"}));
        throw new Error(error.error || "Request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // ============ Posts Methods ============

  async loadCategories() {
    try {
      const categories = await this.fetchAPI("/categories");
      this.renderCategoryFilters(categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }

  renderCategoryFilters(categories) {
    if (!this.categoryFilters) return;

    this.categoryFilters.innerHTML = categories
      .map(
        (cat) => `
      <button class="blog-filter-btn" data-category="${this.escapeHtml(cat.category)}">
        ${this.escapeHtml(cat.category)} (${cat.count})
      </button>
    `
      )
      .join("");

    // Add click listeners to new buttons
    this.categoryFilters.querySelectorAll(".blog-filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        this.filterByCategory(category);
      });
    });
  }

  async loadPosts() {
    this.showLoading();

    try {
      let endpoint = `/posts?page=${this.currentPage}&per_page=${this.postsPerPage}`;
      if (this.currentCategory !== "all") {
        endpoint += `&category=${encodeURIComponent(this.currentCategory)}`;
      }

      const data = await this.fetchAPI(endpoint);

      // Handle fallback response when blog service is unavailable
      if (data.error) {
        console.warn("Blog API warning:", data.error);
      }

      this.renderPosts(data.posts || []);
      this.renderPagination(data.pagination || {page: 1, per_page: 6, total: 0, pages: 0});
    } catch (error) {
      console.error("Failed to load blog posts:", error);
      this.showError("Failed to load blog posts. Please try again later.");
    }
  }

  renderPosts(posts) {
    if (!posts || posts.length === 0) {
      this.postsContainer.innerHTML = `
        <div class="blog-loading">
          <p>No articles found.</p>
        </div>
      `;
      return;
    }

    this.postsContainer.innerHTML = posts
      .map(
        (post) => `
      <article class="blog-card" data-slug="${this.escapeHtml(post.slug)}">
        <div class="blog-card-image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
          </svg>
        </div>
        <div class="blog-card-content">
          <div class="blog-card-meta">
            <span class="blog-card-category">${this.escapeHtml(post.category)}</span>
            <span class="blog-card-date">${this.formatDate(post.created_at)}</span>
          </div>
          <h3>${this.escapeHtml(post.title)}</h3>
          <p class="blog-card-excerpt">${this.escapeHtml(post.excerpt || "")}</p>
          <div class="blog-card-author">
            <div class="author-avatar">${this.getInitials(post.author)}</div>
            <span>${this.escapeHtml(post.author)}</span>
          </div>
        </div>
      </article>
    `
      )
      .join("");

    // Add click listeners to cards
    this.postsContainer.querySelectorAll(".blog-card").forEach((card) => {
      card.addEventListener("click", () => {
        const slug = card.dataset.slug;
        window.location.hash = `blog/${slug}`;
      });
    });
  }

  renderPagination(pagination) {
    if (!this.paginationContainer || pagination.pages <= 1) {
      if (this.paginationContainer) this.paginationContainer.innerHTML = "";
      return;
    }

    let html = "";

    // Previous button
    html += `<button ${pagination.page === 1 ? "disabled" : ""} data-page="${pagination.page - 1}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <path d="M15 19l-7-7 7-7"/>
      </svg>
    </button>`;

    // Page numbers
    for (let i = 1; i <= pagination.pages; i++) {
      if (i === 1 || i === pagination.pages || (i >= pagination.page - 1 && i <= pagination.page + 1)) {
        html += `<button class="${i === pagination.page ? "active" : ""}" data-page="${i}">${i}</button>`;
      } else if (i === pagination.page - 2 || i === pagination.page + 2) {
        html += `<button disabled>...</button>`;
      }
    }

    // Next button
    html += `<button ${pagination.page === pagination.pages ? "disabled" : ""} data-page="${pagination.page + 1}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
        <path d="M9 5l7 7-7 7"/>
      </svg>
    </button>`;

    this.paginationContainer.innerHTML = html;

    // Add click listeners
    this.paginationContainer.querySelectorAll("button[data-page]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.dataset.page);
        if (page && !btn.disabled) {
          this.currentPage = page;
          this.loadPosts();
          document.getElementById("blog").scrollIntoView({behavior: "smooth"});
        }
      });
    });
  }

  filterByCategory(category) {
    this.currentCategory = category;
    this.currentPage = 1;

    // Update active state
    document.querySelectorAll(".blog-filter-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === category);
    });

    this.loadPosts();
  }

  // ============ Single Post Methods ============

  async loadPost(slug) {
    this.currentSlug = slug;

    try {
      const post = await this.fetchAPI(`/posts/${slug}`);
      this.renderPost(post);
      this.showPostView();

      // Load comments
      this.loadComments(slug);
    } catch (error) {
      console.error("Failed to load post:", error);
      this.showListView();
    }
  }

  renderPost(post) {
    // Set post content
    document.getElementById("post-category").textContent = post.category;
    document.getElementById("post-date").textContent = this.formatDate(post.created_at);
    document.getElementById("post-title").textContent = post.title;
    document.getElementById("post-author").textContent = post.author;
    document.getElementById("author-avatar").textContent = this.getInitials(post.author);
    document.getElementById("post-content").innerHTML = post.content;

    // Render tags
    const tagsContainer = document.getElementById("post-tags");
    if (post.tags) {
      const tags = post.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);
      tagsContainer.innerHTML = tags.map((tag) => `<span class="blog-tag">${this.escapeHtml(tag)}</span>`).join("");
    } else {
      tagsContainer.innerHTML = "";
    }
  }

  showListView() {
    this.listView.classList.remove("hidden");
    this.postView.classList.add("hidden");
    this.currentSlug = null;
    window.location.hash = "blog";
  }

  showPostView() {
    this.listView.classList.add("hidden");
    this.postView.classList.remove("hidden");

    // Scroll to top of blog section
    document.getElementById("blog").scrollIntoView({behavior: "smooth"});
  }

  // ============ Comments Methods ============

  async loadComments(slug) {
    try {
      const data = await this.fetchAPI(`/posts/${slug}/comments`);
      this.renderComments(data.comments, data.total);
    } catch (error) {
      console.error("Failed to load comments:", error);
      this.commentsList.innerHTML = '<p class="no-comments">Failed to load comments.</p>';
    }
  }

  renderComments(comments, total) {
    document.getElementById("comment-count").textContent = `(${total})`;

    if (!comments || comments.length === 0) {
      this.commentsList.innerHTML = `
        <div class="no-comments">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      `;
      return;
    }

    this.commentsList.innerHTML = comments.map((comment) => this.renderComment(comment)).join("");

    // Add reply button listeners
    this.commentsList.querySelectorAll(".reply-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const commentId = btn.dataset.commentId;
        const authorName = btn.dataset.authorName;
        this.setReplyTo(commentId, authorName);
      });
    });
  }

  renderComment(comment) {
    const repliesHtml = comment.replies && comment.replies.length > 0 ? `<div class="comment-replies">${comment.replies.map((r) => this.renderComment(r)).join("")}</div>` : "";

    return `
      <div class="comment" data-id="${comment.id}">
        <div class="comment-header">
          <div class="comment-author">
            <div class="author-avatar">${this.getInitials(comment.author_name)}</div>
            <div class="comment-author-info">
              <strong>${this.escapeHtml(comment.author_name)}</strong>
              <span>${this.formatDate(comment.created_at)}</span>
            </div>
          </div>
        </div>
        <div class="comment-content">
          ${this.escapeHtml(comment.content).replace(/\n/g, "<br>")}
        </div>
        <div class="comment-actions">
          <button class="reply-btn" data-comment-id="${comment.id}" data-author-name="${this.escapeHtml(comment.author_name)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            Reply
          </button>
        </div>
        ${repliesHtml}
      </div>
    `;
  }

  setReplyTo(commentId, authorName) {
    document.getElementById("comment-parent-id").value = commentId;
    document.getElementById("reply-to-name").textContent = authorName;
    document.getElementById("replying-to").classList.remove("hidden");

    // Scroll to form
    this.commentForm.scrollIntoView({behavior: "smooth"});
    document.getElementById("comment-name").focus();
  }

  cancelReply() {
    document.getElementById("comment-parent-id").value = "";
    document.getElementById("replying-to").classList.add("hidden");
  }

  async handleCommentSubmit(e) {
    e.preventDefault();

    const submitBtn = this.commentForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Posting...";
    submitBtn.disabled = true;

    const formData = new FormData(this.commentForm);
    const data = {
      author_name: formData.get("author_name"),
      author_email: formData.get("author_email"),
      content: formData.get("content"),
      parent_id: formData.get("parent_id") || null,
    };

    try {
      await this.fetchAPI(`/posts/${this.currentSlug}/comments`, {
        method: "POST",
        body: JSON.stringify(data),
      });

      // Success - reload comments and reset form
      this.commentForm.reset();
      this.cancelReply();
      await this.loadComments(this.currentSlug);

      submitBtn.textContent = "Posted!";
      submitBtn.style.background = "#10b981";

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = "";
        submitBtn.disabled = false;
      }, 2000);
    } catch (error) {
      submitBtn.textContent = "Error - Try Again";
      submitBtn.style.background = "#ef4444";

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = "";
        submitBtn.disabled = false;
      }, 3000);
    }
  }

  // ============ Helper Methods ============

  showLoading() {
    this.postsContainer.innerHTML = `
      <div class="blog-loading">
        <div class="loading-spinner"></div>
        <p>Loading articles...</p>
      </div>
    `;
  }

  showError(message) {
    this.postsContainer.innerHTML = `
      <div class="blog-loading">
        <p>${this.escapeHtml(message)}</p>
      </div>
    `;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  getInitials(name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize Blog when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.blog = new Blog();
});

// Product Image Gallery
function changeImage(src, element) {
  const mainImage = document.getElementById("main-product-image");
  if (mainImage) {
    mainImage.src = src;
    mainImage.alt = element.querySelector("img").alt;
  }

  // Update active thumbnail
  document.querySelectorAll(".product-image-gallery .thumbnail").forEach((thumb) => {
    thumb.classList.remove("active");
  });
  element.classList.add("active");
}
