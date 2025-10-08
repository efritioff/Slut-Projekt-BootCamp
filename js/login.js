console.log("Login.js loaded (hardcoded-login)");

// Hårdkodad inloggning
const HARDCODED_USER = {
  email: 'admin@gmail.com',
  password: '123456',
  username: 'Admin'
};

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;

    if (email === HARDCODED_USER.email && password === HARDCODED_USER.password) {
      // markera inloggad
      localStorage.setItem('loggedInUserEmail', HARDCODED_USER.email);
      localStorage.setItem('loggedInUsername', HARDCODED_USER.username);
      // redirectera till profil (samma som tidigare projekt)
      window.location.href = '/pages/profil.html';
    } else {
      alert('Fel e-post eller lösenord.');
    }
  });
});
  const registerLink = document.getElementById("registerLink");
