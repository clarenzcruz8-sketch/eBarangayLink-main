document.addEventListener('DOMContentLoaded', function() {

  function showLoginSuccess() {
    const loginBtn = document.querySelector('#loginForm .btn-primary');

    loginBtn.innerHTML = `
      <i class="fas fa-check-circle"></i>
      <span>Login Successful!</span>
    `;
    loginBtn.style.background =
      'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    loginBtn.disabled = true;

    showToast(
      'Welcome!',
      'Redirecting to your dashboard...',
      'success'
    );

    setTimeout(() => {
      window.location.href = 'user-dashboard.html';
    }, 1500);
  }



  // ============================================
  // ERROR HANDLING HELPERS (SAFE ADDITION)
  // ============================================
  function hideError(element) {
    if (!element) return;
    element.classList.remove('show');
  }

  function showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
  }
  console.log('🏛️ Barangay Parada Validation System Loaded');
  
  // ============================================
  // ELEMENTS
  // ============================================
  const loginBox = document.getElementById('loginBox');
  const signupBox = document.getElementById('signupBox');
  const showSignupBtn = document.getElementById('showSignup');
  const showLoginBtn = document.getElementById('showLogin');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  
  // Login fields
  const loginUsername = document.getElementById('loginUsername');
  const loginPassword = document.getElementById('loginPassword');
  
  // Signup fields
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const middleName = document.getElementById('middleName');
  const email = document.getElementById('email');
  const mobile = document.getElementById('mobile');
  const street = document.getElementById('street');
  const house = document.getElementById('house');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');
  const idFile = document.getElementById('idFile');
  const terms = document.getElementById('terms');
  
  // Modals
  const successModal = document.getElementById('successModal');
  const forgotPasswordModal = document.getElementById('forgotPasswordModal');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const closeForgotModal = document.getElementById('closeForgotModal');
  const closeSuccessModal = document.getElementById('closeSuccessModal');
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  
  // Toast
  const toastNotification = document.getElementById('toastNotification');
  const toastClose = document.getElementById('toastClose');
  
  // Steps
  const signupSteps = document.querySelectorAll('.signup-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const nextBtns = document.querySelectorAll('.btn-next');
  const backBtns = document.querySelectorAll('.btn-back');
  
  let currentStep = 1;
  let toastTimeout;
  
  // ============================================
  // ENHANCED NAME VALIDATION DATABASE
  // Intelligent detection of fake/nonsense names
  // ============================================
  const NAME_VALIDATION = {
    // Suspicious patterns that indicate fake names
    suspiciousPatterns: [
      /^(.)\1{2,}$/i,           // Same letter repeated (aaa, bbb, etc.)
      /^(..)\1{2,}$/i,          // Same 2 letters repeated (abab, etc.)
      /^[qwerty]+$/i,           // Keyboard row patterns
      /^[asdfgh]+$/i,           // Keyboard row patterns
      /^[zxcvbn]+$/i,           // Keyboard row patterns
      /^[qazwsx]+$/i,           // Keyboard column patterns
      /^[0-9]+$/,               // Numbers only
      /^[^a-z]+$/i,             // No letters
      /(.)\1{3,}/i,             // Same character repeated 4+ times anywhere
      /^(abc|xyz|test|demo|fake|sample|qwer|asdf|zxcv)/i, // Common test strings
      /^[aeiou]{4,}$/i,         // Too many vowels only
      /^[bcdfghjklmnpqrstvwxyz]{6,}$/i, // Too many consonants only (6+)
    ],
    
    // Patterns for keyboard mashing detection
    keyboardMashPatterns: [
      /qwert/i, /asdfg/i, /zxcvb/i,
      /wertyui/i, /sdfghj/i, /xcvbnm/i,
      /qazwsx/i, /wsxedc/i, /edcrfv/i,
      /poiuyt/i, /lkjhgf/i, /mnbvcx/i,
      /(?:qw|we|er|rt|ty|yu|ui|io|op){3,}/i,
      /(?:as|sd|df|fg|gh|hj|jk|kl){3,}/i,
      /(?:zx|xc|cv|vb|bn|nm){3,}/i
    ],
    
    // Common playful/joke names to reject
    jokeNames: [
      'test', 'demo', 'sample', 'fake', 'admin', 'user', 'name', 'example',
      'qwerty', 'asdfgh', 'zxcvbn', 'abcdef', 'xyz', 'aaa', 'bbb', 'ccc',
      'testing', 'hello', 'world', 'keyboard', 'random', 'whatever', 'anything',
      'nobody', 'someone', 'person', 'human', 'lol', 'haha', 'wtf', 'omg',
      'lorem', 'ipsum', 'dolor', 'tempname', 'noname', 'unknown', 'anonymous'
    ]
  };
  
  // ============================================
  // INTELLIGENT NAME VALIDATION FUNCTION
  // ============================================
  function validateIntelligentName(value, errorId, fieldName) {
    const errorDiv = document.getElementById(errorId);
    const cleanValue = value.trim().toLowerCase();
    
    // 1. Check if empty
    if (!value.trim()) {
      showError(errorDiv, `${fieldName} is required`);
      return false;
    }
    
    // 2. Check minimum length
    if (cleanValue.length < 2) {
      showError(errorDiv, `${fieldName} must be at least 2 characters`);
      return false;
    }
    
    // 3. Check if contains only valid characters (letters, spaces, hyphens, apostrophes)
    if (!/^[a-zA-Z\s\-'ñÑ.]+$/.test(value)) {
      showError(errorDiv, `${fieldName} must contain only letters and valid characters`);
      return false;
    }
    
    // 4. Check for numbers
    if (/\d/.test(value)) {
      showError(errorDiv, `${fieldName} cannot contain numbers`);
      return false;
    }
    
    // 5. Check for joke/test names
    if (NAME_VALIDATION.jokeNames.includes(cleanValue)) {
      showError(errorDiv, `Please enter your real ${fieldName.toLowerCase()}`);
      return false;
    }
    
    // 6. Check for suspicious patterns
    for (let pattern of NAME_VALIDATION.suspiciousPatterns) {
      if (pattern.test(cleanValue)) {
        showError(errorDiv, `${fieldName} appears to be invalid. Please enter a real name`);
        return false;
      }
    }
    
    // 7. Check for keyboard mashing
    for (let pattern of NAME_VALIDATION.keyboardMashPatterns) {
      if (pattern.test(cleanValue)) {
        showError(errorDiv, `${fieldName} contains invalid character patterns. Please enter a real name`);
        return false;
      }
    }
    
    // 8. Check for excessive repeated characters (like "Jooooohn" or "Maaaarry")
    const words = cleanValue.split(/\s+/);
    for (let word of words) {
      if (/(.)\1{2,}/.test(word)) {
        showError(errorDiv, `${fieldName} contains unusual character repetition. Please check spelling`);
        return false;
      }
    }
    
    // 9. Check minimum consonants (avoid names like "aaa" or "eee")
    const consonantCount = (cleanValue.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
    
    if (consonantCount === 0 && cleanValue.length > 2) {
      showError(errorDiv, `${fieldName} must contain at least one consonant`);
      return false;
    }
    
    // 10. Check if it's too short and not a known valid name
    if (cleanValue.length === 2) {
      const isKnownShortName = ['ma', 'jo', 'al', 'ed', 'ty', 'bo', 'cy'].includes(cleanValue);
      if (!isKnownShortName) {
        showError(errorDiv, `${fieldName} seems too short. Please enter full name`);
        return false;
      }
    }
    
    // 11. Check for too many consonants in a row (unlikely in real names)
    if (/[bcdfghjklmnpqrstvwxyz]{5,}/i.test(cleanValue)) {
      showError(errorDiv, `${fieldName} contains unusual character combinations. Please check spelling`);
      return false;
    }
    
    // 12. Check for all same characters
    if (/^(.)\1+$/.test(cleanValue.replace(/\s/g, ''))) {
      showError(errorDiv, `${fieldName} cannot be the same character repeated`);
      return false;
    }
    
    // 13. Validate word structure (each word should have vowels)
    for (let word of words) {
      if (word.length > 1 && !/[aeiou]/i.test(word)) {
        showError(errorDiv, `${fieldName} contains words without vowels. Please check spelling`);
        return false;
      }
    }
    
    // ALL CHECKS PASSED
    hideError(errorDiv);
    return true;
  }
  
  // ============================================
  // INTELLIGENT USERNAME VALIDATION
  // ============================================
  function validateIntelligentUsername(value, errorId) {
    const errorDiv = document.getElementById(errorId);
    const cleanValue = value.trim().toLowerCase();
    
    // 1. Check if empty
    if (!value.trim()) {
      showError(errorDiv, 'Username is required');
      return false;
    }
    
    // 2. Check minimum length
    if (cleanValue.length < 3) {
      showError(errorDiv, 'Username must be at least 3 characters');
      return false;
    }
    
    // 3. Check if it's ONLY numbers
    if (/^\d+$/.test(cleanValue)) {
      showError(errorDiv, 'Username cannot be numbers only');
      return false;
    }
    
    // 4. Must contain at least one letter
    if (!/[a-zA-Z]/.test(value)) {
      showError(errorDiv, 'Username must contain at least one letter');
      return false;
    }
    
    // 5. Check for suspicious patterns
    for (let pattern of NAME_VALIDATION.suspiciousPatterns) {
      if (pattern.test(cleanValue)) {
        showError(errorDiv, 'Username appears to be invalid. Please use a valid username');
        return false;
      }
    }
    
    // 6. Check for keyboard mashing
    for (let pattern of NAME_VALIDATION.keyboardMashPatterns) {
      if (pattern.test(cleanValue)) {
        showError(errorDiv, 'Username contains invalid patterns. Please use a valid username');
        return false;
      }
    }
    
    // 7. Check for excessive repeated characters
    if (/(.)\1{3,}/.test(cleanValue)) {
      showError(errorDiv, 'Username contains too many repeated characters');
      return false;
    }
    
    // 8. Check for joke usernames
    if (NAME_VALIDATION.jokeNames.includes(cleanValue)) {
      showError(errorDiv, 'Please use a valid username');
      return false;
    }
    
    // 9. Check for all same characters
    if (/^(.)\1+$/.test(cleanValue)) {
      showError(errorDiv, 'Username cannot be the same character repeated');
      return false;
    }
    
    // 10. Check valid characters (letters, numbers, underscore, dot, dash)
    if (!/^[a-zA-Z0-9_.-]+$/.test(value)) {
      showError(errorDiv, 'Username can only contain letters, numbers, underscore, dot and dash');
      return false;
    }
    
    // ALL CHECKS PASSED
    hideError(errorDiv);
    return true;
  }
  
  // ============================================
  // ENHANCED IMAGE UPLOAD VALIDATION
  // ============================================
  function validateImageFile(file, errorId) {
    const errorDiv = document.getElementById(errorId);
    
    // 1. Check if file exists
    if (!file) {
      showError(errorDiv, 'Please upload a valid ID');
      return false;
    }
    
    // 2. Validate file type (only images: jpg, jpeg, png, gif)
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (!allowedImageTypes.includes(file.type)) {
      showError(errorDiv, 'Only image files are allowed (JPG, JPEG, PNG, GIF)');
      return false;
    }
    
    // 3. Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      showError(errorDiv, `File size (${fileSizeMB}MB) exceeds maximum limit of 5MB`);
      return false;
    }
    
    // 4. Validate minimum file size (at least 10KB to avoid empty/corrupt files)
    const minSize = 10 * 1024; // 10KB
    
    if (file.size < minSize) {
      showError(errorDiv, 'File size is too small. Please upload a valid ID image');
      return false;
    }
    
    // 5. Validate file extension
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      showError(errorDiv, 'Invalid file extension. Only JPG, JPEG, PNG, or GIF files are allowed');
      return false;
    }
    
    // ALL CHECKS PASSED
    hideError(errorDiv);
    return true;
  }
  
  // ============================================
  // VALIDATE IMAGE DIMENSIONS
  // ============================================
  function validateImageDimensions(file, errorId, callback) {
    const errorDiv = document.getElementById(errorId);
    
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    
    img.onload = function() {
      URL.revokeObjectURL(objectUrl);
      
      const width = img.width;
      const height = img.height;
      
      // Check minimum dimensions (at least 200x200)
      if (width < 200 || height < 200) {
        showError(errorDiv, `Image dimensions (${width}x${height}) are too small. Minimum 200x200 pixels required`);
        callback(false);
        return;
      }
      
      // Check maximum dimensions (max 4000x4000)
      if (width > 4000 || height > 4000) {
        showError(errorDiv, `Image dimensions (${width}x${height}) are too large. Maximum 4000x4000 pixels allowed`);
        callback(false);
        return;
      }
      
      // Dimensions are valid
      hideError(errorDiv);
      callback(true);
    };
    
    img.onerror = function() {
      URL.revokeObjectURL(objectUrl);
      showError(errorDiv, 'Unable to read image file. Please upload a valid image');
      callback(false);
    };
    
    img.src = objectUrl;
  }
  
  // ============================================
  // TOAST NOTIFICATION SYSTEM
  // ============================================
  function showToast(title, message, type = 'success') {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    
    toastNotification.classList.remove('show', 'hide', 'success', 'error', 'info');
    
    const toastTitle = toastNotification.querySelector('.toast-title');
    const toastText = toastNotification.querySelector('.toast-text');
    const toastIcon = toastNotification.querySelector('.toast-icon i');
    
    toastTitle.textContent = title;
    toastText.textContent = message;
    
    if (type === 'success') {
      toastIcon.className = 'fas fa-check-circle';
    } else if (type === 'error') {
      toastIcon.className = 'fas fa-exclamation-circle';
    } else if (type === 'info') {
      toastIcon.className = 'fas fa-info-circle';
    }
    
    toastNotification.classList.add(type, 'show');
    
    toastTimeout = setTimeout(() => {
      hideToast();
    }, 5000);
  }
  
  function hideToast() {
    toastNotification.classList.remove('show');
    toastNotification.classList.add('hide');
    
    setTimeout(() => {
      toastNotification.classList.remove('hide');
    }, 300);
  }
  
  if (toastClose) {
    toastClose.addEventListener('click', hideToast);
  }
  
  // ============================================
  // FORM SWITCHING
  // ============================================
  showSignupBtn.addEventListener('click', function(e) {
    e.preventDefault();
    loginBox.classList.remove('active');
    signupBox.classList.add('active');
    resetForm(loginForm);
  });
  
  showLoginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    signupBox.classList.remove('active');
    loginBox.classList.add('active');
    resetForm(signupForm);
    resetSteps();
  });
  
  // ============================================
  // STEP NAVIGATION
  // ============================================
  nextBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const nextStep = parseInt(this.getAttribute('data-next'));
      
      if (validateCurrentStep(currentStep)) {
        goToStep(nextStep);
      }
    });
  });
  
  backBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const prevStep = parseInt(this.getAttribute('data-prev'));
      goToStep(prevStep);
    });
  });
  
  function goToStep(step) {
    signupSteps.forEach(s => s.classList.remove('active'));
    signupSteps[step - 1].classList.add('active');
    
    progressSteps.forEach((s, index) => {
      s.classList.remove('active', 'completed');
      
      if (index < step - 1) {
        s.classList.add('completed');
      } else if (index === step - 1) {
        s.classList.add('active');
      }
    });
    
    currentStep = step;
    
    const activeBox = document.querySelector('.auth-box.active');
    if (activeBox) {
      activeBox.scrollTop = 0;
    }
  }
  
  function resetSteps() {
    currentStep = 1;
    signupSteps.forEach(s => s.classList.remove('active'));
    signupSteps[0].classList.add('active');
    
    progressSteps.forEach((s, index) => {
      s.classList.remove('active', 'completed');
      if (index === 0) s.classList.add('active');
    });
  }
  
  function validateCurrentStep(step) {
    if (step === 1) {
      return validateStep1();
    } else if (step === 2) {
      return validateStep2();
    }
    return true;
  }
  
  // ============================================
  // PASSWORD TOGGLE
  // ============================================
  const togglePasswordBtns = document.querySelectorAll('.toggle-password');
  
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      const icon = this.querySelector('i');
      
      if (targetInput.type === 'password') {
        targetInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        targetInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
  
  // ============================================
  // PASSWORD STRENGTH METER
  // ============================================
  if (password) {
    password.addEventListener('input', function() {
      const value = this.value;
      const strengthFill = document.querySelector('.strength-fill');
      const strengthText = document.querySelector('.strength-text strong');
      
      const reqLength = document.querySelector('[data-req="length"]');
      const reqUppercase = document.querySelector('[data-req="uppercase"]');
      const reqNumber = document.querySelector('[data-req="number"]');
      
      let strength = 0;
      
      if (value.length >= 8) {
        strength++;
        reqLength.classList.add('met');
      } else {
        reqLength.classList.remove('met');
      }
      
      if (/[A-Z]/.test(value)) {
        strength++;
        reqUppercase.classList.add('met');
      } else {
        reqUppercase.classList.remove('met');
      }
      
      if (/[0-9]/.test(value)) {
        strength++;
        reqNumber.classList.add('met');
      } else {
        reqNumber.classList.remove('met');
      }
      
      strengthFill.className = 'strength-fill';
      
      if (strength === 0 || strength === 1) {
        strengthText.textContent = 'Weak';
        strengthFill.classList.add('weak');
      } else if (strength === 2) {
        strengthText.textContent = 'Medium';
        strengthFill.classList.add('medium');
      } else {
        strengthText.textContent = 'Strong';
        strengthFill.classList.add('strong');
      }
    });
  }
  
  // ============================================
  // ENHANCED FILE UPLOAD PREVIEW
  // ============================================
  if (idFile) {
    const fileLabel = document.querySelector('.file-upload-label');
    const uploadText = document.querySelector('.upload-text');
    const filePreview = document.getElementById('filePreview');
    
    idFile.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const file = this.files[0];
        
        // First validate the file
        if (!validateImageFile(file, 'SU_vID')) {
          this.value = '';
          filePreview.classList.remove('active');
          filePreview.innerHTML = '';
          uploadText.textContent = 'Click to upload your valid ID';
          fileLabel.style.borderColor = '';
          fileLabel.style.background = '';
          return;
        }
        
        // Then validate dimensions (async)
        validateImageDimensions(file, 'SU_vID', function(isValid) {
          if (!isValid) {
            idFile.value = '';
            filePreview.classList.remove('active');
            filePreview.innerHTML = '';
            uploadText.textContent = 'Click to upload your valid ID';
            fileLabel.style.borderColor = '';
            fileLabel.style.background = '';
            return;
          }
          
          // File is valid, show preview
          uploadText.textContent = file.name;
          
          const reader = new FileReader();
          reader.onload = function(e) {
            filePreview.innerHTML = `
              <div style="text-align: center;">
                <img src="${e.target.result}" alt="ID Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <p style="margin-top: 10px; font-size: 13px; color: #059669; font-weight: 600;">
                  <i class="fas fa-check-circle"></i> Valid ID uploaded successfully
                </p>
                <p style="font-size: 12px; color: #6b7280; margin-top: 4px;">
                  ${file.name} • ${(file.size / 1024).toFixed(0)} KB
                </p>
              </div>
            `;
            filePreview.classList.add('active');
          };
          reader.readAsDataURL(file);
          
          fileLabel.style.borderColor = '#10b981';
          fileLabel.style.background = 'rgba(16, 185, 129, 0.05)';
        });
      }
    });
  }
  
  // ============================================
  // MODAL HANDLERS
  // ============================================
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      forgotPasswordModal.classList.add('active');
    });
  }
  
  if (closeForgotModal) {
    closeForgotModal.addEventListener('click', function() {
      forgotPasswordModal.classList.remove('active');
    });
  }
  
  if (closeSuccessModal) {
    closeSuccessModal.addEventListener('click', function() {
      successModal.classList.remove('active');
      resetForm(signupForm);
      resetSteps();
      signupBox.classList.remove('active');
      loginBox.classList.add('active');
    });
  }
  
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function() {
      if (this.parentElement.id === 'successModal') {
        closeSuccessModal.click();
      } else {
        this.parentElement.classList.remove('active');
      }
    });
  });
  
  // ============================================
  // FORGOT PASSWORD FORM - VALIDATION ONLY
  // ============================================
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const resetEmail = document.getElementById('resetEmail');
      const resetEmailError = document.getElementById('resetEmailError');
      
      if (!validateEmail(resetEmail.value)) {
        showError(resetEmailError, 'Please enter a valid email address');
        return;
      }
      
      hideError(resetEmailError);
      
      // Show success message (no actual email sending)
      showToast(
        'Password Reset Request Received',
        `A password reset link has been sent to ${resetEmail.value}. Please check your email inbox.`,
        'success'
      );
      
      forgotPasswordModal.classList.remove('active');
      resetEmail.value = '';
    });
  }
  
 // ============================================
