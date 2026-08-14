/* ===== General Animations & Interactions ===== */

document.addEventListener("DOMContentLoaded", () => {
  /* --- Navbar scroll effect --- */
  const navbar = document.querySelector(".navbar");
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* --- Fade-in / slide-up on scroll (Intersection Observer) --- */
  const animElements = document.querySelectorAll(".anim");
  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          animObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  animElements.forEach(el => animObserver.observe(el));

  /* --- Animated star rating --- */
  const starsEls = document.querySelectorAll(".animated-stars");
  const starsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stars = entry.target.querySelectorAll(".star");
          stars.forEach((s, i) => {
            setTimeout(() => s.classList.add("lit"), i * 150);
          });
          starsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  starsEls.forEach(el => starsObserver.observe(el));

  /* --- Stagger animation for grid children --- */
  const staggerGrids = document.querySelectorAll(".stagger-children");
  const gridObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          gridObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  staggerGrids.forEach(el => gridObserver.observe(el));

  /* --- Floating particles (decorative petals / sparkles) --- */
  createFloatingParticles();

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* --- Mobile nav toggle --- */
  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.getElementById("nav-links");
  const navOverlay = document.getElementById("nav-overlay");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navOverlay?.classList.toggle("open");
    });
    navOverlay?.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navOverlay.classList.remove("open");
    });
  }

  /* --- Page transition on load --- */
  document.body.classList.add("loaded");
});

/* --- Floating decorative particles --- */
function createFloatingParticles() {
  const container = document.querySelector(".floating-particles");
  if (!container) return;
  const shapes = ["petal", "sparkle"];
  for (let i = 0; i < 12; i++) {
    const el = document.createElement("div");
    el.classList.add("particle", shapes[i % shapes.length]);
    el.style.left = Math.random() * 100 + "%";
    el.style.animationDelay = Math.random() * 8 + "s";
    el.style.animationDuration = 10 + Math.random() * 10 + "s";
    el.style.opacity = 0.15 + Math.random() * 0.25;
    el.style.fontSize = 10 + Math.random() * 14 + "px";
    container.appendChild(el);
  }
}

/* --- Add-to-cart micro animation --- */
function showAddAnimation(productId) {
  const btn = document.querySelector(`[data-product-id="${productId}"]`);
  if (!btn) return;
  btn.classList.add("added");
  setTimeout(() => btn.classList.remove("added"), 600);
  const cartIcon = document.querySelector(".cart-toggle");
  if (cartIcon) {
    cartIcon.classList.add("bounce");
    setTimeout(() => cartIcon.classList.remove("bounce"), 700);
  }
}
