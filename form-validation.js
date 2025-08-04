// Form validation and interactivity
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    // Password visibility toggle
    togglePassword.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });

    // Account type selection styling
    const accountTypeInputs = document.querySelectorAll('input[name="accountType"]');
    accountTypeInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Remove active class from all cards
            document.querySelectorAll('.account-type-card .card').forEach(card => {
                card.classList.remove('border-success', 'bg-light');
            });
            
            // Add active class to selected card
            if (this.checked) {
                const card = this.closest('.account-type-card').querySelector('.card');
                card.classList.add('border-success', 'bg-light');
            }
        });
    });

    // Password confirmation validation
    confirmPassword.addEventListener('input', function() {
        if (this.value !== password.value) {
            this.setCustomValidity('Passwords do not match');
        } else {
            this.setCustomValidity('');
        }
    });

    // Password strength indicator
    password.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        updatePasswordStrength(strength);
    });

    // Form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation();

        // Custom validation
        let isValid = true;

        // Check password match
        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity('Passwords do not match');
            isValid = false;
        } else {
            confirmPassword.setCustomValidity('');
        }

        // Check if account type is selected
        const accountTypeSelected = document.querySelector('input[name="accountType"]:checked');
        if (!accountTypeSelected) {
            isValid = false;
            // Add visual feedback for account type selection
            document.querySelectorAll('.account-type-card .card').forEach(card => {
                card.classList.add('border-danger');
            });
        }

        // Bootstrap validation
        if (form.checkValidity() && isValid) {
            // Show success message
            showSuccessMessage();
        } else {
            form.classList.add('was-validated');
        }
    });

    // Real-time validation for better UX
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.checkValidity()) {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
                this.classList.add('is-invalid');
            }
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('was-validated') || this.classList.contains('is-invalid')) {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            }
        });
    });
});

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

// Update password strength indicator
function updatePasswordStrength(strength) {
    const passwordInput = document.getElementById('password');
    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['danger', 'warning', 'info', 'success', 'success'];
    
    // Remove existing strength indicator
    const existingIndicator = document.querySelector('.password-strength');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    if (passwordInput.value.length > 0) {
        const indicator = document.createElement('div');
        indicator.className = `password-strength small text-${strengthColors[strength - 1] || 'danger'} mt-1`;
        indicator.innerHTML = `<i class="fas fa-shield-alt me-1"></i>Password Strength: ${strengthText[strength - 1] || 'Very Weak'}`;
        
        passwordInput.parentNode.parentNode.appendChild(indicator);
    }
}

// Success message
function showSuccessMessage() {
    const formContainer = document.querySelector('.card');
    formContainer.innerHTML = `
        <div class="card-body text-center p-5">
            <div class="mb-4">
                <i class="fas fa-check-circle fa-5x text-success"></i>
            </div>
            <h2 class="text-success mb-3">Application Submitted Successfully!</h2>
            <p class="lead mb-4">Thank you for choosing Standard Chartered. Your account application has been received and is being processed.</p>
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                You will receive a confirmation email within 24 hours with next steps.
            </div>
            <div class="d-grid gap-2 col-md-6 mx-auto">
                <a href="index.html" class="btn btn-success btn-lg">
                    <i class="fas fa-home me-2"></i>Return to Home
                </a>
                <button class="btn btn-outline-success" onclick="window.print()">
                    <i class="fas fa-print me-2"></i>Print Confirmation
                </button>
            </div>
        </div>
    `;
}