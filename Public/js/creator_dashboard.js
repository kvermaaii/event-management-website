document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const navItems = document.querySelectorAll('.sidebar-nav li[data-section]');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav item
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section, hide others
            sections.forEach(section => {
                if (section.id === targetSection) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });
    
    // Event filters functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventRows = document.querySelectorAll('.event-table tbody tr');
    
    if (filterButtons.length > 0 && eventRows.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active filter button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter event rows
                eventRows.forEach(row => {
                    const status = row.querySelector('.status-badge').textContent.trim().toLowerCase();
                    
                    if (filter === 'all') {
                        row.style.display = '';
                    } else if (status.includes(filter)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Event Carousel
    let currentIndex = 0;
    const items = document.querySelectorAll('.carousel-item');
    
    function moveCarousel(direction) {
        const container = document.querySelector('.carousel-container');
        const itemCount = items.length;
        
        if (itemCount <= 1) return;
        
        currentIndex = (currentIndex + direction + itemCount) % itemCount;
        container.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    
    // Set up carousel controls
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => moveCarousel(-1));
        nextBtn.addEventListener('click', () => moveCarousel(1));
    }
    
    // Event handlers for buttons
    // Create event button
    const createBtn = document.querySelector('.create-event-btn');
    if (createBtn) {
        createBtn.addEventListener('click', function() {
            window.location.href = '/events/create-event';
        });
    }
    
    // Edit buttons
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const eventId = this.getAttribute('data-id');
            window.location.href = `/event/edit/${eventId}`;
        });
    });
    
    // Delete buttons
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const eventId = this.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this event?')) {
                fetch(`/event/${eventId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Event deleted successfully');
                        window.location.reload();
                    } else {
                        alert('Failed to delete event');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while deleting the event');
                });
            }
        });
    });

    // Profile form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(profileForm);
            const profileData = {
                name: formData.get('name'),
                organization: formData.get('organization'),
                phone: formData.get('phone'),
                website: formData.get('website')
            };
            
            // Send data to server (AJAX request)
            fetch('/organizer/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Profile updated successfully!', 'success');
                    // Update displayed name if needed
                    const nameElement = document.querySelector('.user-info h3');
                    if (nameElement && profileData.name) {
                        nameElement.textContent = profileData.name;
                    }
                } else {
                    showNotification(data.message || 'Failed to update profile. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred. Please try again later.', 'error');
            });
        });
    }

    // Password change form submission
    const passwordForm = document.getElementById('password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(passwordForm);
            const currentPassword = formData.get('currentPassword');
            const newPassword = formData.get('newPassword');
            const confirmPassword = formData.get('confirmPassword');
            
            // Validate passwords
            if (newPassword !== confirmPassword) {
                showNotification('New passwords do not match!', 'error');
                return;
            }
            
            // Send data to server
            fetch('/organizer/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Password updated successfully!', 'success');
                    passwordForm.reset();
                } else {
                    showNotification(data.message || 'Failed to update password. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred. Please try again later.', 'error');
            });
        });
    }

    // Notification function
    function showNotification(message, type) {
        // Check if notification container exists, create if not
        let notificationContainer = document.getElementById('notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '1000';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.backgroundColor = type === 'success' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)';
        notification.style.color = 'white';
        notification.style.padding = '12px 20px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        notification.style.transition = 'all 0.3s ease';
        notification.textContent = message;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notificationContainer.removeChild(notification);
            }, 300);
        }, 3000);
    }
});
