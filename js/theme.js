const toggleBtn = document.querySelector(".toggle-theme-btn");

toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    document.body.classList.toggle('light');
});