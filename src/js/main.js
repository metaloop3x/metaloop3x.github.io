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
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

// Enhanced sidebar navigation highlighting
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.work');
    const navLinks = document.querySelectorAll('.sidebar a:not(.year)');
    const yearLabels = document.querySelectorAll('.sidebar .year');
    
    let current = '';
    let currentYear = '';
    
    // Find current section
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
            // Determine current year based on project
            const currentSection = document.getElementById(current);
            if (currentSection) {
                currentYear = currentSection.getAttribute('data-year') || '';
            }
        }
    });

    // Reset all links and years to grey
    navLinks.forEach(link => {
        link.classList.remove('active');
        link.style.color = '#666';
    });
    
    yearLabels.forEach(year => {
        year.style.color = '#666';
    });

    // Highlight current project in black
    navLinks.forEach(link => {
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
            link.style.color = '#000';
        }
    });
    
    // Highlight current year in black
    yearLabels.forEach(year => {
        if (year.textContent === currentYear) {
            year.style.color = '#000';
        }
    });
}); 

// Smooth scroll for sidebar links with correct offset for sticky topbar
window.addEventListener('DOMContentLoaded', function() {
  const sidebarAnchors = document.querySelectorAll('.sidebar a[href^="#"]');
  const topbar = document.querySelector('.topbar');

  sidebarAnchors.forEach(anchor => {
    anchor.addEventListener('click', function(event) {
      const targetId = this.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) {
        return;
      }
      event.preventDefault();
      const topbarHeight = topbar ? topbar.offsetHeight : 0;
      const extraSpacing = 20; // breathing room below the header
      const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - (topbarHeight + extraSpacing);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
      history.replaceState(null, '', '#' + targetId);
    });
  });
});