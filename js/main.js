// Back to top functionality
window.onscroll = function() {
    const backToTopBtn = document.getElementById("backToTop");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Highlight active work and year in works page
window.addEventListener('scroll', function() {
  const sections = document.body.classList.contains('works-body')
    ? document.querySelectorAll('.work:not(.hidden)')
    : document.querySelectorAll('.work');
  const navLinks = document.querySelectorAll('.year-group a');
  const openYears = document.querySelectorAll('.year-group');

  let current = '';

  sections.forEach(section => {
    const anchorTop = section.getBoundingClientRect().top + window.pageYOffset;
    if (pageYOffset >= (anchorTop - 140)) {
      current = section.getAttribute('id');
      // Do not auto-open/expand all years; keep user's current open/closed state
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href').substring(1) === current);
  });
});

// Smooth scroll for sidebar links with correct offset for sticky topbar
window.addEventListener('DOMContentLoaded', function() {
  const sidebarAnchors = document.querySelectorAll('.sidebar a[href^="#"]');
  const topbar = document.querySelector('.topbar');
  const yearToggles = document.querySelectorAll('.year-toggle');
  const yearGroups = document.querySelectorAll('.year-group');
  const worksSections = document.querySelectorAll('body.works-body .content .work');
  const sidebarDrawerBtn = document.querySelector('.sidebar-toggle');
  const sidebarDrawer = document.querySelector('.drawer-content');
  const worksNav = document.querySelector('.works-nav');

  function scrollToWorkTop(targetEl, smooth) {
    if (!targetEl) return;
    // Prefer the section title as anchor to avoid image-loading layout shifts
    const anchor = targetEl.querySelector('h2') || targetEl;
    const topbarHeight = topbar ? topbar.offsetHeight : 0;
    const extraSpacing = 20;
    const y = anchor.getBoundingClientRect().top + window.pageYOffset - (topbarHeight + extraSpacing);
    window.scrollTo({ top: y, behavior: smooth ? 'smooth' : 'auto' });
  }

  function alignToWorkTop(targetId, attempts = 8) {
    const el = document.getElementById(targetId);
    if (!el) return;
    let tries = 0;
    const tick = () => {
      scrollToWorkTop(el, false);
      tries += 1;
      if (tries < attempts) {
        setTimeout(tick, 80);
      }
    };
    tick();
  }

  function showWorkById(targetId) {
    if (!document.body.classList.contains('works-body')) return;
    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;
    worksSections.forEach(sec => sec.classList.add('hidden'));
    targetEl.classList.remove('hidden');
    const targetYear = targetEl.getAttribute('data-year');
    document.querySelectorAll('.year-group').forEach(g => {
      if (g.dataset.year === targetYear) {
        g.classList.add('open');
        const btn = g.previousElementSibling;
        if (btn && btn.matches('.year-toggle')) btn.setAttribute('aria-expanded', 'true');
      }
    });
    document.querySelectorAll('.year-group a').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href').slice(1) === targetId);
    });
  }

  sidebarAnchors.forEach(anchor => {
    anchor.addEventListener('click', function(event) {
      const targetId = this.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) {
        return;
      }
      event.preventDefault();

      // Works page behavior: show only selected project
      if (worksSections.length) {
        showWorkById(targetId);
      }

      // Auto-close sidebar drawer only on mobile
      if (window.matchMedia('(max-width: 768px)').matches) {
        if (sidebarDrawer && sidebarDrawer.classList.contains('open')) {
          sidebarDrawer.classList.remove('open');
          if (sidebarDrawerBtn) sidebarDrawerBtn.setAttribute('aria-expanded', 'false');
        }
      }

      // Scroll to the selected work's top (title/lead) after drawer state settles
      setTimeout(() => {
        alignToWorkTop(targetId, 8);
        history.replaceState(null, '', '#' + targetId);
      }, 60);
    });
  });

  // Collapsible years
  yearToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const list = this.nextElementSibling;
      const isOpen = list.classList.contains('open');
      list.classList.toggle('open');
      this.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Mobile: use topbar "works" as drawer toggle
  if (worksNav && sidebarDrawer) {
    worksNav.addEventListener('click', function(e) {
      // Only intercept on mobile layout where drawer exists
      if (window.matchMedia('(max-width: 768px)').matches) {
        e.preventDefault();
        const open = sidebarDrawer.classList.toggle('open');
        worksNav.classList.toggle('is-open', open);
        // Scroll to topbar so drawer appears attached to it
        if (open) {
          const targetY = 0;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
          // Collapse all years; wait a tick so drawer animation starts
          setTimeout(() => {
            document.querySelectorAll('.year-group').forEach(g => {
              g.classList.remove('open');
              const btn = g.previousElementSibling;
              if (btn && btn.matches('.year-toggle')) btn.setAttribute('aria-expanded', 'false');
            });
            // Remove any active highlight
            document.querySelectorAll('.year-group a').forEach(link => link.classList.remove('active'));
          }, 50);
        }
      }
    });
  }

  // Ensure latest year is open by default (works page only) or show hash selection
  if (document.body.classList.contains('works-body') && yearGroups.length) {
    const hash = window.location.hash ? window.location.hash.slice(1) : '';
    if (hash) {
      // Reset any active state first
      document.querySelectorAll('.year-group a').forEach(link => link.classList.remove('active'));
      showWorkById(hash);
      // Scroll to the title/lead area of the selected work (robust alignment)
      alignToWorkTop(hash, 10);
    } else {
      // Keep all years closed initially on mobile and desktop
      document.querySelectorAll('.year-group').forEach(g => {
        g.classList.remove('open');
        const btn = g.previousElementSibling;
        if (btn && btn.matches('.year-toggle')) btn.setAttribute('aria-expanded', 'false');
      });
      // Mobile: auto-open drawer on first load with no hash
      if (sidebarDrawer && worksNav && window.matchMedia('(max-width: 768px)').matches) {
        sidebarDrawer.classList.add('open');
        worksNav.classList.add('is-open');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  // On works page initial state: hide all works, unless a hash is present
  if (document.body.classList.contains('works-body') && worksSections.length) {
    const hash = window.location.hash ? window.location.hash.slice(1) : '';
    // Hide all works initially
    worksSections.forEach(sec => sec.classList.add('hidden'));
    // Clear any active highlight
    document.querySelectorAll('.year-group a').forEach(link => link.classList.remove('active'));
    if (hash) {
      showWorkById(hash);
      alignToWorkTop(hash, 10);
    }
  }

  // After images/fonts load, re-align to the selected work once more to avoid
  // mid-text landings caused by layout shifts
  window.addEventListener('load', () => {
    if (!document.body.classList.contains('works-body')) return;
    const hash = window.location.hash ? window.location.hash.slice(1) : '';
    if (hash) {
      alignToWorkTop(hash, 6);
    }
  });
});

// Home Page Slider Auto-load logic
document.addEventListener('DOMContentLoaded', () => {
  const homeSlider = document.getElementById('homeSlider');
  if (homeSlider && document.body.classList.contains('home-body')) {
    fetch('./works.html')
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const works = doc.querySelectorAll('.work');
        
        homeSlider.innerHTML = '';
        const limit = Math.min(3, works.length);
        
        for (let i = 0; i < limit; i++) {
          const work = works[i];
          const id = work.getAttribute('id');
          const year = work.getAttribute('data-year');
          const titleEl = work.querySelector('h2');
          const title = titleEl ? titleEl.innerText : '';
          
          // The image is inside .work-media now, or directly in .work if old structure
          const imgEl = work.querySelector('.work-media img') || work.querySelector('img');
          const imgSrc = imgEl ? imgEl.getAttribute('src') : '';
          
          if (imgSrc && title) {
            const slide = document.createElement('a');
            slide.className = 'slide';
            slide.href = `./works.html#${id}`;
            slide.innerHTML = `
              <img src="${imgSrc}" alt="${title} lead image">
              <div class="slide-caption"><span class="year">${year}</span> ${title}</div>
            `;
            homeSlider.appendChild(slide);
          }
        }
      })
      .catch(err => console.error('Error loading works for slider:', err));
  }
});

