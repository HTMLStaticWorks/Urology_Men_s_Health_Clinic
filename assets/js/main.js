/* ==========================================================================
   VITALIS UROLOGY & MEN'S HEALTH CLINIC - MASTER JAVASCRIPT
   Single Consolidated Script: Theme, RTL, Navigation, Modals, Forms & Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
     1. THEME SWITCHER (Light / Dark Mode)
     ------------------------------------------------------------------------ */
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('vitalis_theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vitalis_theme', theme);
    themeToggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      btn.innerHTML = theme === 'dark' 
        ? `<svg class="control-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg class="control-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    });
  }

  setTheme(storedTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  });

  /* ------------------------------------------------------------------------
     2. RTL LAYOUT SWITCHER
     ------------------------------------------------------------------------ */
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const storedDir = localStorage.getItem('vitalis_dir') || 'ltr';

  function setDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('vitalis_dir', dir);
    rtlToggleBtns.forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('aria-label', `Switch to ${dir === 'rtl' ? 'Left-to-Right' : 'Right-to-Left'} layout`);
    });
  }

  setDirection(storedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      setDirection(currentDir === 'rtl' ? 'ltr' : 'rtl');
    });
  });

  /* ------------------------------------------------------------------------
     3. MOBILE DRAWER NAVIGATION
     ------------------------------------------------------------------------ */
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
  const drawerCloseBtn = document.querySelector('.drawer-close-btn');

  function openDrawer() {
    if (!drawerOverlay) return;
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawerOverlay) return;
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', (e) => {
      if (e.target === drawerOverlay) closeDrawer();
    });
  }

  // Active Navigation link highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-link, .drawer-link');
  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ------------------------------------------------------------------------
     4. REUSABLE MODAL SYSTEM (Appointment, Info, Doctor Modals)
     ------------------------------------------------------------------------ */
  const modalOverlays = document.querySelectorAll('.modal-overlay');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openModal(modalId) {
    // Close any currently active modal first
    modalOverlays.forEach(modal => modal.classList.remove('active'));

    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const firstInput = targetModal.querySelector('input, select, textarea, button');
        if (firstInput) firstInput.focus();
      }, 50);
    }
  }

  // Attach triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-modal]');
    if (trigger) {
      e.preventDefault();
      const modalTarget = trigger.getAttribute('data-open-modal');
      
      // If trigger passes doctor or info data
      if (trigger.hasAttribute('data-doctor-name')) {
        populateDoctorModal(trigger);
      } else if (trigger.hasAttribute('data-info-title')) {
        populateInfoModal(trigger);
      }
      
      openModal(modalTarget);
    }
  });

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentModal = btn.closest('.modal-overlay');
      closeModal(parentModal);
    });
  });

  document.addEventListener('click', (e) => {
    const closeTrigger = e.target.closest('.modal-close-btn-trigger');
    if (closeTrigger) {
      e.preventDefault();
      const parentModal = closeTrigger.closest('.modal-overlay');
      closeModal(parentModal);
    }
  });

  modalOverlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal(overlay);
    });
  });

  // ESC Key listener for drawers & modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      modalOverlays.forEach(modal => closeModal(modal));
    }
  });

  /* Populate Dynamic Doctor Modal */
  function populateDoctorModal(trigger) {
    const name = trigger.getAttribute('data-doctor-name') || '';
    const role = trigger.getAttribute('data-doctor-role') || '';
    const bio = trigger.getAttribute('data-doctor-bio') || '';
    const imgSrc = trigger.getAttribute('data-doctor-img') || '';

    const nameEl = document.getElementById('doc-modal-name');
    const roleEl = document.getElementById('doc-modal-role');
    const bioEl = document.getElementById('doc-modal-bio');
    const imgEl = document.getElementById('doc-modal-img');

    if (nameEl) nameEl.textContent = name;
    if (roleEl) roleEl.textContent = role;
    if (bioEl) bioEl.textContent = bio;
    if (imgEl) imgEl.src = imgSrc;
  }

  /* Populate Dynamic Info Modal */
  function populateInfoModal(trigger) {
    const title = trigger.getAttribute('data-info-title') || 'Medical Guidance';
    const text = trigger.getAttribute('data-info-text') || '';

    const titleEl = document.getElementById('info-modal-title');
    const textEl = document.getElementById('info-modal-text');

    if (titleEl) titleEl.textContent = title;
    if (textEl) textEl.textContent = text;
  }

  /* ------------------------------------------------------------------------
     5. HOME PAGE — INTERACTIVE SERVICES EXPLORER
     ------------------------------------------------------------------------ */
  const serviceTabBtns = document.querySelectorAll('.service-tab-btn');
  const serviceDisplayCard = document.getElementById('service-display-card');

  const servicesData = {
    urology: {
      title: "Specialist Urological Care",
      desc: "Discreet evaluation and management for urinary symptoms, prostate concerns, kidney and bladder health.",
      img: "assets/images/urology-care.jpg",
      highlights: [
        "Comprehensive urinary flow and bladder symptom assessment",
        "Prostate health evaluation & PSA testing discussions",
        "Kidney stone management & preventive counseling"
      ]
    },
    menshealth: {
      title: "Comprehensive Men's Wellness",
      desc: "Confidential consultations tailored to men's health, sexual health concerns, hormonal vitality and age-appropriate wellness.",
      img: "assets/images/mens-health.jpg",
      highlights: [
        "Confidential consultations for sexual vitality & erectile health",
        "Hormonal health assessment & clinical guidance",
        "Personalized men's preventive wellness pathways"
      ]
    },
    fertility: {
      title: "Male Fertility & Reproductive Health",
      desc: "Empathetic specialist evaluation for male reproductive health, fertility assessments and treatment pathway planning.",
      img: "assets/images/fertility-care.jpg",
      highlights: [
        "Semen analysis interpretation & consultation",
        "Reproductive history review & lifestyle factor optimization",
        "Specialist referral & treatment pathway planning"
      ]
    },
    preventive: {
      title: "Preventive Urological Screening",
      desc: "Proactive screening and health assessments designed to detect potential urological concerns early and maintain long-term vitality.",
      img: "assets/images/preventive-screening.jpg",
      highlights: [
        "Age & risk-appropriate screening protocols",
        "Early detection discussions for prostate & bladder health",
        "Clear, evidence-based recommendations without alarmism"
      ]
    }
  };

  if (serviceTabBtns.length > 0 && serviceDisplayCard) {
    serviceTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        serviceTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const key = btn.getAttribute('data-service-key');
        const data = servicesData[key];

        if (data) {
          serviceDisplayCard.style.opacity = '0';
          setTimeout(() => {
            serviceDisplayCard.querySelector('h3').textContent = data.title;
            serviceDisplayCard.querySelector('p').textContent = data.desc;
            serviceDisplayCard.querySelector('.service-display-img').src = data.img;
            
            const listEl = serviceDisplayCard.querySelector('.service-highlights-list');
            listEl.innerHTML = data.highlights.map(h => `
              <div class="highlight-point">
                <svg class="highlight-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>${h}</span>
              </div>
            `).join('');

            serviceDisplayCard.style.opacity = '1';
          }, 200);
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. HOME PAGE — CONDITIONS / HEALTH AREAS ACCORDION TABS
     ------------------------------------------------------------------------ */
  const conditionPills = document.querySelectorAll('.condition-pill');
  const conditionInfoBox = document.getElementById('condition-info-box');

  const conditionsData = {
    urinary: {
      title: "Urinary Health Concerns",
      desc: "Urinary symptoms like urgency, frequent nighttime urination, or weak stream are common and treatable.",
      concerns: ["Frequent urination", "Nocturia (night urination)", "Weak urinary stream", "Bladder discomfort"],
      seekAdvice: "If symptoms interfere with your daily sleep, work, or quality of life, a specialist evaluation is recommended.",
      help: "We perform structured evaluation to diagnose the underlying cause and discuss targeted lifestyle and clinical care options."
    },
    prostate: {
      title: "Prostate Health & Wellness",
      desc: "Prostate changes naturally occur with age. Understanding symptoms early brings clarity and peace of mind.",
      concerns: ["BPH / Enlarged prostate symptoms", "Elevated PSA concerns", "Prostate inflammation (Prostatitis)", "Family history of prostate issues"],
      seekAdvice: "Men over 40-50 or those with a family history should discuss regular prostate health check-ups.",
      help: "Our clinic provides calm, evidence-based consultations and non-invasive assessment pathways."
    },
    kidney: {
      title: "Kidney & Bladder Conditions",
      desc: "From urinary tract irritation to kidney stones, prompt clinical attention ensures optimal comfort and recovery.",
      concerns: ["Recurrent urinary tract discomfort", "Kidney stone history", "Hematuria (blood in urine)", "Bladder function concerns"],
      seekAdvice: "Any visible blood in urine or sharp back/flank pain requires prompt professional medical consultation.",
      help: "We provide comprehensive diagnostic review and stone prevention guidance."
    },
    fertility: {
      title: "Male Fertility Care",
      desc: "Male factors contribute to nearly half of all fertility challenges. Clear answers start with a private evaluation.",
      concerns: ["Conception planning", "Varicocele concerns", "Hormonal imbalances", "Semen parameters assessment"],
      seekAdvice: "If trying to conceive for 12 months (or 6 months if partner is over 35) without success.",
      help: "We offer respectful, discreet semen analysis reviews and diagnostic pathways in a supportive setting."
    },
    sexual: {
      title: "Male Sexual Health & Vitality",
      desc: "Sexual health concerns are frequent medical conditions that deserve professional, judgment-free medical support.",
      concerns: ["Erectile function concerns", "Premature ejaculation", "Peyronie's disease / curvature", "Low libido & vitality"],
      seekAdvice: "When sexual health concerns cause stress, relationship strain, or personal distress.",
      help: "Our specialists evaluate vascular, hormonal, and psychological factors to tailor effective care."
    },
    preventive: {
      title: "Preventive Men's Urology",
      desc: "Proactive urological screening helps catch subtle health changes early for optimal long-term health.",
      concerns: ["Annual men's health assessment", "Age-appropriate urological screening", "Risk factor review", "Lifestyle wellness planning"],
      seekAdvice: "Recommended for all men aged 40+ as part of routine preventive healthcare maintenance.",
      help: "We structure individual risk assessments and clear screening milestones tailored to your history."
    }
  };

  if (conditionPills.length > 0 && conditionInfoBox) {
    conditionPills.forEach(pill => {
      pill.addEventListener('click', () => {
        conditionPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const key = pill.getAttribute('data-condition-key');
        const data = conditionsData[key];

        if (data) {
          conditionInfoBox.style.opacity = '0';
          setTimeout(() => {
            conditionInfoBox.querySelector('h3').textContent = data.title;
            conditionInfoBox.querySelector('.condition-desc').textContent = data.desc;
            
            const concernsList = conditionInfoBox.querySelector('.concerns-ul');
            concernsList.innerHTML = data.concerns.map(c => `<li>• ${c}</li>`).join('');

            conditionInfoBox.querySelector('.seek-text').textContent = data.seekAdvice;
            conditionInfoBox.querySelector('.help-text').textContent = data.help;

            conditionInfoBox.style.opacity = '1';
          }, 200);
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. FORM VALIDATION & CONFIDENTIAL APPOINTMENT HANDLING
     ------------------------------------------------------------------------ */
  const forms = document.querySelectorAll('.js-validate-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Clear previous error states
      form.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));

      // Validate Required Inputs
      const requiredInputs = form.querySelectorAll('[required]');
      requiredInputs.forEach(input => {
        const value = input.value.trim();
        const parent = input.closest('.form-group');

        if (!value) {
          isValid = false;
          if (parent) parent.classList.add('error');
        } else if (input.type === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            if (parent) parent.classList.add('error');
          }
        } else if (input.type === 'tel') {
          const phoneRegex = /^[0-9+\s-]{7,15}$/;
          if (!phoneRegex.test(value)) {
            isValid = false;
            if (parent) parent.classList.add('error');
          }
        }
      });

      if (isValid) {
        // Reset form
        form.reset();

        // If form is in a modal, close the appointment modal first
        const activeModal = form.closest('.modal-overlay');
        if (activeModal) closeModal(activeModal);

        // Show Success Modal
        openModal('success-modal');
      }
    });
  });

  /* ------------------------------------------------------------------------
     8. SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ------------------------------------------------------------------------
     9. BACK TO TOP BUTTON
     ------------------------------------------------------------------------ */
  const backToTopBtn = document.querySelector('.back-to-top-btn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ------------------------------------------------------------------------
     10. HERO ROTATING TEXT ANIMATION (Home 1)
     ------------------------------------------------------------------------ */
  const rotatingTexts = document.querySelectorAll('.hero-rotating-text');
  if (rotatingTexts.length > 1) {
    let currentIndex = 0;
    setInterval(() => {
      const currentText = rotatingTexts[currentIndex];
      currentText.classList.remove('active');
      currentText.classList.add('exit');

      setTimeout(() => {
        currentText.classList.remove('exit');
      }, 500);

      currentIndex = (currentIndex + 1) % rotatingTexts.length;
      const nextText = rotatingTexts[currentIndex];
      nextText.classList.add('active');
    }, 3200);
  }
});
