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
const certSlider = document.getElementById("certSlider");
const certPrev = document.querySelector(".cert-prev");
const certNext = document.querySelector(".cert-next");
const certDots = document.querySelectorAll(".cert-dot");

if (certSlider && certPrev && certNext && certDots.length) {
  const certCards = certSlider.querySelectorAll(".cert-badge");

  function scrollToCert(index) {
    const card = certCards[index];
    if (!card) return;

    certSlider.scrollTo({
      left: card.offsetLeft - certSlider.offsetLeft,
      behavior: "smooth"
    });

    certDots.forEach(dot => dot.classList.remove("active"));
    certDots[index].classList.add("active");
  }

  certPrev.addEventListener("click", () => {
    const currentIndex = [...certDots].findIndex(dot => dot.classList.contains("active"));
    const nextIndex = currentIndex <= 0 ? certCards.length - 1 : currentIndex - 1;
    scrollToCert(nextIndex);
  });

  certNext.addEventListener("click", () => {
    const currentIndex = [...certDots].findIndex(dot => dot.classList.contains("active"));
    const nextIndex = currentIndex >= certCards.length - 1 ? 0 : currentIndex + 1;
    scrollToCert(nextIndex);
  });

  certDots.forEach((dot, index) => {
    dot.addEventListener("click", () => scrollToCert(index));
  });

  certSlider.addEventListener("scroll", () => {
    const sliderCenter = certSlider.scrollLeft + certSlider.offsetWidth / 2;

    let activeIndex = 0;
    let closestDistance = Infinity;

    certCards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(sliderCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        activeIndex = index;
      }
    });

    certDots.forEach(dot => dot.classList.remove("active"));
    certDots[activeIndex].classList.add("active");
  });
}
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
// Project showcase logic
const projectData = {
  yalla: {
    category: "Senior Project • 2025",
    title: "YallaService",
    summary: "Service marketplace web platform connecting users with local professionals in Lebanon.",
    role: "Built core front-end pages, designed the provider search experience, structured the service marketplace flow, and prepared project documentation for the senior project.",
    features: [
      "Provider search interface",
      "Service category and location filtering",
      "Responsive marketplace layout",
      "User-friendly service discovery flow"
    ],
    images: [
      {
        src: "assets/projects/yallaservice-find-providers.png",
        caption: "Provider search page with category, location, and keyword filtering."
      },
      {
        src: "assets/projects/yallaservice-concept.png",
        caption: "Concept visual representing a Lebanese service marketplace platform."
      }
    ]
  },
  blood: {
    category: "Database Project • 2024",
    title: "Blood Donation Database",
    summary: "Relational database system for managing donors, patients, blood banks, and medical records.",
    role: "Designed the schema, created table relationships, structured donor and patient records, and wrote SQL queries for medical and donor information retrieval.",
    features: [
      "Normalized relational database structure",
      "Primary and foreign key relationships",
      "Donor and patient record management",
      "Medical history tracking",
      "SQL query filtering and retrieval"
    ],
    images: [
      {
        src: "assets/projects/blood-relationships.png",
        caption: "Relational schema connecting donors, patients, blood banks, diseases, and medical history tables."
      },
      {
        src: "assets/projects/blood-query.png",
        caption: "SQL query retrieving donors diagnosed with hypertension by joining donor and medical history tables."
      },
      {
        src: "assets/projects/blood-patient-table.png",
        caption: "Patient table storing patient identity, date of birth, blood type, and Rh factor."
      }
    ]
  }
};

const projectOrder = ["yalla", "blood"];
let activeProjectIndex = 0;
let modalProjectKey = "yalla";
let modalImageIndex = 0;

const projectTabs = document.querySelectorAll(".project-tab");
const projectPanels = document.querySelectorAll("[data-project-panel]");
const projectPrev = document.getElementById("projectPrev");
const projectNext = document.getElementById("projectNext");
const nextProjectButtons = document.querySelectorAll("[data-next-project]");
const projectModal = document.getElementById("projectModal");
const modalImage = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const modalCategory = document.getElementById("modalCategory");
const modalProjectTitle = document.getElementById("modalProjectTitle");
const modalSummary = document.getElementById("modalSummary");
const modalRole = document.getElementById("modalRole");
const modalFeatures = document.getElementById("modalFeatures");
const modalDots = document.getElementById("modalDots");
const modalPrev = document.getElementById("modalPrev");
const modalNext = document.getElementById("modalNext");

