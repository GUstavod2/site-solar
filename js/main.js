(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  var yearEl = document.querySelector("[data-year]");
  var faqRoot = document.querySelector("[data-faq]");
  var form = document.querySelector("[data-form]");
  var formFeedback = document.querySelector("[data-form-feedback]");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  function setHeaderScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  setHeaderScrolled();
  window.addEventListener("scroll", setHeaderScrolled, { passive: true });

  function closeNav() {
    if (!header || !navToggle) return;
    header.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function openNav() {
    if (!header || !navToggle) return;
    header.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      if (header.classList.contains("nav-open")) closeNav();
      else openNav();
    });

    nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 960px)").matches) closeNav();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  if (faqRoot) {
    faqRoot.querySelectorAll("[data-faq-trigger]").forEach(function (btn) {
      var panelId = btn.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        faqRoot.querySelectorAll("[data-faq-trigger]").forEach(function (other) {
          if (other === btn) return;
          var oid = other.getAttribute("aria-controls");
          var op = oid ? document.getElementById(oid) : null;
          other.setAttribute("aria-expanded", "false");
          if (op) op.setAttribute("hidden", "");
        });
        btn.setAttribute("aria-expanded", expanded ? "false" : "true");
        if (expanded) panel.setAttribute("hidden", "");
        else panel.removeAttribute("hidden");
      });
    });
  }

  function animateValue(el, end, duration, formatter) {
    var start = 0;
    var startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var p = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var current = Math.round(start + (end - start) * eased);
      el.textContent = formatter ? formatter(current) : String(current);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    if (!window.IntersectionObserver) return;
    var items = document.querySelectorAll(".numero-valor[data-count]");
    var done = false;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || done) return;
          done = true;
          items.forEach(function (el) {
            var end = parseInt(el.getAttribute("data-count"), 10);
            if (Number.isNaN(end)) return;
            animateValue(el, end, 1600, null);
          });
          obs.disconnect();
        });
      },
      { threshold: 0.35 }
    );
    var section = document.querySelector(".numeros");
    if (section) obs.observe(section);
  }

  function initReveal() {
    if (!window.IntersectionObserver) {
      document.querySelectorAll("[data-reveal]").forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    document.querySelectorAll("[data-reveal]").forEach(function (el, i) {
      el.style.setProperty("--i", String(i % 8));
      obs.observe(el);
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (formFeedback) {
        formFeedback.hidden = false;
        formFeedback.classList.remove("is-error");
        formFeedback.classList.add("is-success");
        formFeedback.textContent =
          "Mensagem registrada com sucesso. Em breve nossa equipe entra em contato. (Integração com e-mail ou CRM pode ser ligada aqui.)";
      }
      form.reset();
    });
  }

  function initProjetosCarousel() {
    var track = document.querySelector("[data-carousel-track]");
    if (!track) return;
    
    // Duplicate the slides once to allow for a seamless infinite CSS marquee
    var slides = Array.prototype.slice.call(track.querySelectorAll(".projetos-carousel-slide"));
    slides.forEach(function (slide) {
      var clone = slide.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
  }

  initReveal();
  initCounters();
  initProjetosCarousel();
})();
