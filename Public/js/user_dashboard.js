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
                    
                    // If the profile section is clicked, load profile data from the server
                    if (targetSection === 'profile') {
                        // Fetch the profile data from the /user/profile endpoint
                        fetch('/user/profile')
                            .then(response => response.json())
                            .then(data => {
                                if (data.success && data.user) {
                                    // Update form fields with the user data
                                    document.getElementById('name').value = data.user.name || '';
                                    document.getElementById('email').value = data.user.email || '';
                                    
                                    // Handle optional fields
                                    if (document.getElementById('phone')) {
                                        document.getElementById('phone').value = data.user.phone || '';
                                    }
                                    if (document.getElementById('username')) {
                                        document.getElementById('username').value = data.user.username || 
                                            (data.user.name ? data.user.name.replace(/\s+/g, '').toLowerCase() : '');
                                    }
                                } else {
                                    console.error('Failed to load profile data');
                                }
                            })
                            .catch(error => {
                                console.error('Error fetching profile data:', error);
                            });
                    }
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });
    
    // Booking filters functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const bookingCards = document.querySelectorAll('.booking-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter booking cards
            bookingCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    if (card.classList.contains(filter)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });    // Profile update form submission
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(profileForm);
            const profileData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                username: formData.get('username')
            };
            
            // Send data to server (AJAX request)
            fetch('/user/profile', {
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
                    // Reload page to reflect the changes
                    setTimeout(() => {
                        location.reload();
                    }, 2000);
                } else {
                    showNotification(data.message || 'Failed to update profile. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred. Please try again later.', 'error');
            });
        });
    }    // Password change form submission
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
            
            if (newPassword.length < 8) {
                showNotification('Password must be at least 8 characters long!', 'error');
                return;
            }
              // Send data to server (AJAX request)
            fetch('/user/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmPassword
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Password changed successfully!', 'success');
                    passwordForm.reset(); // Clear form
                } else {
                    showNotification(data.message || 'Failed to change password.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred. Please try again later.', 'error');
            });
        });
    }
    
    // Email update form submission
    const emailForm = document.getElementById('email-form');
    if (emailForm) {
        // Populate the current email field when the profile section is loaded
        document.querySelector('.sidebar-nav li[data-section="profile"]').addEventListener('click', function() {
            fetch('/user/profile')
                .then(response => response.json())
                .then(data => {
                    if (data.success && data.user) {
                        document.getElementById('currentEmail').value = data.user.email || '';
                    }
                })
                .catch(error => {
                    console.error('Error fetching email:', error);
                });
        });

        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(emailForm);
            const newEmail = formData.get('newEmail');
            const password = formData.get('emailPassword');
            
            // Validate email format
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(newEmail)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Send data to server (AJAX request)
            fetch('/user/update-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newEmail,
                    password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Email updated successfully!', 'success');
                    emailForm.reset(); // Clear form
                    
                    // Update the displayed email in currentEmail field
                    document.getElementById('currentEmail').value = newEmail;
                    // Also update it in the main profile form
                    document.getElementById('email').value = newEmail;
                } else {
                    showNotification(data.message || 'Failed to update email.', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('An error occurred. Please try again later.', 'error');
            });
        });
    }
    
    // View booking details functionality
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get booking card parent
            const bookingCard = this.closest('.booking-card');
            const eventName = bookingCard.querySelector('.booking-header h3').textContent;
            
            // In a real implementation, you'd fetch detailed data from the server
            // For now, we'll just show an alert
            alert(`Viewing details for "${eventName}"`);
            
            // In a real implementation, you might open a modal with detailed information
            // or navigate to a detailed view page
        });
    });
    
    // Cancel booking functionality
    const cancelButtons = document.querySelectorAll('.cancel-booking');
    cancelButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to cancel this booking?')) {
                // Get booking card
                const bookingCard = this.closest('.booking-card');
                const eventName = bookingCard.querySelector('.booking-header h3').textContent;
                
                // In a real implementation, you'd send a request to the server
                // For now, we'll just update the UI for demonstration
                bookingCard.querySelector('.status-badge').textContent = 'cancelled';
                bookingCard.querySelector('.status-badge').className = 'status-badge cancelled';
                bookingCard.classList.add('cancelled');
                // Remove cancel button
                this.remove();
                
                showNotification(`Booking for "${eventName}" has been cancelled.`, 'success');
            }
        });
    });
    
    // Helper function to show notifications
    function showNotification(message, type) {
        // Check if notification container exists, if not create it
        let notifContainer = document.querySelector('.notification-container');
        if (!notifContainer) {
            notifContainer = document.createElement('div');
            notifContainer.className = 'notification-container';
            document.body.appendChild(notifContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add close button
        const closeBtn = document.createElement('span');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
            notification.remove();
        });
        notification.appendChild(closeBtn);
        
        // Add to container
        notifContainer.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Add notification styling dynamically
    const style = document.createElement('style');
    style.textContent = `
        .notification-container {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }
        .notification {
            background-color: white;
            border-left: 4px solid #4f46e5;
            border-radius: 4px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            color: #333;
            font-size: 14px;
            margin-bottom: 10px;
            max-width: 300px;
            padding: 12px 35px 12px 15px;
            position: relative;
        }
        .notification.success {
            border-left-color: #10b981;
        }
        .notification.error {
            border-left-color: #ef4444;
        }
        .notification.warning {
            border-left-color: #f59e0b;
        }
                .notification-close {
            cursor: pointer;
            font-size: 18px;
            position: absolute;
            right: 10px;
            top: 7px;
        }
        .fade-out {
            opacity: 0;
            transition: opacity 300ms ease-out;
        }
    `;
    document.head.appendChild(style);
});