// LOGIN FORM - VALIDATION + REDIRECT TO DASHBOARD
// ============================================
loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  let isValid = true;

  const usernameValue = loginUsername.value.trim();

  hideError(document.getElementById('loginUsernameError'));

  // Validate password
  const passwordValue = loginPassword.value;

  if (!passwordValue) {
    showError(
      document.getElementById('loginPasswordError'),
      'Password is required'
    );
    isValid = false;
  } else {
    hideError(document.getElementById('loginPasswordError'));
  }

  // If validation passes, redirect to dashboard
  if (isValid) {
    fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: usernameValue,
        password: passwordValue
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("📦 LOGIN RESPONSE:", data);
        if (data.userId) {
    localStorage.setItem("userId", data.userId);
       }
    localStorage.setItem("accountId", data.account_id);

        switch (data.account_id) {
    case 1:
      window.location.href = "/user-dashboard.html";
      break;
    case 2:
      window.location.href = "/admin/admin-dashboard.html";
      break;
    case 3:
      window.location.href = "/superadmin/superadmin-dashboard.html";
      break;
    default:
      alert("Unknown role");
      return;
  }
        if (data.message === 'Login successful') {
          showLoginSuccess();
        } else {
          showToast(
            'Login Failed',
            'Invalid username or password',
            'error'
          );
        }
      })
      .catch(err => {
        console.error(err);
        showToast(
          'Server Error',
          'Unable to connect to server',
          'error'
        );
      });
  }
});

  
  // ============================================
  // SIGNUP FORM - VALIDATION ONLY (NO DATA SAVING)
  // ============================================
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    let isValid = true;
    
    // Validate file
    if (!idFile.files[0]) {
      showError(document.getElementById('SU_vID'), 'Please upload a valid ID');
      isValid = false;
    } else if (!validateImageFile(idFile.files[0], 'SU_vID')) {
      isValid = false;
    }
    
    // Validate terms
    if (!terms.checked) {
      showError(
        document.getElementById('termsError'),
        'You must agree to the Terms and Conditions'
      );
      isValid = false;
    } else {
      hideError(document.getElementById('termsError'));
    }
    
    // Validate all steps
    if (!validateStep1() || !validateStep2()) {
      isValid = false;
    }
    
    // If all validation passes, show success message
    if (isValid) {
  const modalContent = successModal.querySelector('.modal-content p');
  modalContent.textContent =
    `All fields have been validated successfully! Your registration form is complete and ready for submission.`;

  const modalButton = successModal.querySelector('.btn-primary');
  modalButton.innerHTML = `
    <span>Continue</span>
    <i class="fas fa-arrow-right"></i>
  `;

  successModal.classList.add('active');

  showToast(
    'Validation Successful!',
    'All registration fields are valid. Form is being submitted...',
    'success'
  );

  // ✅ SEND DATA TO BACKEND
  fetch('http://localhost:3000/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      firstName: firstName.value,
      middleName: middleName.value,
      lastName: lastName.value,
      email: email.value,
      mobile: mobile.value,
      street: street.value,
      house: house.value,
      username: username.value,
      password: password.value
    })
  })
    .then(res => res.json())
    .then(data => {
      console.log('✅ Saved to DB:', data);

      if (data.message && data.message.includes('success')) {
        console.log('🎉 Signup successful');
      } else {
        showToast(
          'Signup Failed',
          data.message || 'Unable to create account',
          'error'
        );
      }
    })
    .catch(err => {
      console.error('❌ Signup error:', err);
      showToast(
        'Server Error',
        'Unable to connect to server',
        'error'
      );
    });
  }
});
  
  // ============================================
  // STEP VALIDATIONS
  // ============================================
  function validateStep1() {
    let isValid = true;
    
    if (!validateIntelligentName(firstName.value, 'SU_firstName', 'First name')) {
      isValid = false;
    }
    
    if (!validateIntelligentName(lastName.value, 'SU_lastName', 'Last name')) {
      isValid = false;
    }
    
    if (middleName.value && !validateIntelligentName(middleName.value, 'SU_middleName', 'Middle name')) {
      isValid = false;
    }
    
    if (!validateEmailField(email.value)) {
      isValid = false;
    }
    
    return isValid;
  }
  
  function validateStep2() {
    let isValid = true;
    
    if (!validateMobileNumber(mobile.value)) {
      showError(
        document.getElementById('SU_mobile'),
        'Please enter a valid Philippine mobile number (09XXXXXXXXX)'
      );
      isValid = false;
    } else {
      hideError(document.getElementById('SU_mobile'));
    }
    
    if (!street.value) {
      showError(
        document.getElementById('SU_street'),
        'Please select your street'
      );
      isValid = false;
    } else {
      hideError(document.getElementById('SU_street'));
    }
    
    if (!validateUsernameField(username.value)) {
      isValid = false;
    }
    
    if (!validatePassword(password.value)) {
      showError(
        document.getElementById('SU_password'),
        'Password must be at least 8 characters with uppercase and number'
      );
      isValid = false;
    } else {
      hideError(document.getElementById('SU_password'));
    }
    
    if (password.value !== confirmPassword.value) {
      showError(
        document.getElementById('SU_confirmpassword'),
        'Passwords do not match'
      );
      isValid = false;
    } else {
      hideError(document.getElementById('SU_confirmpassword'));
    }
    
    return isValid;
  }
  
  // ============================================
  // VALIDATION FUNCTIONS
  // ============================================
  
  function validateEmailField(value) {
    const errorDiv = document.getElementById('SU_email');
    
    if (!value.trim()) {
      showError(errorDiv, 'Email address is required');
      return false;
    }
    
    if (!validateEmail(value)) {
      showError(errorDiv, 'Please enter a valid email address');
      return false;
    }
    
    hideError(errorDiv);
    return true;
  }
  
  function validateUsernameField(value) {
    return validateIntelligentUsername(value, 'SU_username');
  }
  
  function validateEmail(value) {
    if (!value.trim()) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.(com|ph)$/i; 
    return emailRegex.test(value);
  }
  
  function validateMobileNumber(value) {
    if (!value.trim()) return false;
    const cleaned = value.replace(/[\s-]/g, '');
    if (/^09\d{9}$/.test(cleaned)) return true;
    if (/^\+639\d{9}$/.test(cleaned)) return true;
    return false;
  }
  
  function validatePassword(value) {
    if (!value) return false;
    if (value.length < 8) return false;
    if (!/[A-Z]/.test(value)) return false;
    if (!/[a-z]/.test(value)) return false;
    if (!/[0-9]/.test(value)) return false;
    return true;
  }
  
  function showError(element, message) {
    if (!element) return;
    element.textContent = message;
    element.classList.add('show');
  }
  
  function hideError(element) {
    if (!element) return;
    element.classList.remove('show');
  }
  
  function resetForm(form) {
    if (!form) return;
    
    form.reset();
    
    const errors = form.querySelectorAll('.error-msg');
    errors.forEach(error => hideError(error));
    
    const filePreview = document.getElementById('filePreview');
    if (filePreview) {
      filePreview.classList.remove('active');
      filePreview.innerHTML = '';
    }
    
    const uploadText = document.querySelector('.upload-text');
    if (uploadText) {
      uploadText.textContent = 'Click to upload your valid ID';
    }
    
    const fileLabel = document.querySelector('.file-upload-label');
    if (fileLabel) {
      fileLabel.style.borderColor = '';
      fileLabel.style.background = '';
    }
    
    const strengthFill = document.querySelector('.strength-fill');
    if (strengthFill) {
      strengthFill.className = 'strength-fill';
    }
    
    const strengthText = document.querySelector('.strength-text strong');
    if (strengthText) {
      strengthText.textContent = 'Weak';
    }
    
    const requirements = document.querySelectorAll('.req-item');
    requirements.forEach(req => req.classList.remove('met'));
  }
  
  // ============================================
  // REAL-TIME VALIDATION
  // ============================================
  
  // Login username validation
  if (loginUsername) {
    loginUsername.addEventListener('blur', function() {
      validateIntelligentUsername(this.value.trim(), 'loginUsernameError');
    });
    
    loginUsername.addEventListener('input', function() {
      hideError(document.getElementById('loginUsernameError'));
    });
  }
  
  if (loginPassword) {
    loginPassword.addEventListener('blur', function() {
      if (!this.value) {
        showError(
          document.getElementById('loginPasswordError'),
          'Password is required'
        );
      } else {
        hideError(document.getElementById('loginPasswordError'));
      }
    });
    
    loginPassword.addEventListener('input', function() {
      hideError(document.getElementById('loginPasswordError'));
    });
  }
  
  // Signup field validations
  if (firstName) {
    firstName.addEventListener('blur', function() {
      validateIntelligentName(this.value, 'SU_firstName', 'First name');
    });
  }
  
  if (lastName) {
    lastName.addEventListener('blur', function() {
      validateIntelligentName(this.value, 'SU_lastName', 'Last name');
    });
  }
  
  if (middleName) {
    middleName.addEventListener('blur', function() {
      if (this.value) {
        validateIntelligentName(this.value, 'SU_middleName', 'Middle name');
      } else {
        hideError(document.getElementById('SU_middleName'));
      }
    });
  }
  
  if (email) {
    email.addEventListener('blur', function() {
      if (this.value) {
        validateEmailField(this.value);
      }
    });
  }
  
  if (mobile) {
    mobile.addEventListener('blur', function() {
      if (this.value && !validateMobileNumber(this.value)) {
        showError(
          document.getElementById('SU_mobile'),
          'Please enter a valid Philippine mobile number (09XXXXXXXXX)'
        );
      } else {
        hideError(document.getElementById('SU_mobile'));
      }
    });
  }
  
  if (username) {
    username.addEventListener('blur', function() {
      if (this.value) {
        validateUsernameField(this.value);
      }
    });
    
    username.addEventListener('input', debounce(function() {
      if (this.value.length >= 3) {
        validateUsernameField(this.value);
      }
    }, 500));
  }
  
  if (confirmPassword) {
    confirmPassword.addEventListener('blur', function() {
      if (this.value && password.value !== this.value) {
        showError(
          document.getElementById('SU_confirmpassword'),
          'Passwords do not match'
        );
      } else {
        hideError(document.getElementById('SU_confirmpassword'));
      }
    });
  }
  
  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  // ============================================
  // INITIALIZATION COMPLETE
  // ============================================
  console.log('✅ Front-End Validation System Initialized');
  console.log('🔒 Validation: Intelligent Name & Username Validation Active');
  console.log('🖼️ File Validation: Image Type, Size, and Dimensions Check Active');
  console.log('⚠️ NOTE: This is FRONT-END VALIDATION ONLY - No authentication or data saving');
});