function selectProject(key) {
  const index = projectOrder.indexOf(key);
  activeProjectIndex = index >= 0 ? index : 0;

  projectTabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.project === key));
  projectPanels.forEach((panel) => panel.classList.toggle("active", panel.dataset.projectPanel === key));
}

function moveProject(direction) {
  activeProjectIndex = (activeProjectIndex + direction + projectOrder.length) % projectOrder.length;
  selectProject(projectOrder[activeProjectIndex]);
}

projectTabs.forEach((tab) => {
  tab.addEventListener("click", () => selectProject(tab.dataset.project));
});

if (projectPrev) projectPrev.addEventListener("click", () => moveProject(-1));
if (projectNext) projectNext.addEventListener("click", () => moveProject(1));
nextProjectButtons.forEach((button) => button.addEventListener("click", () => moveProject(1)));

document.querySelectorAll(".project-thumb").forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const frame = thumb.closest(".project-preview-frame");
    const image = frame.querySelector(".project-main-image");
    image.src = thumb.dataset.src;
    image.alt = thumb.dataset.caption || "Project screenshot";
    frame.querySelectorAll(".project-thumb").forEach((item) => item.classList.remove("active"));
    thumb.classList.add("active");
  });
});

function renderModal() {
  const project = projectData[modalProjectKey];
  const imageData = project.images[modalImageIndex];

  modalImage.src = imageData.src;
  modalImage.alt = imageData.caption;
  modalCaption.textContent = imageData.caption;
  modalCategory.textContent = project.category;
  modalProjectTitle.textContent = project.title;
  modalSummary.textContent = project.summary;
  modalRole.textContent = project.role;

  modalFeatures.innerHTML = "";
  project.features.forEach((feature) => {
    const li = document.createElement("li");
    li.textContent = feature;
    modalFeatures.appendChild(li);
  });

  modalDots.innerHTML = "";
  project.images.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = `modal-dot${index === modalImageIndex ? " active" : ""}`;
    dot.type = "button";
    dot.setAttribute("aria-label", `Show screenshot ${index + 1}`);
    dot.addEventListener("click", () => {
      modalImageIndex = index;
      renderModal();
    });
    modalDots.appendChild(dot);
  });
}

function openProjectModal(key) {
  if (!projectData[key] || !projectModal) return;
  modalProjectKey = key;
  modalImageIndex = 0;
  renderModal();
  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-open-project]").forEach((button) => {
  button.addEventListener("click", () => openProjectModal(button.dataset.openProject));
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeProjectModal);
});

if (modalPrev) {
  modalPrev.addEventListener("click", () => {
    const total = projectData[modalProjectKey].images.length;
    modalImageIndex = (modalImageIndex - 1 + total) % total;
    renderModal();
  });
}

if (modalNext) {
  modalNext.addEventListener("click", () => {
    const total = projectData[modalProjectKey].images.length;
    modalImageIndex = (modalImageIndex + 1) % total;
    renderModal();
  });
}




document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal && projectModal.classList.contains("open")) {
    closeProjectModal();
  }
});

/* ===== Certificate slider arrows ===== */
document.addEventListener("DOMContentLoaded", () => {
  const certSlider = document.querySelector("#certSlider");
  const certPrev = document.querySelector(".cert-prev");
  const certNext = document.querySelector(".cert-next");
  const certDots = document.querySelectorAll(".cert-dot");

  if (!certSlider || !certPrev || !certNext) return;

  const certCards = Array.from(certSlider.querySelectorAll(".cert-badge"));
  let currentCertIndex = 0;

  function updateDots(index) {
    certDots.forEach((dot) => dot.classList.remove("active"));
    if (certDots[index]) {
      certDots[index].classList.add("active");
    }
  }

  function goToCert(index) {
    if (!certCards.length) return;
    if (index < 0) index = certCards.length - 1;
    if (index >= certCards.length) index = 0;
    currentCertIndex = index;
    certCards[index].scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
    updateDots(index);
  }

  certPrev.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    goToCert(currentCertIndex - 1);
  });

  certNext.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    goToCert(currentCertIndex + 1);
  });

  certDots.forEach((dot, index) => {
    dot.addEventListener("click", (event) => {
      event.preventDefault();
      goToCert(index);
    });
  });

  certSlider.addEventListener("scroll", () => {
    const sliderCenter = certSlider.scrollLeft + certSlider.offsetWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    certCards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(sliderCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    currentCertIndex = closestIndex;
    updateDots(closestIndex);
  });
});

