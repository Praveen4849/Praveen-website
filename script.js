/**
 * ==============================================================================
 * PRAVEEN S — PORTFOLIO JAVASCRIPT (script.js)
 * Pure Vanilla JavaScript implementation
 * Features:
 *  - Mobile navigation drawer toggle & keyboard accessibility
 *  - Scrollspy active section highlighting
 *  - Sticky navbar styling on scroll
 *  - Contact form live validation & prefilled mailto: generator
 *  - Copy email to clipboard utility with feedback
 *  - Dynamic copyright year
 *  - Back-to-top smooth scrolling
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ----------------------------------------------------------------------------
  // 0. COSMIC STARFIELD BACKGROUND (Twinkling space particles)
  // ----------------------------------------------------------------------------
  const canvas = document.getElementById('starfield-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initStars();
      }, 100);
    }, { passive: true });

    let stars = [];
    const getStarCount = () => Math.min(220, Math.max(80, Math.floor((width * height) / 7000)));

    function initStars() {
      stars = [];
      const count = getStarCount();
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.35,
          baseAlpha: Math.random() * 0.7 + 0.25,
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          phase: Math.random() * Math.PI * 2,
          color: ['#ffffff', '#e0f2fe', '#bae6fd', '#c7d2fe', '#a7f3d0'][Math.floor(Math.random() * 5)]
        });
      }
    }

    initStars();

    let time = 0;
    function animateStars() {
      ctx.clearRect(0, 0, width, height);
      time += 0.04;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        const twinkle = (Math.sin(time * star.twinkleSpeed * 10 + star.phase) + 1) / 2;
        const currentAlpha = star.baseAlpha * (0.35 + 0.65 * twinkle);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = currentAlpha;
        ctx.fill();

        // Subtle soft halo for primary stars
        if (star.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = currentAlpha * 0.22;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      requestAnimationFrame(animateStars);
    }

    animateStars();
  }

  // ----------------------------------------------------------------------------
  // 1. DYNAMIC FOOTER YEAR
  // ----------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // ----------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // ----------------------------------------------------------------------------
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  function openMenu() {
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMenu() {
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when clicking on any navigation link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          closeMenu();
        }
      });
    });

    // Close menu on clicking outside the drawer
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close menu with Escape key for keyboard accessibility
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 3. STICKY NAVBAR & BACK-TO-TOP BUTTON VISIBILITY
  // ----------------------------------------------------------------------------
  const mainHeader = document.getElementById('main-header');
  const backToTopBtn = document.getElementById('back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // Sticky header enhancement
    if (mainHeader) {
      if (scrollY > 50) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial run on page load

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ----------------------------------------------------------------------------
  // 4. SCROLLSPY ACTIVE SECTION HIGHLIGHTING
  // ----------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollY = window.scrollY + 120; // Offset for header

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ----------------------------------------------------------------------------
  // 5. COPY EMAIL TO CLIPBOARD
  // ----------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyTooltip = document.getElementById('copy-tooltip');
  const recipientEmail = 'praveen03122005@gmail.com';

  if (copyEmailBtn && copyTooltip) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(recipientEmail);
        } else {
          // Fallback for older browsers
          const tempInput = document.createElement('input');
          tempInput.value = recipientEmail;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
        }

        copyTooltip.textContent = 'Copied!';
        copyTooltip.classList.add('show');

        setTimeout(() => {
          copyTooltip.classList.remove('show');
          setTimeout(() => {
            copyTooltip.textContent = 'Copy';
          }, 200);
        }, 2200);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
        copyTooltip.textContent = 'Failed';
        copyTooltip.classList.add('show');
        setTimeout(() => copyTooltip.classList.remove('show'), 2000);
      }
    });
  }

  // ----------------------------------------------------------------------------
  // 6. CONTACT FORM VALIDATION & PREFILLED EMAIL DRAFT GENERATION
  // ----------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');
  const formFeedback = document.getElementById('form-feedback');

  // Email format regex (RFC 5322 compliant simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;

  function validateField(input, errorElement, validationFn, errorMessage) {
    const value = input.value.trim();
    const isValid = validationFn(value);

    if (!isValid) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (errorElement) errorElement.textContent = errorMessage;
      return false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (errorElement) errorElement.textContent = '';
      return true;
    }
  }

  // Live input events to clear error states as user types
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      validateField(
        nameInput,
        nameError,
        (val) => val.length >= 2,
        'Please enter your full name (minimum 2 characters).'
      );
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      validateField(
        emailInput,
        emailError,
        (val) => emailRegex.test(val),
        'Please enter a valid email address (e.g. name@domain.com).'
      );
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener('input', () => {
      validateField(
        subjectInput,
        subjectError,
        (val) => val.length >= 3,
        'Please enter a subject (minimum 3 characters).'
      );
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      validateField(
        messageInput,
        messageError,
        (val) => val.length >= 10,
        'Please provide a message with at least 10 characters.'
      );
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validate all fields
      const isNameValid = validateField(
        nameInput,
        nameError,
        (val) => val.length >= 2,
        'Full name is required (minimum 2 characters).'
      );

      const isEmailValid = validateField(
        emailInput,
        emailError,
        (val) => emailRegex.test(val),
        'A valid email address is required.'
      );

      const isSubjectValid = validateField(
        subjectInput,
        subjectError,
        (val) => val.length >= 3,
        'Subject is required (minimum 3 characters).'
      );

      const isMessageValid = validateField(
        messageInput,
        messageError,
        (val) => val.length >= 10,
        'Message must contain at least 10 characters.'
      );

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback error';
          formFeedback.textContent = 'Please correct the highlighted errors above before proceeding.';
        }
        return;
      }

      // Prepare mailto URI
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      const emailSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject}`);
      const emailBody = encodeURIComponent(
        `Hello Praveen,\n\n${message}\n\n---\nSender Details:\nName: ${name}\nEmail: ${email}\nSent via Praveen S Portfolio Website`
      );

      const mailtoUrl = `mailto:${recipientEmail}?subject=${emailSubject}&body=${emailBody}`;

      // Show positive confirmation banner
      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `✓ Form validated successfully! Opening your email client to send to <strong>${recipientEmail}</strong>. If your email application does not open automatically, <a href="${mailtoUrl}" style="text-decoration:underline;color:inherit;font-weight:700;">click here</a>.`;
      }

      // Trigger mailto link
      window.location.href = mailtoUrl;
    });
  }

  // ----------------------------------------------------------------------------
  // 7. CONSOLE GREETING (Developer Touch)
  // ----------------------------------------------------------------------------
  console.log(
    '%c Praveen S — Aspiring AI/ML & Software Developer %c\nB.E. CSE (AI & ML) | Sudharsan Engineering College (2023–2027)\nTrichy, Tamil Nadu, India\nContact: praveen03122005@gmail.com',
    'background: #10b981; color: #04100c; font-weight: bold; font-size: 14px; padding: 6px 12px; border-radius: 4px;',
    'color: #94a3b8; font-size: 11px;'
  );
});
