// Simple testimonial code for beginners
let testimonials = []; // Array to store all testimonials

// When page loads, run this code
document.addEventListener('DOMContentLoaded', function() {
    // Get the submit button
    const submitButton = document.getElementById('submitTestimonial');
    
    // When submit button is clicked
    submitButton.addEventListener('click', function() {
        if (checkForm()) {
            saveTestimonial();
        }
    });
});

// Check if form is filled correctly
function checkForm() {
    // Get form values
    const name = document.getElementById('customerName').value;
    const location = document.getElementById('customerLocation').value;
    const title = document.getElementById('customerTitle').value;
    const rating = document.querySelector('input[name="rating"]:checked');
    const message = document.getElementById('testimonialText').value;
    const agree = document.getElementById('publishConsent').checked;
    
    // Check if all fields are filled
    if (!name || !location || !title || !rating || !message || !agree) {
        alert('Please fill all fields!');
        return false;
    }
    return true;
}

// Save testimonial
function saveTestimonial() {
    // Get form data
    const name = document.getElementById('customerName').value;
    const location = document.getElementById('customerLocation').value;
    const title = document.getElementById('customerTitle').value;
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const message = document.getElementById('testimonialText').value;
    
    if (editingId) {
        // We're editing an existing testimonial
        updateExistingTestimonial(editingId, name, location, title, rating, message);
    } else {
        // We're creating a new testimonial
        createNewTestimonial(name, location, title, rating, message);
    }
    
    // Clear form and close modal
    clearForm();
    closeModal();
    resetEditMode();
}

// Create new testimonial
function createNewTestimonial(name, location, title, rating, message) {
    const testimonial = {
        id: Date.now(), // Simple ID using timestamp
        name: name,
        location: location,
        title: title,
        rating: rating,
        message: message,
        date: new Date().toLocaleDateString()
    };
    
    // Add to testimonials array
    testimonials.push(testimonial);
    
    // Show on page
    showTestimonial(testimonial);
    
    alert('Thank you! Your testimonial has been added.');
}

// Update existing testimonial
function updateExistingTestimonial(id, name, location, title, rating, message) {
    // Find and update testimonial in array
    const index = testimonials.findIndex(t => t.id === id);
    if (index !== -1) {
        testimonials[index].name = name;
        testimonials[index].location = location;
        testimonials[index].title = title;
        testimonials[index].rating = rating;
        testimonials[index].message = message;
        
        // Remove old display
        const oldElement = document.getElementById(`testimonial-${id}`);
        if (oldElement) {
            oldElement.remove();
        }
        
        // Show updated testimonial
        showTestimonial(testimonials[index]);
        
        alert('Your testimonial has been updated!');
    }
}

// Reset edit mode
function resetEditMode() {
    editingId = null;
    const submitButton = document.getElementById('submitTestimonial');
    submitButton.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit Testimonial';
}

// Show testimonial on page
function showTestimonial(testimonial) {
    // Get first letters of name for avatar
    const initials = testimonial.name.split(' ').map(word => word[0]).join('');
    
    // Create stars
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= testimonial.rating) {
            stars += '<i class="fas fa-star text-warning"></i>';
        } else {
            stars += '<i class="far fa-star text-warning"></i>';
        }
    }
    
    // Create HTML for testimonial
    const html = `
        <div class="col-lg-4 col-md-6" id="testimonial-${testimonial.id}">
            <div class="card h-100 border-0 shadow-sm testimonial-card">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between mb-3">
                        <div>${stars}</div>
                        <div>
                            <button class="btn btn-sm btn-outline-primary me-1" onclick="editTestimonial(${testimonial.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteTestimonial(${testimonial.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <p class="card-text mb-4">"${testimonial.message}"</p>
                    <div class="d-flex align-items-center">
                        <img src="https://via.placeholder.com/60x60/00A651/FFFFFF?text=${initials}" 
                             alt="Customer" class="rounded-circle me-3" width="60" height="60">
                        <div>
                            <h6 class="mb-0">${testimonial.name}</h6>
                            <small class="text-muted">${testimonial.title}, ${testimonial.location}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add to page
    const container = document.querySelector('.testimonials-bg .row.g-4');
    container.insertAdjacentHTML('afterbegin', html);
}

// Edit testimonial
let editingId = null; // Keep track of which testimonial we're editing

function editTestimonial(id) {
    // Find testimonial
    const testimonial = testimonials.find(t => t.id === id);
    if (!testimonial) return;
    
    // Remember we're editing this testimonial
    editingId = id;
    
    // Fill form with existing data
    document.getElementById('customerName').value = testimonial.name;
    document.getElementById('customerLocation').value = testimonial.location;
    document.getElementById('customerTitle').value = testimonial.title;
    document.getElementById('testimonialText').value = testimonial.message;
    
    // Set rating
    const ratingInput = document.querySelector(`input[name="rating"][value="${testimonial.rating}"]`);
    if (ratingInput) ratingInput.checked = true;
    
    // Change submit button text
    const submitButton = document.getElementById('submitTestimonial');
    submitButton.innerHTML = '<i class="fas fa-save me-2"></i>Update Testimonial';
    
    // Open modal
    const modal = new bootstrap.Modal(document.getElementById('testimonialModal'));
    modal.show();
}

// Delete testimonial
function deleteTestimonial(id) {
    if (confirm('Are you sure you want to delete this testimonial?')) {
        // Remove from array
        testimonials = testimonials.filter(t => t.id !== id);
        
        // Remove from page
        const element = document.getElementById(`testimonial-${id}`);
        if (element) {
            element.remove();
        }
    }
}

// Clear form
function clearForm() {
    document.getElementById('customerName').value = '';
    document.getElementById('customerLocation').value = '';
    document.getElementById('customerTitle').value = '';
    document.getElementById('testimonialText').value = '';
    document.getElementById('publishConsent').checked = false;
    
    // Clear rating
    const ratings = document.querySelectorAll('input[name="rating"]');
    ratings.forEach(rating => rating.checked = false);
    
    // Reset edit mode
    resetEditMode();
}

// Close modal
function closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('testimonialModal'));
    if (modal) {
        modal.hide();
    }
}