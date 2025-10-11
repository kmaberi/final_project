// Authentication Logic - Uganda Footy Hub

// User session (in-memory storage)
let userSession = {
    isAuthenticated: false,
    user: null,
    loginTime: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initForms();
    initPasswordToggles();
    initPasswordStrength();
    initFormSwitching();
});

// Initialize Forms
function initForms() {
    // Login Form
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Sign Up Form
    const signupForm = document.getElementById('signupFormElement');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Social Login Buttons
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', handleSocialLogin);
    });
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validate
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    // Simulate login
    showLoading(e.submitter);

    setTimeout(() => {
        hideLoading(e.submitter);

        // Create user session
        userSession = {
            isAuthenticated: true,
            user: {
                email: email,
                name: email.split('@')[0],
                id: Date.now()
            },
            loginTime: new Date().toISOString(),
            rememberMe: rememberMe
        };

        showSuccess('Login successful! Redirecting...');

        setTimeout(() => {
            // Redirect to homepage or previous page
            const returnUrl = new URLSearchParams(window.location.search).get('return') || 'index.html';
            window.location.href = returnUrl;
        }, 1500);

    }, 1500);
}

// Handle Sign Up
function handleSignup(e) {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validate
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showError('Please fill in all required fields');
        return;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (password.length < 8) {
        showError('Password must be at least 8 characters long');
        return;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }

    if (!agreeTerms) {
        showError('Please agree to the Terms of Service and Privacy Policy');
        return;
    }

    // Simulate signup
    showLoading(e.submitter);

    setTimeout(() => {
        hideLoading(e.submitter);

        // Create user session
        userSession = {
            isAuthenticated: true,
            user: {
                email: email,
                name: `${firstName} ${lastName}`,
                firstName: firstName,
                lastName: lastName,
                id: Date.now(),
                favoriteTeam: document.getElementById('favoriteTeam').value
            },
            loginTime: new Date().toISOString()
        };

        showSuccess('Account created successfully! Redirecting...');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    }, 1500);
}

// Handle Social Login
function handleSocialLogin(e) {
    e.preventDefault();
    
    const provider = e.currentTarget.classList.contains('google-btn') ? 'Google' : 'Social';
    
    showLoading(e.currentTarget);

    setTimeout(() => {
        hideLoading(e.currentTarget);
        
        // Simulate social login
        userSession = {
            isAuthenticated: true,
            user: {
                email: 'user@example.com',
                name: 'Social User',
                id: Date.now(),
                provider: provider
            },
            loginTime: new Date().toISOString()
        };

        showSuccess(`${provider} login successful! Redirecting...`);

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);

    }, 1500);
}

// Initialize Password Toggles
function initPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.dataset.target;
            const input = document.getElementById(targetId);
            
            if (input.type === 'password') {
                input.type = 'text';
                btn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                `;
            } else {
                input.type = 'password';
                btn.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                `;
            }
        });
    });
}

// Initialize Password Strength
function initPasswordStrength() {
    const signupPassword = document.getElementById('signupPassword');
    if (!signupPassword) return;

    signupPassword.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = calculatePasswordStrength(password);
        updatePasswordStrengthUI(strength);
    });
}

// Calculate Password Strength
function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 3) return 'medium';
    return 'strong';
}

// Update Password Strength UI
function updatePasswordStrengthUI(strength) {
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthFill || !strengthText) return;

    strengthFill.className = 'strength-fill';
    
    switch (strength) {
        case 'weak':
            strengthFill.classList.add('weak');
            strengthText.textContent = 'Weak password';
            strengthText.style.color = '#ef4444';
            break;
        case 'medium':
            strengthFill.classList.add('medium');
            strengthText.textContent = 'Medium password';
            strengthText.style.color = '#f59e0b';
            break;
        case 'strong':
            strengthFill.classList.add('strong');
            strengthText.textContent = 'Strong password';
            strengthText.style.color = '#10b981';
            break;
    }
}

// Initialize Form Switching
function initFormSwitching() {
    document.querySelectorAll('.switch-form').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.dataset.target;
            
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });

            if (target === 'login') {
                document.getElementById('loginForm').classList.add('active');
            } else {
                document.getElementById('signupForm').classList.add('active');
            }
        });
    });
}

// Validation Helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show Error
function showError(message) {
    // Remove existing messages
    document.querySelectorAll('.error-message, .success-message').forEach(msg => msg.remove());

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message show';
    errorDiv.textContent = message;

    const activeForm = document.querySelector('.auth-form.active .form');
    if (activeForm) {
        activeForm.insertBefore(errorDiv, activeForm.firstChild);
        
        setTimeout(() => {
            errorDiv.classList.remove('show');
            setTimeout(() => errorDiv.remove(), 300);
        }, 5000);
    }
}

// Show Success
function showSuccess(message) {
    // Remove existing messages
    document.querySelectorAll('.error-message, .success-message').forEach(msg => msg.remove());

    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.textContent = message;

    const activeForm = document.querySelector('.auth-form.active .form');
    if (activeForm) {
        activeForm.insertBefore(successDiv, activeForm.firstChild);
    }
}

// Show Loading
function showLoading(button) {
    if (!button) return;
    
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <div style="width: 16px; height: 16px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite;"></div>
            <span>Processing...</span>
        </div>
    `;
}

// Hide Loading
function hideLoading(button) {
    if (!button) return;
    
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Submit';
}

// Check if User is Authenticated
export function isAuthenticated() {
    return userSession.isAuthenticated;
}

// Get Current User
export function getCurrentUser() {
    return userSession.user;
}

// Logout
export function logout() {
    userSession = {
        isAuthenticated: false,
        user: null,
        loginTime: null
    };
    window.location.href = 'index.html';
}

// Require Authentication
export function requireAuth(callback) {
    if (!isAuthenticated()) {
        const currentUrl = window.location.pathname;
        window.location.href = `authentication.html?return=${currentUrl}`;
    } else {
        callback();
    }
}

// Export user session for debugging
export { userSession };