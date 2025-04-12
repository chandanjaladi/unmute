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
      <div class="settings-item" onclick="window.location.href='listener-login.html'">
        <i class="fa-solid fa-user"></i>
        <span>Become Listener</span>
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

// Global panel/intro logic remains
// Add all page-specific JS inside this block

document.addEventListener("DOMContentLoaded", function () {
  const path = window.location.pathname;

  // login.html
  if (path.includes("/login")) {
    document.getElementById("loginForm")?.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
        .then(res => res.ok ? res.json() : res.text().then(msg => { throw new Error(msg); }))
        .then(user => {
          localStorage.setItem("unmute_currentUser", JSON.stringify({
            name: user.name,
            email: user.email,
            username: user.username,
            isLoggedIn: true
          }));
          window.location.href = "/index";
        })
        .catch(err => {
          const errBox = document.getElementById("generalError");
          if (errBox) {
            errBox.textContent = err.message;
            errBox.style.display = "block";
          }
        });
    });
  }

  // signup.html
  else if (path.includes("/signup")) {
    document.getElementById("signupForm")?.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) return alert("Passwords do not match");

      fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password })
      })
        .then(res => res.ok ? res.text() : res.text().then(msg => { throw new Error(msg); }))
        .then(() => {
          document.getElementById("successMessage").style.display = "block";
          this.reset();
          setTimeout(() => (window.location.href = "/login"), 2000);
        })
        .catch(err => alert("Signup failed: " + err.message));
    });
  }

  // speaker-entry.html
  else if (path.includes("/speaker-entry")) {
    document.getElementById("speakerForm")?.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      localStorage.setItem("unmute_speaker", JSON.stringify({ name }));
      window.location.href = "/connect-session";
    });
  }

  // connect-session.html
  else if (path.includes("/connect-session")) {
    const duration = localStorage.getItem("selectedDuration") || "5 mins";
    let totalSeconds = parseInt(duration) * 60 || 300;
    const timerDisplay = document.getElementById("timer");

    const countdown = setInterval(() => {
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
      totalSeconds--;
      if (totalSeconds < 0) {
        clearInterval(countdown);
        timerDisplay.textContent = "Session Ended";
      }
    }, 1000);
  }

  // listener-login.html
  else if (path.includes("/listener-login")) {
    document.getElementById("listenerLoginForm")?.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      fetch("/api/auth/listener-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      })
        .then(res => res.ok ? res.json() : res.text().then(msg => { throw new Error(msg); }))
        .then(user => {
          localStorage.setItem("unmute_listener", JSON.stringify(user));
          window.location.href = "/connect-session";
        })
        .catch(err => {
          const errorBox = document.getElementById("loginError");
          if (errorBox) {
            errorBox.textContent = err.message;
            errorBox.style.display = "block";
          }
        });
    });
  }

  // listener-signup.html
  else if (path.includes("/listener-signup")) {
    document.getElementById("listenerSignupForm")?.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      fetch("/api/auth/listener-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password })
      })
        .then(res => res.ok ? res.text() : res.text().then(msg => { throw new Error(msg); }))
        .then(() => {
          document.getElementById("successMessage").style.display = "block";
          setTimeout(() => (window.location.href = "/listener-login"), 2000);
        })
        .catch(err => alert("Signup failed: " + err.message));
    });
  }

  // account-settings-listener.html
  else if (path.includes("/account-settings-listener")) {
    const user = JSON.parse(localStorage.getItem("unmute_listener"));
    if (user) {
      document.getElementById("name").value = user.name || "";
      document.getElementById("email").value = user.email || "";
    }

    document.getElementById("settingsForm")?.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();

      fetch("/api/auth/update-listener", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, name, email })
      })
        .then(res => res.text())
        .then(() => {
          localStorage.setItem("unmute_listener", JSON.stringify({ ...user, name, email }));
          document.getElementById("statusMsg").style.display = "block";
        });
    });
  }

  // account-settings-speaker.html
  else if (path.includes("/account-settings-speaker")) {
    const speaker = JSON.parse(localStorage.getItem("unmute_speaker"));
    if (speaker) {
      document.getElementById("name").value = speaker.name || "";
    }

    document.getElementById("speakerSettingsForm")?.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      localStorage.setItem("unmute_speaker", JSON.stringify({ name }));
      document.getElementById("statusMsg").style.display = "block";
    });
  }
});
