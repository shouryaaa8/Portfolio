document.addEventListener("DOMContentLoaded", () => {
  // Core Engine Configuration & Module Initializations
  gsap.registerPlugin(ScrollTrigger);
  const isMobile = window.matchMedia("(max-width: 1024px)").matches;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let lenisInstance = null;

  initLenisSmoothScroll();
  initPreloaderSequence();
  initHardwareCursor();
  initAmbientLightingShader();
  initNavigationModule();
  initContactFormToasts();

  if (!prefersReducedMotion) {
    initThreeDCardTilt();
    initScrollTriggerRevealSequences();
    initCalibratedMagneticButtons();
  } else {
    document
      .querySelectorAll("[data-fade-in]")
      .forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
  }

  // Lenis Virtual Smooth Scroll Orchestrator
  function initLenisSmoothScroll() {
    if (isMobile) return;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });
    lenisInstance = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // Cinematic Preloader Timeline Sequence
  function initPreloaderSequence() {
    const loader = document.querySelector("[data-loader]");
    const fill = document.querySelector("[data-loader-fill]");
    const text = document.querySelector("[data-loader-text]");

    if (!loader) return;

    const tl = gsap.timeline({
      onComplete: () => {
        loader.style.display = "none";
        initHeroEntranceTimeline();
      },
    });

    tl.to(fill, { width: "100%", duration: 1.2, ease: "power4.inOut" })
      .to(text, { opacity: 0, y: -15, duration: 0.35, ease: "power2.in" })
      .to(loader, { opacity: 0, duration: 0.5, ease: "power3.out" }, "-=0.15");
  }

  // Dynamic Tracking Hardware Cursor Layer (Using Transform3d Matrix processing)
  function initHardwareCursor() {
    const cursor = document.querySelector("[data-cursor]");
    const dot = document.querySelector("[data-cursor-dot]");
    if (!cursor || !dot || isMobile) return;

    let mouseX = -100,
      mouseY = -100;
    let cursorX = -100,
      cursorY = -100;
    let dotX = -100,
      dotY = -100;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    gsap.ticker.add(() => {
      const dt = 1.0 - Math.pow(0.08, gsap.ticker.deltaRatio() * 0.04);
      const dtDot = 1.0 - Math.pow(0.005, gsap.ticker.deltaRatio() * 0.08);

      cursorX += (mouseX - cursorX) * dt;
      cursorY += (mouseY - cursorY) * dt;
      dotX += (mouseX - dotX) * dtDot;
      dotY += (mouseY - dotY) * dtDot;

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
    });

    // Hover Expanding Systems Interactions
    document
      .querySelectorAll("a, button, [data-tilt-card], [data-reactive-card]")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursor.style.width = "44px";
          cursor.style.height = "44px";
          cursor.style.backgroundColor = "rgba(207, 168, 56, 0.03)";
          cursor.style.borderColor = "rgba(207, 168, 56, 0.5)";
        });
        el.addEventListener("mouseleave", () => {
          cursor.style.width = "26px";
          cursor.style.height = "26px";
          cursor.style.backgroundColor = "transparent";
          cursor.style.borderColor = "var(--accent-gold)";
        });
      });
  }

  // Ambient Moving Radial Gradient Micro-Lighting Matrix Tracker
  function initAmbientLightingShader() {
    const glow = document.querySelector("[data-ambient-glow]");
    const containerCards = document.querySelectorAll(
      "[data-tilt-card], [data-reactive-card]",
    );

    window.addEventListener("mousemove", (e) => {
      const { clientX, clientY } = e;

      if (glow) {
        glow.style.background = `radial-gradient(circle 500px at ${clientX}px ${clientY}px, var(--accent-gold-glow), transparent 100%)`;
      }

      // Map and calculate multi-card vector inputs simultaneously
      containerCards.forEach((card) => {
        const cardGlow = card.querySelector("[data-card-glow]");
        if (cardGlow) {
          const rect = card.getBoundingClientRect();
          const x = clientX - rect.left;
          const y = clientY - rect.top;
          cardGlow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      });
    });
  }

  // Interface Navigation Intersections Module
  function initNavigationModule() {
    const progress = document.querySelector("[data-scroll-progress]");
    const sections = document.querySelectorAll("[data-section]");
    const navLinks = document.querySelectorAll("[data-link]");
    const mobileToggle = document.querySelector("[data-mobile-toggle]");
    const mobileMenu = document.querySelector("[data-mobile-menu]");
    const mobileLinks = document.querySelectorAll("[data-mobile-link]");

    function closeMobileMenu() {
      if (mobileMenu) mobileMenu.classList.remove("active");
      if (mobileToggle) mobileToggle.classList.remove("active");
    }

    function getNavOffset() {
      const nav = document.querySelector("[data-nav]");
      const navHeight = nav ? nav.getBoundingClientRect().height : 0;
      return Math.ceil(navHeight) + 12;
    }

    function updateLocationHash(hash) {
      if (!hash || window.location.hash === hash) return;
      history.pushState(null, "", hash);
    }

    function smoothScrollToTarget(target, hash) {
      const offset = getNavOffset();

      if (lenisInstance && !prefersReducedMotion) {
        lenisInstance.scrollTo(target, {
          offset: -offset,
          duration: 1.1,
          immediate: false,
        });
      } else {
        const targetTop =
          target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: Math.max(0, targetTop),
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }

      updateLocationHash(hash);
    }

    document
      .querySelectorAll('a[href^="#"]:not([href="#"])')
      .forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
          const hash = anchor.getAttribute("href");
          if (!hash) return;

          const target = document.querySelector(hash);
          if (!target) return;

          event.preventDefault();
          closeMobileMenu();
          smoothScrollToTarget(target, hash);
        });
      });

    window.addEventListener("scroll", () => {
      const totalScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const percentage = (window.scrollY / totalScroll) * 100;
        if (progress) progress.style.width = `${percentage}%`;
      }

      let current = "";
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
    });

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener("click", () => {
        mobileMenu.classList.toggle("active");
        mobileToggle.classList.toggle("active");
      });
    }

    mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  function initContactFormToasts() {
    const form = document.querySelector("[data-contact-form]");
    const toastStack = document.getElementById("toasts");
    const emailCopyButton = document.querySelector("[data-email-copy]");

    if (!toastStack) return;

    const messages = {
      copy: {
        title: "Copied!",
        message: "Email address copied to clipboard.",
      },
      success: {
        title: "Message sent",
        message: "Thanks. Your message was delivered successfully.",
      },
      error: {
        title: "Message failed",
        message: "Something went wrong while sending the form. Please try again.",
      },
    };

    function createToast(type) {
      const toast = document.createElement("div");
      toast.className = `toast ${type}`;

      const iconMap = {
        copy: "fa-circle-check",
        success: "fa-circle-check",
        error: "fa-circle-xmark",
        info: "fa-circle-info",
      };

      const payload = messages[type] || messages.error;

      toast.innerHTML = `
        <div class="toast__icon" aria-hidden="true">
          <i class="fa-solid ${iconMap[type] || iconMap.info}"></i>
        </div>
        <div class="toast__content">
          <span class="toast__title">${payload.title}</span>
          <div class="toast__message">${payload.message}</div>
        </div>
      `;

      toastStack.appendChild(toast);

      window.setTimeout(() => {
        toast.remove();
      }, 4000);
    }

    async function copyTextToClipboard(text) {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return;
      }

      const temporaryInput = document.createElement("textarea");
      temporaryInput.value = text;
      temporaryInput.setAttribute("readonly", "");
      temporaryInput.style.position = "fixed";
      temporaryInput.style.opacity = "0";
      temporaryInput.style.pointerEvents = "none";
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      temporaryInput.setSelectionRange(0, text.length);

      const copied = document.execCommand("copy");
      document.body.removeChild(temporaryInput);

      if (!copied) {
        throw new Error("Unable to copy email address.");
      }
    }

    if (emailCopyButton) {
      const emailValue = emailCopyButton.dataset.emailCopyValue || "";
      let resetCopyStateTimer = null;

      emailCopyButton.addEventListener("click", async (event) => {
        event.preventDefault();

        if (!emailValue) return;

        try {
          await copyTextToClipboard(emailValue);
          emailCopyButton.dataset.copyState = "copied";
          createToast("copy");

          window.clearTimeout(resetCopyStateTimer);
          resetCopyStateTimer = window.setTimeout(() => {
            delete emailCopyButton.dataset.copyState;
          }, 2000);
        } catch (error) {
          createToast("error");
        }
      });
    }

    if (form) {
      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const submitButton = form.querySelector("button[type='submit']");
        const originalButtonText = submitButton ? submitButton.innerHTML : "";

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.innerHTML = "Sending...";
        }

        try {
          const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
              Accept: "application/json",
            },
          });

          const result = await response.json();

          if (!response.ok || result.success === false) {
            throw new Error(result.message || "Unable to send message.");
          }

          form.reset();
          createToast("success");
        } catch (error) {
          createToast("error");
        } finally {
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
          }
        }
      });
    }
  }

  // Production Cinematic Hero Sequence
  function initHeroEntranceTimeline() {
    const tl = gsap.timeline();

    // Asymmetric Character Matrix Transformation Split Elements
    document.querySelectorAll("[data-split-text]").forEach((el) => {
      const txt = el.textContent;
      el.innerHTML = txt
        .split("")
        .map((char) =>
          char === " "
            ? "&nbsp;"
            : `<span class="matrix-char-node" style="display:inline-block; opacity:0; transform:translate3d(0, 25px, 0)">${char}</span>`,
        )
        .join("");
    });

    tl.to(".matrix-char-node", {
      opacity: 1,
      get transform() {
        return "translate3d(0,0,0)";
      },
      duration: 0.7,
      stagger: 0.02,
      ease: "power4.out",
    }).to(
      "[data-fade-in]",
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      },
      "-=0.3",
    );
  }

  // GSAP Controlled Layer Animations Pipeline
  function initScrollTriggerRevealSequences() {
    document.querySelectorAll(".section-heading-lux").forEach((heading) => {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: heading,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    const layoutsReveal = document.querySelectorAll(
      ".about-section [data-fade-in], .projects-section [data-fade-in], .experience-section [data-fade-in], .testimonials-section [data-fade-in], .faq-section [data-fade-in], .contact-section [data-fade-in]",
    );
    layoutsReveal.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        },
      );
    });
  }

  // FAQ accordion accessibility and interactions
  function initFAQAccordion() {
    const faqRegion = document.querySelector('.faq-accordion');
    if (!faqRegion) return;

    const items = faqRegion.querySelectorAll('.faq-item');

    function closeAll(except = null) {
      items.forEach((it) => {
        if (it === except) return;
        it.classList.remove('open');
        const btn = it.querySelector('.faq-question');
        const panel = it.querySelector('.faq-answer');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        if (panel) panel.style.maxHeight = null;
      });
    }

    items.forEach((item) => {
      const btn = item.querySelector('.faq-question');
      const panel = item.querySelector('.faq-answer');

      if (!btn || !panel) return;

      // ensure collapsed styles
      panel.style.overflow = 'hidden';
      panel.style.maxHeight = null;

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        if (isOpen) {
          item.classList.remove('open');
          btn.setAttribute('aria-expanded', 'false');
          panel.style.maxHeight = null;
        } else {
          closeAll(item);
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });

      // keyboard accessibility
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });
  }

  // initialize FAQ after DOM ready
  initFAQAccordion();

  // Interactive 3D Depth Card Tilting Distortion Mechanics
  function initThreeDCardTilt() {
    const tiltedCards = document.querySelectorAll(
      "[data-tilt-card], [data-reactive-card]",
    );
    if (isMobile) return;

    tiltedCards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xc = rect.width / 2;
        const yc = rect.height / 2;

        // Fine tuned angular distortion variables matching production video assets
        const angleX = (yc - y) / 45; // Increased from 18 to 45 for micro-movement
        const angleY = (x - xc) / 45; // Increased from 18 to 45 for micro-movement

        gsap.to(card, {
          rotateX: angleX,
          rotateY: angleY,
          transformPerspective: 2000, // Higher perspective makes the tilt flatter and more elegant
          scale: 1, // Changed from 1.015 to 1 to remove the aggressive jumping effect
          duration: 0.6, // Slower response time to feel deliberate
          ease: "power2.out",
          overwrite: "auto",
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
    });
  }

  // Calibrated Smooth Micro-Attraction Mechanics (Optimized Less Reactive Physics Engine)
  function initCalibratedMagneticButtons() {
    const magnetics = document.querySelectorAll("[data-magnetic]");
    if (isMobile) return;

    magnetics.forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Attenuation multiplier downscaled to exactly 0.14 for deliberate premium control
        gsap.to(el, {
          x: x * 0.14,
          y: y * 0.14,
          duration: 0.4,
          ease: "power2.out",
        });
      });

      el.addEventListener("mouseleave", () => {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1.1, 0.4)",
        });
      });
    });
  }
});
