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
            // Save account details
            saveAccountDetails();
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

// Save account details to localStorage
function saveAccountDetails() {
    const accountData = {
        id: generateAccountId(),
        accountType: document.querySelector('input[name="accountType"]:checked').value,
        title: document.getElementById('title').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        occupation: document.getElementById('occupation').value,
        income: document.getElementById('income').value,
        initialDeposit: document.getElementById('initialDeposit').value,
        purpose: document.getElementById('purpose').value,
        timestamp: new Date().toISOString(),
        status: 'Pending Review'
    };

    // Get existing accounts from localStorage
    let savedAccounts = JSON.parse(localStorage.getItem('standardCharteredAccounts')) || [];
    
    // Add new account
    savedAccounts.push(accountData);
    
    // Save back to localStorage
    localStorage.setItem('standardCharteredAccounts', JSON.stringify(savedAccounts));
    
    // Display the saved accounts
    displaySavedAccounts();
}

// Generate unique account ID
function generateAccountId() {
    return 'SC' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// Display saved accounts
function displaySavedAccounts() {
    const savedAccounts = JSON.parse(localStorage.getItem('standardCharteredAccounts')) || [];
    const accountsContainer = document.getElementById('savedAccountsContainer');
    
    if (savedAccounts.length === 0) {
        accountsContainer.innerHTML = '<p class="text-muted text-center">No accounts registered yet.</p>';
        return;
    }

    let accountsHTML = '';
    savedAccounts.forEach((account, index) => {
        const accountTypeIcon = account.accountType === 'personal' ? 'fa-user' : 'fa-building';
        const statusColor = account.status === 'Pending Review' ? 'warning' : 'success';
        
        accountsHTML += `
            <div class="col-md-6 mb-4">
                <div class="card border-0 shadow-sm account-card">
                    <div class="card-header bg-light d-flex justify-content-between align-items-center">
                        <div>
                            <i class="fas ${accountTypeIcon} text-success me-2"></i>
                            <strong>Account ID: ${account.id}</strong>
                        </div>
                        <span class="badge bg-${statusColor}">${account.status}</span>
                    </div>
                    <div class="card-body">
                        <div class="row g-2">
                            <div class="col-12">
                                <h6 class="text-success mb-2">Personal Information</h6>
                                <p class="mb-1"><strong>Name:</strong> ${account.title} ${account.firstName} ${account.lastName}</p>
                                <p class="mb-1"><strong>Email:</strong> ${account.email}</p>
                                <p class="mb-1"><strong>Phone:</strong> ${account.phone}</p>
                                <p class="mb-2"><strong>Address:</strong> ${account.address}, ${account.city}, ${account.state} ${account.zipCode}</p>
                            </div>
                            <div class="col-12">
                                <h6 class="text-success mb-2">Account Details</h6>
                                <p class="mb-1"><strong>Type:</strong> ${account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} Account</p>
                                <p class="mb-1"><strong>Purpose:</strong> ${account.purpose.charAt(0).toUpperCase() + account.purpose.slice(1)}</p>
                                <p class="mb-1"><strong>Initial Deposit:</strong> $${parseFloat(account.initialDeposit).toLocaleString()}</p>
                                <p class="mb-1"><strong>Occupation:</strong> ${account.occupation}</p>
                                <p class="mb-2"><strong>Income Range:</strong> ${getIncomeRangeText(account.income)}</p>
                            </div>
                            <div class="col-12">
                                <small class="text-muted">Applied on: ${new Date(account.timestamp).toLocaleDateString()}</small>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <div class="d-flex gap-2">
                            <button class="btn btn-sm btn-outline-success" onclick="viewAccountDetails(${index})">
                                <i class="fas fa-eye me-1"></i>View Details
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="deleteAccount(${index})">
                                <i class="fas fa-trash me-1"></i>Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    accountsContainer.innerHTML = accountsHTML;
    
    // Update accounts count
    document.getElementById('accountsCount').textContent = savedAccounts.length;
}

// Get income range text
function getIncomeRangeText(incomeValue) {
    const incomeRanges = {
        'under25k': 'Under $25,000',
        '25k-50k': '$25,000 - $50,000',
        '50k-100k': '$50,000 - $100,000',
        '100k-250k': '$100,000 - $250,000',
        'over250k': 'Over $250,000'
    };
    return incomeRanges[incomeValue] || incomeValue;
}

// View account details in modal
function viewAccountDetails(index) {
    const savedAccounts = JSON.parse(localStorage.getItem('standardCharteredAccounts')) || [];
    const account = savedAccounts[index];
    
    if (!account) return;
    
    const modalHTML = `
        <div class="modal fade" id="accountDetailsModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">Account Details - ${account.id}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <h6 class="text-success">Personal Information</h6>
                                <table class="table table-sm">
                                    <tr><td><strong>Name:</strong></td><td>${account.title} ${account.firstName} ${account.lastName}</td></tr>
                                    <tr><td><strong>Email:</strong></td><td>${account.email}</td></tr>
                                    <tr><td><strong>Phone:</strong></td><td>${account.phone}</td></tr>
                                    <tr><td><strong>Address:</strong></td><td>${account.address}</td></tr>
                                    <tr><td><strong>City:</strong></td><td>${account.city}</td></tr>
                                    <tr><td><strong>State:</strong></td><td>${account.state}</td></tr>
                                    <tr><td><strong>ZIP Code:</strong></td><td>${account.zipCode}</td></tr>
                                </table>
                            </div>
                            <div class="col-md-6">
                                <h6 class="text-success">Financial Information</h6>
                                <table class="table table-sm">
                                    <tr><td><strong>Account Type:</strong></td><td>${account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}</td></tr>
                                    <tr><td><strong>Purpose:</strong></td><td>${account.purpose.charAt(0).toUpperCase() + account.purpose.slice(1)}</td></tr>
                                    <tr><td><strong>Occupation:</strong></td><td>${account.occupation}</td></tr>
                                    <tr><td><strong>Income:</strong></td><td>${getIncomeRangeText(account.income)}</td></tr>
                                    <tr><td><strong>Initial Deposit:</strong></td><td>$${parseFloat(account.initialDeposit).toLocaleString()}</td></tr>
                                    <tr><td><strong>Status:</strong></td><td><span class="badge bg-warning">${account.status}</span></td></tr>
                                    <tr><td><strong>Applied:</strong></td><td>${new Date(account.timestamp).toLocaleString()}</td></tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-success" onclick="window.print()">Print Details</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('accountDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('accountDetailsModal'));
    modal.show();
}

// Delete account
function deleteAccount(index) {
    if (confirm('Are you sure you want to delete this account application?')) {
        let savedAccounts = JSON.parse(localStorage.getItem('standardCharteredAccounts')) || [];
        savedAccounts.splice(index, 1);
        localStorage.setItem('standardCharteredAccounts', JSON.stringify(savedAccounts));
        displaySavedAccounts();
    }
}

// Success message
function showSuccessMessage() {
    const formContainer = document.querySelector('.card');
    const savedAccounts = JSON.parse(localStorage.getItem('standardCharteredAccounts')) || [];
    const latestAccount = savedAccounts[savedAccounts.length - 1];
    
    formContainer.innerHTML = `
        <div class="card-body text-center p-5">
            <div class="mb-4">
                <i class="fas fa-check-circle fa-5x text-success"></i>
            </div>
            <h2 class="text-success mb-3">Application Submitted Successfully!</h2>
            <p class="lead mb-4">Thank you for choosing Standard Chartered. Your account application has been received and is being processed.</p>
            <div class="alert alert-success">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Account ID:</strong> ${latestAccount.id}<br>
                <strong>Account Type:</strong> ${latestAccount.accountType.charAt(0).toUpperCase() + latestAccount.accountType.slice(1)} Account<br>
                <strong>Initial Deposit:</strong> $${parseFloat(latestAccount.initialDeposit).toLocaleString()}
            </div>
            <div class="alert alert-info">
                <i class="fas fa-clock me-2"></i>
                You will receive a confirmation email within 24 hours with next steps.
            </div>
            <div class="d-grid gap-2 col-md-6 mx-auto">
                <button class="btn btn-success btn-lg" onclick="location.reload()">
                    <i class="fas fa-plus me-2"></i>Register Another Account
                </button>
                <a href="index.html" class="btn btn-outline-success btn-lg">
                    <i class="fas fa-home me-2"></i>Return to Home
                </a>
                <button class="btn btn-outline-success" onclick="window.print()">
                    <i class="fas fa-print me-2"></i>Print Confirmation
                </button>
            </div>
        </div>
    `;
}

// Load saved accounts on page load
document.addEventListener('DOMContentLoaded', function() {
    // Display saved accounts if container exists
    if (document.getElementById('savedAccountsContainer')) {
        displaySavedAccounts();
    }
});