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
      const year = section.getAttribute('data-year');
      openYears.forEach(g => {
        if (g.dataset.year === year) {
          g.classList.add('open');
          const btn = g.previousElementSibling;
          if (btn && btn.matches('.year-toggle')) btn.setAttribute('aria-expanded', 'true');
        }
      });
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
  const worksSections = document.querySelectorAll('.content .work');

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
        worksSections.forEach(sec => sec.classList.add('hidden'));
        targetEl.classList.remove('hidden');
      }

      const topbarHeight = topbar ? topbar.offsetHeight : 0;
      const extraSpacing = 20; // breathing room below the header
      const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - (topbarHeight + extraSpacing);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      history.replaceState(null, '', '#' + targetId);
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

  // Ensure latest year is open by default
  if (yearGroups.length) {
    const first = yearGroups[0];
    first.classList.add('open');
    const btn = first.previousElementSibling;
    if (btn && btn.matches('.year-toggle')) btn.setAttribute('aria-expanded', 'true');
  }

  // On works page initial state: hide all works
  if (worksSections.length) {
    worksSections.forEach(sec => sec.classList.add('hidden'));
  }
});