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


async function loadEvents() {
  try {
    const params = new URLSearchParams({
      title: new URLSearchParams(window.location.search).get('title') || '',
      venue: new URLSearchParams(window.location.search).get('venue') || '',
      category: new URLSearchParams(window.location.search).get('category') || ''
    });

    const response = await fetch('/api/events?' + params.toString());
    if (!response.ok) throw new Error('Network response was not ok');

    const events = await response.json();

    const container = document.getElementById('event-list');
    container.innerHTML = '';

    if (events.length === 0) {
      container.innerHTML = '<p>No events found.</p>';
      return;
    }

    events.forEach(event => {
      const eventCard = document.createElement('div');
      eventCard.className = 'category-card';
      eventCard.onclick = () => window.location.href = `/event/${event._id}`;

      eventCard.innerHTML = `
        <img src="${event.image ? (event.image.includes('/uploads/') ? event.image.replace('/uploads/', '/') : event.image) : '/uploads/events/default-event.png'}" 
          alt="${event.title}" />
        <p>${event.title}</p>
      `;

      container.appendChild(eventCard);
    });
  } catch (error) {
    console.error('Error loading events:', error);
  }
}

// Load events on page load
window.addEventListener('DOMContentLoaded', loadEvents);
