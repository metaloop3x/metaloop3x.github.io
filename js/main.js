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
  const sections = document.querySelectorAll('.work');
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

      const topbarHeight = topbar ? topbar.offsetHeight : 0;
      const extraSpacing = 20; // breathing room below the header
      const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - (topbarHeight + extraSpacing);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      history.replaceState(null, '', '#' + targetId);

      // Auto-close mobile sidebar drawer
      if (sidebarDrawer && sidebarDrawer.classList.contains('open')) {
        sidebarDrawer.classList.remove('open');
        if (sidebarDrawerBtn) sidebarDrawerBtn.setAttribute('aria-expanded', 'false');
      }
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

  // Mobile: sidebar drawer toggle
  if (sidebarDrawerBtn && sidebarDrawer) {
    sidebarDrawerBtn.addEventListener('click', function() {
      const open = sidebarDrawer.classList.toggle('open');
      sidebarDrawerBtn.setAttribute('aria-expanded', String(open));
    });
  }

  // Ensure latest year is open by default (works page only) or show hash selection
  if (document.body.classList.contains('works-body') && yearGroups.length) {
    const hash = window.location.hash ? window.location.hash.slice(1) : '';
    if (hash) {
      showWorkById(hash);
    } else {
      const first = yearGroups[0];
      first.classList.add('open');
      const btn = first.previousElementSibling;
      if (btn && btn.matches('.year-toggle')) btn.setAttribute('aria-expanded', 'true');
    }
  }

  // On works page initial state: hide all works, unless a hash is present
  if (document.body.classList.contains('works-body') && worksSections.length) {
    const hash = window.location.hash ? window.location.hash.slice(1) : '';
    worksSections.forEach(sec => sec.classList.add('hidden'));
    if (hash) showWorkById(hash);
  }
});