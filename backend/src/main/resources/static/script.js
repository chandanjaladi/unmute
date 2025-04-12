document.addEventListener('DOMContentLoaded', () => {
  const hasSeenIntro = localStorage.getItem('hasSeenIntro') === 'true';
  const returningFromPayment = sessionStorage.getItem('returningFromPayment') === 'true';

  if (hasSeenIntro || returningFromPayment) {
    document.getElementById('intro')?.style.setProperty('display', 'none');
    document.getElementById('mainScreen')?.style.setProperty('display', 'flex');
    fadeInMainScreen();
    sessionStorage.removeItem('returningFromPayment');
  } else {
    runIntroSequence();
    localStorage.setItem('hasSeenIntro', 'true');
  }

  updatePanelItems();
  attachPanelClose();
  attachDropdownAnimations();
  attachPageHandlers();
});

function runIntroSequence() {
  setTimeout(() => document.getElementById('micSlash')?.classList.add('fade-out'), 1500);
  setTimeout(() => document.getElementById('intro')?.classList.add('fade-out'), 3000);
  setTimeout(() => {
    document.getElementById('intro')?.style.setProperty('display', 'none');
    document.getElementById('mainScreen')?.style.setProperty('display', 'flex');
    fadeInMainScreen();
  }, 4000);
}

function fadeInMainScreen() {
  const mainElements = document.querySelectorAll('.main-screen > *');
  mainElements.forEach((el, index) => {
    setTimeout(() => el.classList.add('fade-in'), 100 * index);
  });
}

function togglePanel() {
  const panel = document.getElementById('settingsPanel');
  const isOpen = panel.classList.contains('panel-open');
  panel.style.display = isOpen ? 'none' : 'flex';
  setTimeout(() => panel.classList.toggle('panel-open', !isOpen), 10);
}

function updatePanelItems() {
  const panel = document.getElementById('settingsPanel');
  const currentUser = JSON.parse(localStorage.getItem('unmute_currentUser') || 'null');
  const isLoggedIn = currentUser?.isLoggedIn;

  panel.querySelectorAll('.settings-item').forEach(item => item.remove());

  let content = '';
  if (isLoggedIn) {
    content += `
      <div class="settings-item" onclick="window.location.href='/account-settings-speaker'">
        <i class="fa-solid fa-user"></i><span>Account Settings</span>
      </div>
      <div class="settings-item" onclick="window.location.href='/history'">
        <i class="fa-solid fa-clock-rotate-left"></i><span>History</span>
      </div>
      <div class="settings-item" onclick="window.location.href='/listener-login'">
        <i class="fa-solid fa-user"></i><span>Become Listener</span>
      </div>
      <div class="settings-item" onclick="logout()">
        <i class="fa-solid fa-right-from-bracket"></i><span>Logout</span>
      </div>`;
  } else {
    content += `
      <div class="settings-item" onclick="window.location.href='/login'">
        <i class="fa-solid fa-right-to-bracket"></i><span>Log In</span>
      </div>
      <div class="settings-item" onclick="window.location.href='/signup'">
        <i class="fa-solid fa-user-plus"></i><span>Sign Up</span>
      </div>`;
  }

  content += `
    <div class="settings-item" onclick="window.location.href='/help'">
      <i class="fa-solid fa-circle-question"></i><span>Help</span>
    </div>`;

  panel.querySelector('.panel-header')?.insertAdjacentHTML('afterend', content);
}

function logout() {
  localStorage.removeItem('unmute_currentUser');
  localStorage.removeItem('unmute_listener');
  updatePanelItems();
  alert('You have been logged out.');
}

function goToPaymentPage() {
  const language = document.getElementById('languageSelect')?.value;
  const duration = document.getElementById('timeSelect')?.value;
  if (language && duration) {
    localStorage.setItem('selectedLanguage', language);
    localStorage.setItem('selectedDuration', duration);
    sessionStorage.setItem('returningFromPayment', 'true');
    document.querySelector('.unmute-btn')?.classList.add('clicked');
    setTimeout(() => (window.location.href = '/payment.html'), 300);
  }
}