// ============================================================
// Mobile Navigation
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  const menuBtn = document.getElementById('mobileMenuBtn');
  const menuOverlay = document.getElementById('mobileMenuOverlay');
  const menuClose = document.getElementById('mobileMenuClose');
  const expandBtn = menuOverlay ? menuOverlay.querySelector('.overlay-expand-btn') : null;
  const overlayWorksList = menuOverlay ? menuOverlay.querySelector('.overlay-works-list') : null;
  const worksBtn = document.getElementById('mobileWorksBtn');
  const drawerContent = document.querySelector('.drawer-content');
  const worksArrow = worksBtn ? worksBtn.querySelector('.mob-works-arrow') : null;
  let worksListLoaded = false;

  function openOverlay() {
    if (!menuOverlay) return;
    // Close works drawer first
    if (drawerContent) {
      drawerContent.classList.remove('open');
      if (worksArrow) worksArrow.innerHTML = '&#9660;';
    }
    menuOverlay.classList.add('open');
    menuOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    if (!menuOverlay) return;
    menuOverlay.classList.remove('open');
    menuOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function openWorksDrawer() {
    if (!drawerContent) return;
    // Close overlay first
    closeOverlay();
    drawerContent.classList.add('open');
    if (worksArrow) worksArrow.innerHTML = '&#9650;';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Menu button (all pages including works) ---
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      if (!isMobile()) return;
      if (menuOverlay && menuOverlay.classList.contains('open')) {
        closeOverlay();
      } else {
        openOverlay();
      }
    });
  }

  if (menuClose) {
    menuClose.addEventListener('click', closeOverlay);
  }

  // Expand/collapse works list inside overlay
  if (expandBtn && overlayWorksList) {
    expandBtn.addEventListener('click', () => {
      const isOpen = expandBtn.getAttribute('aria-expanded') === 'true';
      expandBtn.setAttribute('aria-expanded', String(!isOpen));
      expandBtn.classList.toggle('open', !isOpen);
      overlayWorksList.hidden = isOpen;

      if (!worksListLoaded && !isOpen) {
        worksListLoaded = true;
        fetch('./works.html')
          .then(r => r.text())
          .then(html => {
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const works = doc.querySelectorAll('.work');
            const byYear = {};
            works.forEach(w => {
              const yr = w.getAttribute('data-year');
              const id = w.getAttribute('id');
              const titleEl = w.querySelector('h2');
              const title = titleEl ? titleEl.textContent.trim() : '';
              if (!byYear[yr]) byYear[yr] = [];
              byYear[yr].push({ id, title });
            });
            overlayWorksList.innerHTML = Object.keys(byYear)
              .sort((a, b) => b - a)
              .map(yr => `
                <li class="overlay-year-row">
                  <span class="overlay-year">${yr}</span>
                  <div class="overlay-titles">
                    ${byYear[yr].map(w => `<a href="./works.html#${w.id}">${w.title}</a>`).join('')}
                  </div>
                </li>
              `).join('');
          })
          .catch(err => console.error('Error loading works for overlay:', err));
      }
    });
  }

  // --- Works page: "Work ▲/▼" toggle ---
  if (worksBtn && drawerContent && document.body.classList.contains('works-body')) {
    worksBtn.addEventListener('click', () => {
      if (!isMobile()) return;
      const isOpen = drawerContent.classList.contains('open');
      if (isOpen) {
        drawerContent.classList.remove('open');
        if (worksArrow) worksArrow.innerHTML = '&#9660;';
      } else {
        openWorksDrawer();
      }
    });

    // Auto-close drawer when a work is selected
    drawerContent.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        if (isMobile()) {
          drawerContent.classList.remove('open');
          if (worksArrow) worksArrow.innerHTML = '&#9660;';
        }
      });
    });

    // If drawer was auto-opened on page load (no hash), sync the arrow
    if (drawerContent.classList.contains('open') && worksArrow) {
      worksArrow.innerHTML = '&#9650;';
    }
  }
});