// Testimonial functionality
document.addEventListener('DOMContentLoaded', function () {
    const testimonialForm = document.getElementById('testimonialForm');
    const submitBtn = document.getElementById('submitTestimonial');
    const modal = document.getElementById('testimonialModal');
    const testimonialContainer = document.querySelector('.testimonials-bg .row.g-4');

    // Handle testimonial form submission
    submitBtn.addEventListener('click', function () {
        if (validateTestimonialForm()) {
            submitTestimonial();
        }
    });

    // Form validation
    function validateTestimonialForm() {
        const name = document.getElementById('customerName').value.trim();
        const location = document.getElementById('customerLocation').value.trim();
        const title = document.getElementById('customerTitle').value.trim();
        const rating = document.querySelector('input[name="rating"]:checked');
        const testimonialText = document.getElementById('testimonialText').value.trim();
        const consent = document.getElementById('publishConsent').checked;

        // Clear previous error states
        document.querySelectorAll('.form-control, .form-check-input').forEach(el => {
            el.classList.remove('is-invalid');
        });

        let isValid = true;

        if (!name) {
            document.getElementById('customerName').classList.add('is-invalid');
            isValid = false;
        }

        if (!location) {
            document.getElementById('customerLocation').classList.add('is-invalid');
            isValid = false;
        }

        if (!title) {
            document.getElementById('customerTitle').classList.add('is-invalid');
            isValid = false;
        }

        if (!rating) {
            document.querySelector('.rating-input').style.border = '2px solid #dc3545';
            document.querySelector('.rating-input').style.borderRadius = '5px';
            document.querySelector('.rating-input').style.padding = '5px';
            isValid = false;
        } else {
            document.querySelector('.rating-input').style.border = 'none';
        }

        if (!testimonialText) {
            document.getElementById('testimonialText').classList.add('is-invalid');
            isValid = false;
        }

        if (!consent) {
            document.getElementById('publishConsent').classList.add('is-invalid');
            isValid = false;
        }

        if (!isValid) {
            // Show error message
            showAlert('Please fill in all required fields', 'danger');
        }

        return isValid;
    }

    // Submit testimonial
    function submitTestimonial() {
        const formData = {
            name: document.getElementById('customerName').value.trim(),
            location: document.getElementById('customerLocation').value.trim(),
            title: document.getElementById('customerTitle').value.trim(),
            rating: document.querySelector('input[name="rating"]:checked').value,
            testimonial: document.getElementById('testimonialText').value.trim(),
            timestamp: new Date().toISOString()
        };

        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Submitting...';
        submitBtn.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Add testimonial to page
            addTestimonialToPage(formData);

            // Show success message
            showSuccessMessage();

            // Reset form
            testimonialForm.reset();

            // Close modal after delay
            setTimeout(() => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();

                // Reset button
                submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit Testimonial';
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    }

    // Add testimonial to page
    function addTestimonialToPage(data) {
        const initials = data.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const stars = '★'.repeat(parseInt(data.rating)) + '☆'.repeat(5 - parseInt(data.rating));

        const testimonialHTML = `
            <div class="col-lg-4 col-md-6">
                <div class="card h-100 border-0 shadow-sm testimonial-card new-testimonial">
                    <div class="card-body p-4">
                        <div class="d-flex mb-3">
                            ${Array(parseInt(data.rating)).fill('<i class="fas fa-star text-warning"></i>').join('')}
                            ${Array(5 - parseInt(data.rating)).fill('<i class="far fa-star text-warning"></i>').join('')}
                        </div>
                        <p class="card-text mb-4">"${data.testimonial}"</p>
                        <div class="d-flex align-items-center">
                            <img src="https://via.placeholder.com/60x60/00A651/FFFFFF?text=${initials}" alt="Customer" class="rounded-circle me-3" width="60" height="60">
                            <div>
                                <h6 class="mb-0">${data.name}</h6>
                                <small class="text-muted">${data.title}, ${data.location}</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add to beginning of testimonials
        testimonialContainer.insertAdjacentHTML('afterbegin', testimonialHTML);

        // Animate new testimonial
        const newTestimonial = testimonialContainer.firstElementChild;
        newTestimonial.style.opacity = '0';
        newTestimonial.style.transform = 'translateY(20px)';

        setTimeout(() => {
            newTestimonial.style.transition = 'all 0.5s ease';
            newTestimonial.style.opacity = '1';
            newTestimonial.style.transform = 'translateY(0)';
        }, 100);

        // Update customer count
        updateCustomerCount();
    }

    // Show success message in modal
    function showSuccessMessage() {
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="testimonial-success">
                <i class="fas fa-check-circle fa-4x mb-3"></i>
                <h4 class="text-success mb-3">Thank You!</h4>
                <p class="lead mb-3">Your testimonial has been submitted successfully.</p>
                <p class="text-muted">It will be reviewed and published shortly. We appreciate you sharing your experience with Standard Chartered!</p>
            </div>
        `;
    }

    // Update customer count
    function updateCustomerCount() {
        const countElement = document.querySelector('.stat-number h2');
        if (countElement && countElement.textContent.includes('10M+')) {
            // Simple increment animation
            countElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                countElement.style.transform = 'scale(1)';
            }, 300);
        }
    }

    // Show alert messages
    function showAlert(message, type) {
        const alertHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;

        const modalBody = modal.querySelector('.modal-body');
        const existingAlert = modalBody.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        modalBody.insertAdjacentHTML('afterbegin', alertHTML);
    }

    // Reset modal when closed
    modal.addEventListener('hidden.bs.modal', function () {
        testimonialForm.reset();
        document.querySelectorAll('.form-control, .form-check-input').forEach(el => {
            el.classList.remove('is-invalid');
        });
        document.querySelector('.rating-input').style.border = 'none';

        // Reset modal body if it was changed to success message
        if (modal.querySelector('.testimonial-success')) {
            location.reload(); // Simple way to reset the modal content
        }
    });
});