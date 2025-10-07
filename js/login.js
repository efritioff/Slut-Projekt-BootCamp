console.log("Login.js loaded");

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const registerLink = document.getElementById('registerLink');
const loginLink = document.getElementById('loginLink');
const formTitle = document.getElementById('formTitle');

registerLink.addEventListener('click', () => {
  loginForm.style.display = 'none';
  registerForm.style.display = 'block';
  formTitle.textContent = 'Registrera';
});

loginLink.addEventListener('click', () => {
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';
  formTitle.textContent = 'Logga in';
});
