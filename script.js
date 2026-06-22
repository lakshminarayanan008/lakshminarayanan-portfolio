/* =========================================================
   Lakshmi Narayanan — Portfolio interactions
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const navbar = document.getElementById("mainNav");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  // Start AOS scroll animations when the CDN library is available.
  if (window.AOS) {
    AOS.init({
      duration: 750,
      easing: "ease-out-cubic",
      once: true,
      offset: 70
    });
  }

  // Restore the selected theme or use the visitor's device preference.
  const savedTheme = localStorage.getItem("portfolio-theme");
  const deviceTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  setTheme(savedTheme || deviceTheme);

  function setTheme(theme) {
    root.setAttribute("data-bs-theme", theme);
    themeToggle.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
    document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#070b16" : "#f4f7fa";
  }

  themeToggle.addEventListener("click", () => {
    const nextTheme = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
  });

  // Typing animation for developer roles.
  const typingText = document.getElementById("typingText");
  const roles = ["Python Full Stack Developer", "Front-End Developer", "Django Developer"];
  let roleIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  function animateTyping() {
    const role = roles[roleIndex];
    typingText.textContent = role.slice(0, characterIndex);

    if (!deleting && characterIndex < role.length) {
      characterIndex++;
      setTimeout(animateTyping, 70);
    } else if (!deleting) {
      deleting = true;
      setTimeout(animateTyping, 1450);
    } else if (characterIndex > 0) {
      characterIndex--;
      setTimeout(animateTyping, 35);
    } else {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(animateTyping, 250);
    }
  }
  animateTyping();

  // Reveal cards and sections as they enter the viewport.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  // Fill each skill bar the first time the skills section becomes visible.
  const skillBars = document.querySelectorAll(".skill-row i[data-level]");
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = `${entry.target.dataset.level}%`;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });
  skillBars.forEach((bar) => skillObserver.observe(bar));

  // Keep the navigation state in sync with the scroll position.
  function updateNavigation() {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
    let activeSection = "home";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 170) activeSection = section.id;
    });
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${activeSection}`));
  }
  window.addEventListener("scroll", updateNavigation, { passive: true });
  updateNavigation();

  // Collapse the mobile navigation after a link is selected.
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992 && navMenu.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
      }
    });
  });
});
