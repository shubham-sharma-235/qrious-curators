/* =====================================================
   ABOUT-SCRIPT.JS — Only for about-us.html
   ===================================================== */

/* ---- CURSOR ---- */
const cur = document.getElementById('qc-cur');
const ring = document.getElementById('qc-cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';
});

(function raf() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(raf);
})();

document.querySelectorAll('a, button, .tm-card, .stat-card, .filter-btn, .slider-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cur-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cur-hover'));
});


/* ---- NAVBAR TOGGLE ---- */
const qnToggle = document.getElementById('qnToggle');
const qnOverlay = document.getElementById('qnOverlay');

function qnToggleMenu(force) {
  const isOpen = typeof force === 'boolean'
    ? force
    : !qnOverlay.classList.contains('open');

  qnOverlay.classList.toggle('open', isOpen);
  qnToggle.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

qnToggle.addEventListener('click', () => qnToggleMenu());

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') qnToggleMenu(false);
});

// Close overlay when any nav link is clicked
document.querySelectorAll('.qn-overlay a').forEach(a => {
  a.addEventListener('click', () => qnToggleMenu(false));
});


/* ---- FILTER + SLIDER ---- */
document.addEventListener('DOMContentLoaded', () => {

  const filterBtns = document.querySelectorAll('.filter-btn');
  const allSlides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  let filteredSlides = [...allSlides];
  let currentIndex = 0;

  function showSlide(index) {
    allSlides.forEach(s => s.classList.remove('active'));
    if (filteredSlides[index]) {
      filteredSlides[index].classList.add('active');
    }
  }

  // Next
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % filteredSlides.length;
      showSlide(currentIndex);
    });
  }

  // Prev
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + filteredSlides.length) % filteredSlides.length;
      showSlide(currentIndex);
    });
  }

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      filteredSlides = filter === 'all'
        ? [...allSlides]
        : [...allSlides].filter(slide => slide.classList.contains(filter));

      allSlides.forEach(s => s.classList.remove('active'));
      currentIndex = 0;
      showSlide(currentIndex);
    });
  });

  // Initial show
  showSlide(currentIndex);


  /* ---- COUNTER ANIMATION ---- */
  const counters = document.querySelectorAll('.number');

  counters.forEach(counter => {
    const originalText = counter.innerText.trim();

    if (originalText.includes('M')) {
      let current = 1;
      (function animateMillion() {
        if (current < 999) {
          counter.innerText = current + 'K';
          current += 8;
          requestAnimationFrame(animateMillion);
        } else {
          counter.innerText = '1M';
        }
      })();
    }

    else if (originalText.includes('%')) {
      const target = parseInt(originalText);
      let current = 0;
      const increment = target / 100;
      (function animatePercent() {
        current += increment;
        if (current < target) {
          counter.innerText = Math.floor(current) + '%';
          requestAnimationFrame(animatePercent);
        } else {
          counter.innerText = target + '%';
        }
      })();
    }

    else {
      const target = parseInt(originalText);
      if (isNaN(target)) return;
      let current = 0;
      const increment = target / 100;
      (function animateNormal() {
        current += increment;
        if (current < target) {
          counter.innerText = Math.floor(current);
          requestAnimationFrame(animateNormal);
        } else {
          counter.innerText = target;
        }
      })();
    }
  });


  /* ---- GENERIC REVEAL (.rv / .rvl / .rvr) ---- */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(el => {
      if (el.isIntersecting) el.target.classList.add('in');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.rv, .rvl, .rvr').forEach(el => revealObs.observe(el));


  /* ---- SMOOTH ANCHORS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ---- FOOTER REVEAL ---- */
  const footerObs = new IntersectionObserver(entries => {
    entries.forEach(el => {
      if (el.isIntersecting) el.target.style.opacity = '1';
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('footer').forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 1s ease';
    footerObs.observe(el);
  });

  /* ---- TEAM PARALLAX (about page version) ---- */
  const teamSection = document.getElementById('team');
  const teamCards = document.getElementById('teamCards');

  if (teamSection && teamCards) {
    let ticking = false;

    // Cache heights to avoid layout thrashing on scroll
    let cachedTeamCardsHeight = Math.max(teamCards.offsetHeight, 0);
    let cachedTeamSectionTravel = Math.max(teamSection.offsetHeight - window.innerHeight, 1);
    let resizeTimeout = null;

    function recalcHeights() {
      cachedTeamCardsHeight = Math.max(teamCards.offsetHeight, 0);
      cachedTeamSectionTravel = Math.max(teamSection.offsetHeight - window.innerHeight, 1);
    }

    function updateTeam() {
      const r = teamSection.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / cachedTeamSectionTravel));
      const maxY = Math.max(cachedTeamCardsHeight - window.innerHeight + 80, 0);
      teamCards.style.transform = `translateX(-50%) translateY(-${p * maxY}px)`;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(updateTeam);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      // debounce and recalc cached heights on resize
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        recalcHeights();
        onScroll();
      }, 120);
    });

    // initial cache
    recalcHeights();
    updateTeam();
  }

});
