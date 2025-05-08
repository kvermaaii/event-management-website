// filepath: d:\FFSD Project\event-management-website\public\js\home.js

// Accordion functionality
document.addEventListener('DOMContentLoaded', function () {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', function () {
      const accordionItem = this.parentElement;
      const isActive = accordionItem.classList.contains('active');

      // Close all accordion items
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.classList.remove('active');
      });

      // If the clicked item wasn't active, make it active
      if (!isActive) {
        accordionItem.classList.add('active');
      }
    });
  });

  // Auto-submit form on input change
  const searchForm = document.querySelector('.search-container form');
  if (searchForm) {
    const formInputs = searchForm.querySelectorAll('input, select');
    
    formInputs.forEach(input => {
      input.addEventListener('change', function() {
        searchForm.submit();
      });
    });
  }
});