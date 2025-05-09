// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    const sections = document.querySelectorAll('.dashboard-section');
    
    // Fix for horizontal scrolling in tables
    function setupResponsiveTables() {
        const tables = document.querySelectorAll('.admin-table');
        tables.forEach(table => {
            const tableContainer = table.closest('.table-container');
            if (tableContainer) {
                // Ensure the container can properly handle overflow
                tableContainer.style.overflowX = 'auto';
                tableContainer.style.maxWidth = '100%';
            }
        });
    }
    
    // Initialize responsive tables
    setupResponsiveTables();
    
    // Handle window resize to recalculate table containers
    window.addEventListener('resize', function() {
        setupResponsiveTables();
    });
    
    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            if (sectionId) {
                // Update active sidebar item
                sidebarItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Show selected section
                sections.forEach(section => {
                    if (section.id === sectionId) {
                        section.classList.add('active');
                    } else {
                        section.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Fetch and display users
    function fetchUsers() {
        fetch('/admin/users')
            .then(response => response.json())
            .then(users => {
                displayUsers(users);
            })
            .catch(error => console.error('Error fetching users:', error));
    }
    
    function displayUsers(users) {
        const tableBody = document.querySelector('#users table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user._id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role || 'User'}</td>
                <td>
                    <button class="btn btn-secondary edit-user" data-id="${user._id}">Edit</button>
                    <button class="btn btn-danger delete-user" data-id="${user._id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Add event listeners for edit and delete buttons
        addUserEventListeners();
    }
    
    function addUserEventListeners() {
        // Edit user
        document.querySelectorAll('.edit-user').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                // Implement edit user functionality
                alert(`Edit user with ID: ${userId}`);
            });
        });
        
        // Delete user
        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', function() {
                const userId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this user?')) {
                    fetch(`/admin/users/${userId}`, {
                        method: 'DELETE',
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        fetchUsers();
                    })
                    .catch(error => console.error('Error deleting user:', error));
                }
            });
        });
    }
    
    // Fetch and display events
    function fetchEvents() {
        fetch('/admin/events')
            .then(response => response.json())
            .then(events => {
                displayEvents(events);
            })
            .catch(error => console.error('Error fetching events:', error));
    }
    
    function displayEvents(events) {
        const tableBody = document.querySelector('#events table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        events.forEach(event => {
            const row = document.createElement('tr');
            const status = event.isActive ? 'status-verified' : 'status-pending';
            const statusText = event.isActive ? 'Active' : 'Pending';
              row.innerHTML = `
                <td>${event._id}</td>
                <td>${event.title}</td>
                <td>${event.organizerId?.organizationName || 'Unknown'}</td>
                <td>${new Date(event.startDateTime).toLocaleDateString()}</td>
                <td>${event.venue || 'TBD'}</td>
                <td><span class="status-badge ${status}">${statusText}</span></td>
                <td>
                    <button class="btn btn-secondary view-event" data-id="${event._id}">View</button>
                    <button class="btn btn-danger delete-event" data-id="${event._id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Add event listeners for view and delete buttons
        addEventEventListeners();
    }
    
    function addEventEventListeners() {
        // View event
        document.querySelectorAll('.view-event').forEach(button => {
            button.addEventListener('click', function() {
                const eventId = this.getAttribute('data-id');
                // Redirect to event page
                window.location.href = `/event/${eventId}`;
            });
        });
        
        // Delete event
        document.querySelectorAll('.delete-event').forEach(button => {
            button.addEventListener('click', function() {
                const eventId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this event?')) {
                    // Implement delete event functionality
                    alert(`Delete event with ID: ${eventId}`);
                }
            });
        });
    }
    
    // Fetch and display organizers
    function fetchOrganizers() {
        fetch('/admin/organizers')
            .then(response => response.json())
            .then(organizers => {
                displayOrganizers(organizers);
            })
            .catch(error => console.error('Error fetching organizers:', error));
    }
    
    function displayOrganizers(organizers) {
        const tableBody = document.querySelector('#organizers table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        organizers.forEach(org => {
            const row = document.createElement('tr');
            const status = org.verified ? 'status-verified' : 'status-pending';
            const statusText = org.verified ? 'Verified' : 'Pending';
            
            row.innerHTML = `
                <td>${org._id}</td>
                <td>${org.organizationName}</td>
                <td>${org.userId?.name || 'Unknown'}</td>
                <td>${org.contactNo}</td>
                <td><span class="status-badge ${status}">${statusText}</span></td>
                <td>
                    <button class="btn btn-secondary view-organizer" data-id="${org._id}">View</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        // Add event listeners for view buttons
        addOrganizerEventListeners();
    }
    
    function addOrganizerEventListeners() {
        const modal = document.getElementById('organizerModal');
        if (!modal) return;
        
        // View organizer
        document.querySelectorAll('.view-organizer').forEach(button => {
            button.addEventListener('click', function() {
                const orgId = this.getAttribute('data-id');
                
                // Fetch organizer details
                fetch(`/admin/organizers/${orgId}`)
                    .then(response => response.json())
                    .then(org => {
                        // Populate modal with organizer details
                        document.getElementById('org-name').textContent = org.organizationName;
                        document.getElementById('org-contact').textContent = org.userId?.name || 'Unknown';
                        document.getElementById('org-phone').textContent = org.contactNo;
                        document.getElementById('org-email').textContent = org.userId?.email || 'Unknown';
                        document.getElementById('org-description').textContent = org.description || 'No description available';
                        
                        // Set up action buttons
                        const verifyBtn = document.getElementById('verifyOrganizer');
                        const rejectBtn = document.getElementById('rejectOrganizer');
                        
                        if (org.verified) {
                            verifyBtn.style.display = 'none';
                            rejectBtn.textContent = 'Remove Verification';
                        } else {
                            verifyBtn.style.display = 'block';
                            rejectBtn.textContent = 'Reject';
                        }
                        
                        // Store organizer ID in buttons for later use
                        verifyBtn.setAttribute('data-id', org._id);
                        rejectBtn.setAttribute('data-id', org._id);
                        
                        // Show modal
                        modal.style.display = 'flex';
                    })
                    .catch(error => console.error('Error fetching organizer details:', error));
            });
        });
        
        // Close modal
        document.querySelectorAll('.close-modal, #closeModal').forEach(button => {
            button.addEventListener('click', function() {
                modal.style.display = 'none';
            });
        });
        
        // Verify organizer
        const verifyBtn = document.getElementById('verifyOrganizer');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', function() {
                const orgId = this.getAttribute('data-id');
                
                fetch(`/admin/organizers/${orgId}/verify`, {
                    method: 'PUT',
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    modal.style.display = 'none';
                    fetchOrganizers();
                })
                .catch(error => console.error('Error verifying organizer:', error));
            });
        }
        
        // Reject organizer
        const rejectBtn = document.getElementById('rejectOrganizer');
        if (rejectBtn) {
            rejectBtn.addEventListener('click', function() {
                const orgId = this.getAttribute('data-id');
                
                if (confirm('Are you sure you want to reject this organizer?')) {
                    fetch(`/admin/organizers/${orgId}/reject`, {
                        method: 'PUT',
                    })
                    .then(response => response.json())
                    .then(data => {
                        alert(data.message);
                        modal.style.display = 'none';
                        fetchOrganizers();
                    })
                    .catch(error => console.error('Error rejecting organizer:', error));
                }
            });
        }
    }
    
    // Search functionality
    const userSearchInput = document.getElementById('user-search');
    if (userSearchInput) {
        userSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#users table tbody tr');
            
            rows.forEach(row => {
                const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const email = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || email.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    const eventSearchInput = document.getElementById('event-search');
    if (eventSearchInput) {
        eventSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#events table tbody tr');
            
            rows.forEach(row => {
                const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const organizer = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || organizer.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    const organizerSearchInput = document.getElementById('organizer-search');
    if (organizerSearchInput) {
        organizerSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#organizers table tbody tr');
            
            rows.forEach(row => {
                const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const contact = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || contact.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Load initial data when dashboard is opened
    const organizersTab = document.querySelector('[data-section="organizers"]');
    if (organizersTab) {
        organizersTab.addEventListener('click', fetchOrganizers);
    }
    
    const usersTab = document.querySelector('[data-section="users"]');
    if (usersTab) {
        usersTab.addEventListener('click', fetchUsers);
    }
    
    const eventsTab = document.querySelector('[data-section="events"]');
    if (eventsTab) {
        eventsTab.addEventListener('click', fetchEvents);
    }
    
    // Initialize dashboard data
    if (document.querySelector('#dashboard.active')) {
        // Fetch summary data for dashboard if needed
    }
});
