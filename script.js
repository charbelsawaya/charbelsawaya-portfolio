const filterButtons = document.querySelectorAll(".filter-btn");
const skillItems = document.querySelectorAll(".skill-item");
const skillsGrid = document.querySelector(".skills-grid");
const skillsDotsContainer = document.getElementById("skillsDots");
const navLinks = document.querySelectorAll(".nav-links a");
const contactForm = document.getElementById("contactForm");
const tiltCards = document.querySelectorAll(".tilt");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navLinks");
const typewriterElement = document.getElementById("typewriter");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;

    skillItems.forEach((item) => {
      const category = item.dataset.category;
      item.style.display =
        filter === "all" || category === filter ? "block" : "none";
    });
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((a) => a.classList.remove("active"));
    link.classList.add("active");

    if (navMenu) {
      navMenu.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    const expanded = navMenu.classList.contains("open");
    menuToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(
      "This form is front-end only for now. Connect it to EmailJS, Formspree, or a backend endpoint."
    );
    contactForm.reset();
  });
}

// Skills Carousel Logic for Mobile
if (skillsGrid && window.innerWidth <= 980) {
  const skillCards = document.querySelectorAll(".skill-item");
  let currentIndex = 0;

  // Create dots
  function createDots() {
    skillsDotsContainer.innerHTML = "";
    skillCards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot";
      dot.setAttribute("data-index", index);
      if (index === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(index));
      skillsDotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    document.querySelectorAll(".carousel-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    const cardWidth = skillCards[0].offsetWidth + 22; // gap
    skillsGrid.scrollTo({
      left: currentIndex * cardWidth,
      behavior: "smooth"
    });
    updateDots();
  }

  // Auto scroll every 5s
  setInterval(() => {
    currentIndex = (currentIndex + 1) % skillCards.length;
    goToSlide(currentIndex);
  }, 5000);

  // Sync with scroll
  skillsGrid.addEventListener("scroll", () => {
    const scrollLeft = skillsGrid.scrollLeft;
    const cardWidth = skillCards[0].offsetWidth + 22;
    const newIndex = Math.round(scrollLeft / cardWidth);
    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
      updateDots();
    }
  });

  createDots();
}

if (typewriterElement) {
  const words = [
    "Charbel Sawaya",
    "a Developer",
    "a FreeLancer",
    "a Store Manager"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentWord = words[wordIndex];
    const currentText = currentWord.substring(0, charIndex);
    typewriterElement.textContent = currentText;

    if (!isDeleting) {
      charIndex++;

      if (charIndex > currentWord.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1200);
        return;
      }
    } else {
      charIndex--;

      if (charIndex < 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        charIndex = 0;
      }
    }

    const speed = isDeleting ? 50 : 100;
    setTimeout(typeEffect, speed);
  }

  typeEffect();
}

tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    if (window.innerWidth < 981) return;
    if (card.classList.contains("profile-card")) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    card.style.transform =
      `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});