function attachDropdownAnimations() {
  document.querySelectorAll('#languageSelect, #timeSelect').forEach(select => {
    select?.addEventListener('change', function () {
      this.classList.add('changed');
      setTimeout(() => this.classList.remove('changed'), 300);
    });
  });
}

function attachPanelClose() {
  document.addEventListener('click', (event) => {
    const panel = document.getElementById('settingsPanel');
    const hamburger = document.querySelector('.hamburger');
    if (panel?.style.display === 'flex' &&
        !panel.contains(event.target) &&
        !hamburger.contains(event.target)) {
      togglePanel();
    }
  });
}

function attachPageHandlers() {
  const path = window.location.pathname;

  if (path.includes('/login')) {
    document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error(await res.text());
        const user = await res.json();
        localStorage.setItem('unmute_currentUser', JSON.stringify({ ...user, isLoggedIn: true }));
        window.location.href = '/';
      } catch (err) {
        const errBox = document.getElementById('generalError');
        if (errBox) {
          errBox.textContent = err.message;
          errBox.style.display = 'block';
        }
      }
    });
  }

  else if (path.includes('/signup')) {
    document.getElementById('signupForm')?.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      if (password !== confirmPassword) return alert("Passwords do not match");

      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, username, password })
        });
        if (!res.ok) throw new Error(await res.text());
        document.getElementById('successMessage').style.display = 'block';
        this.reset();
        setTimeout(() => (window.location.href = '/login'), 2000);
      } catch (err) {
        alert("Signup failed: " + err.message);
      }
    });
  }

  else if (path.includes('/listener-login')) {
    document.getElementById('listenerLoginForm')?.addEventListener('submit', async function (e) {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/api/auth/listener-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error(await res.text());
        const user = await res.json();
        localStorage.setItem('unmute_listener', JSON.stringify(user));
        window.location.href = '/connect-session';
      } catch (err) {
        const errorBox = document.getElementById("loginError");
        if (errorBox) {
          errorBox.textContent = err.message;
          errorBox.style.display = "block";
        }
      }
    });
  }

  else if (path.includes('/listener-signup')) {
    document.getElementById('listenerSignupForm')?.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      try {
        const res = await fetch('/api/auth/listener-signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, username, password })
        });
        if (!res.ok) throw new Error(await res.text());
        document.getElementById('successMessage').style.display = 'block';
        setTimeout(() => (window.location.href = '/listener-login'), 2000);
      } catch (err) {
        alert("Signup failed: " + err.message);
      }
    });
  }

  else if (path.includes('/account-settings-listener')) {
    const user = JSON.parse(localStorage.getItem('unmute_listener') || 'null');
    if (user) {
      document.getElementById('name').value = user.name || '';
      document.getElementById('email').value = user.email || '';
    }

    document.getElementById('settingsForm')?.addEventListener('submit', async function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();

      const res = await fetch('/api/auth/update-listener', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, name, email })
      });
      if (res.ok) {
        localStorage.setItem("unmute_listener", JSON.stringify({ ...user, name, email }));
        document.getElementById("statusMsg").style.display = "block";
      }
    });
  }

  else if (path.includes('/account-settings-speaker')) {
    const speaker = JSON.parse(localStorage.getItem("unmute_speaker") || '{}');
    document.getElementById("name").value = speaker.name || "";

    document.getElementById("speakerSettingsForm")?.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      localStorage.setItem("unmute_speaker", JSON.stringify({ name }));
      document.getElementById("statusMsg").style.display = "block";
    });
  }

  else if (path.includes('/speaker-entry')) {
    document.getElementById("speakerForm")?.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      localStorage.setItem("unmute_speaker", JSON.stringify({ name }));
      window.location.href = "/connect-session";
    });
  }

  else if (path.includes('/connect-session')) {
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
}
