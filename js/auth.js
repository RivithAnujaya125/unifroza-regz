/* ============================================================
   auth.js — Firebase Authentication for UniFroza Regz
   ============================================================ */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDFCBEomG5ifRcjkmCW-Ed5nylvgH8lIOY",
  authDomain: "unifroza-regz.firebaseapp.com",
  projectId: "unifroza-regz",
  storageBucket: "unifroza-regz.firebasestorage.app",
  messagingSenderId: "57260294510",
  appId: "1:57260294510:web:b65879649e4b879d4c817f",
  measurementId: "G-BR0MWK54MV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Global state for current user
window.currentUser = null;

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.currentUser = user;
    updateNavbar(true);

    // If on login/register page, redirect to Vault
    if (window.location.pathname.includes('login') || window.location.pathname.includes('register')) {
      window.location.href = 'downloads.html';
    }

    // If on Vault, show username
    const dashUsername = document.getElementById('dash-username');
    if (dashUsername) {
      dashUsername.textContent = user.displayName || user.email.split('@')[0];
    }
    
    // Show vault content if it was hidden
    const vaultContent = document.getElementById('vault-content');
    if(vaultContent) vaultContent.style.display = 'block';

  } else {
    window.currentUser = null;
    updateNavbar(false);

    // If they are on the Vault page, redirect to register
    if (window.location.pathname.includes('downloads')) {
      window.location.href = 'register.html';
    }
  }
});

/**
 * Register a new user with Firebase (Email/Password)
 */
export async function registerUser(username, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Set the display name to the username they chose
    await updateProfile(userCredential.user, { displayName: username });
    return { success: true, message: 'Account created successfully.' };
  } catch (error) {
    console.error("Firebase Registration Error: ", error);
    let msg = error.message;
    if (error.code === 'auth/email-already-in-use') msg = 'Email is already in use.';
    if (error.code === 'auth/weak-password') msg = 'Password is too weak (min 6 chars).';
    if (error.code === 'auth/invalid-email') msg = 'Invalid email address.';
    return { success: false, message: msg };
  }
}

/**
 * Login a user with Firebase (Email/Password)
 */
export async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true, message: 'Login successful.' };
  } catch (error) {
    console.error("Firebase Login Error: ", error);
    return { success: false, message: error.message };
  }
}

/**
 * Logout the current user from Firebase
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    window.location.href = 'index.html';
  } catch (error) {
    console.error("Logout error:", error);
  }
}

/**
 * Update the navbar to reflect the current auth state.
 */
function updateNavbar(isLoggedIn) {
  const loginEl     = document.getElementById('nav-login');
  const registerEl  = document.getElementById('nav-register');
  const dashboardEl = document.getElementById('nav-dashboard'); // Vault link
  const logoutEl    = document.getElementById('nav-logout');

  if (isLoggedIn) {
    if (loginEl)     loginEl.style.display     = 'none';
    if (registerEl)  registerEl.style.display  = 'none';
    if (dashboardEl) dashboardEl.style.display = '';
    if (logoutEl)    logoutEl.style.display    = '';
  } else {
    if (loginEl)     loginEl.style.display     = '';
    if (registerEl)  registerEl.style.display  = '';
    if (dashboardEl) dashboardEl.style.display = 'none'; // Hide Vault from guests
    if (logoutEl)    logoutEl.style.display    = 'none';
  }
}

/* ============================================================
   Form Helpers — exported for use in login.html and register.html
   ============================================================ */

export function showFieldError(inputId, message) {
  const input   = document.getElementById(inputId);
  const errorEl = document.getElementById(inputId + '-error');
  if (input)   input.classList.add('error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

export function clearErrors() {
  document.querySelectorAll('.form-group input').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.form-error').forEach(el => (el.style.display = 'none'));
}

export function showToast(message, type) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className   = 'toast toast--' + type + ' show';

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ============================================================
   GLOBAL MUSIC PLAYER
   ============================================================ */
function initMusicPlayer() {
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  
  if (bgMusic && musicToggle) {
    bgMusic.volume = 0.4;
    
    // Try to play immediately (might be blocked by browser)
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Auto-play was prevented. Show muted icon.
        musicToggle.textContent = '🔇';
      });
    }

    musicToggle.addEventListener('click', () => {
      if (bgMusic.paused) {
        bgMusic.play();
        musicToggle.textContent = '🎵';
      } else {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
      }
    });
  }
}

// Run immediately for modules
initMusicPlayer();
