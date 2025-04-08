// Check if intro has been shown before
document.addEventListener('DOMContentLoaded', function() {
  // Check if intro has been shown or we're returning from another page
  const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
  const returningFromPayment = sessionStorage.getItem('returningFromPayment') === 'true';
  
  if (hasSeenIntro || returningFromPayment) {
    // Skip intro if already seen or returning from payment
    document.getElementById('intro').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'flex';
    
    // Add fade-in animation to main screen elements
    const mainElements = document.querySelectorAll('.main-screen > *');
    mainElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('fade-in');
      }, 100 * index);
    });
    
    // Clear the returning flag
    sessionStorage.removeItem('returningFromPayment');
  } else {
    // Run the intro sequence for first-time visitors
    runIntroSequence();
    // Set flag that intro has been shown
    localStorage.setItem('hasSeenIntro', 'true');
  }
  
  // Update panel based on login status
  updatePanelItems();
});

// Intro animation sequence
function runIntroSequence() {
  setTimeout(() => {
    document.getElementById('micSlash').classList.add('fade-out');
  }, 1500);

  setTimeout(() => {
    document.getElementById('intro').classList.add('fade-out');
  }, 3000);

  setTimeout(() => {
    document.getElementById('intro').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'flex';
    
    // Add fade-in animation to main screen elements
    const mainElements = document.querySelectorAll('.main-screen > *');
    mainElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('fade-in');
      }, 100 * index);
    });
  }, 4000);
}

// Panel toggle function
function togglePanel() {
  const panel = document.getElementById('settingsPanel');
  const isOpen = panel.classList.contains('panel-open');
  
  if (isOpen) {
    panel.classList.remove('panel-open');
    setTimeout(() => {
      panel.style.display = 'none';
    }, 300);
  } else {
    panel.style.display = 'flex';
    setTimeout(() => {
      panel.classList.add('panel-open');
    }, 10);
  }
}

// Update panel items based on login status
function updatePanelItems() {
  const panel = document.getElementById('settingsPanel');
  const currentUser = localStorage.getItem('unmute_currentUser');
  const isLoggedIn = currentUser ? JSON.parse(currentUser).isLoggedIn : false;
  
  // Clear existing panel items except the header and back button
  const existingItems = panel.querySelectorAll('.settings-item');
  existingItems.forEach(item => item.remove());
  
  // Create panel content based on login status
  let panelContent = '';
  
  if (isLoggedIn) {
    // User is logged in
    const user = JSON.parse(currentUser);
    
    panelContent = `
      <div class="settings-item" onclick="window.location.href='account-settings.html'">
        <i class="fa-solid fa-user"></i>
        <span>Account Settings</span>
      </div>
      <div class="settings-item" onclick="window.location.href='history.html'">
        <i class="fa-solid fa-clock-rotate-left"></i>
        <span>History</span>
      </div>
      <div class="settings-item" onclick="logout()">
        <i class="fa-solid fa-right-from-bracket"></i>
        <span>Logout</span>
      </div>
    `;
  } else {
    // User is not logged in
    panelContent = `
      <div class="settings-item" onclick="window.location.href='login.html'">
        <i class="fa-solid fa-right-to-bracket"></i>
        <span>Log In</span>
      </div>
      <div class="settings-item" onclick="window.location.href='signup.html'">
        <i class="fa-solid fa-user-plus"></i>
        <span>Sign Up</span>
      </div>
    `;
  }
  
  // Help item is always visible
  panelContent += `
    <div class="settings-item" onclick="window.location.href='help.html'">
      <i class="fa-solid fa-circle-question"></i>
      <span>Help</span>
    </div>
  `;
  
  // Insert panel content after the panel header
  const panelHeader = panel.querySelector('.panel-header');
  panelHeader.insertAdjacentHTML('afterend', panelContent);
}

// Function to handle logout
function logout() {
  localStorage.removeItem('unmute_currentUser');
  updatePanelItems();
  alert('You have been logged out successfully.');
}

// Go to payment page function
function goToPaymentPage() {
  // Store selected options in localStorage
  const language = document.getElementById('languageSelect').value;
  const duration = document.getElementById('timeSelect').value;
  
  localStorage.setItem('selectedLanguage', language);
  localStorage.setItem('selectedDuration', duration);
  
  // Set flag that we're going to payment (use sessionStorage instead of localStorage)
  sessionStorage.setItem('returningFromPayment', 'true');
  
  // Animate button
  const btn = document.querySelector('.unmute-btn');
  btn.classList.add('clicked');
  
  // Redirect after animation
  setTimeout(() => {
    window.location.href = 'payment.html';
  }, 300);
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add change listeners to dropdowns
  const languageSelect = document.getElementById('languageSelect');
  const timeSelect = document.getElementById('timeSelect');
  
  if (languageSelect && timeSelect) {
    [languageSelect, timeSelect].forEach(select => {
      select.addEventListener('change', function() {
        // Subtle animation when selection changes
        this.classList.add('changed');
        setTimeout(() => {
          this.classList.remove('changed');
        }, 300);
      });
    });
  }
  
  // Close panel when clicking outside
  document.addEventListener('click', function(event) {
    const panel = document.getElementById('settingsPanel');
    const hamburger = document.querySelector('.hamburger');
    
    if (panel.style.display === 'flex' && 
        !panel.contains(event.target) && 
        !hamburger.contains(event.target)) {
      togglePanel();
    }
  });
});