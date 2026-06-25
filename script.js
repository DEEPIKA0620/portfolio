// ===== DOM Elements =====
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const navbar = document.querySelector('.navbar');
const typingText = document.querySelector('.typing-text');
const skillBars = document.querySelectorAll('.skill-progress');
const contactForm = document.querySelector('.contact-form');
const resumeDownloadBtn = document.getElementById('resumeDownload');

// ===== Theme Toggle =====
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ===== Typing Animation =====
const texts = ['Data Scientist', 'ML Engineer', 'Data Analyst', 'NLP Specialist'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 1500;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500;
    }
    
    setTimeout(typeText, typingSpeed);
}

// ===== Mobile Menu =====
function toggleMobileMenu() {
    navLinks.classList.toggle('mobile-open');
    const icon = mobileMenuBtn.querySelector('i');
    icon.className = navLinks.classList.contains('mobile-open') ? 'fas fa-times' : 'fas fa-bars';
}

// ===== Active Navigation Link =====
function setActiveLink() {
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinksItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ===== Navbar Scroll Effect =====
function handleScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    setActiveLink();
    
    // Animate skill bars when in view
    if (isElementInViewport(document.querySelector('.skills'))) {
        animateSkillBars();
    }
}

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
    );
}

// ===== Animate Skill Bars =====
let skillBarsAnimated = false;

function animateSkillBars() {
    if (skillBarsAnimated) return;
    
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease';
            bar.style.width = width;
        }, 200);
    });
    
    skillBarsAnimated = true;
}

// ===== Resume Download Button =====
function handleResumeDownload(e) {
    // You can add download tracking here
    console.log('Resume download initiated');
    // The download will happen automatically via the HTML download attribute[citation:3]
}

// ===== Project Popups =====
function initProjectPopups() {
    const viewDetailButtons = document.querySelectorAll('.view-details');
    const popups = document.querySelectorAll('.project-popup');
    const closeButtons = document.querySelectorAll('.popup-close, .close-popup');
    
    viewDetailButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = button.getAttribute('data-project');
            const popup = document.getElementById(`project-popup-${projectId}`);
            
            if (popup) {
                popup.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            popups.forEach(popup => {
                popup.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close popup when clicking outside
    popups.forEach(popup => {
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            popups.forEach(popup => {
                popup.style.display = 'none';
            });
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== Form Submission =====
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to a server
    console.log('Form submitted:', data);
    
    // Show success message
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
    }, 3000);
}

// ===== Smooth Scrolling =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('mobile-open')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

// ===== Initialize Animations =====
function initAnimations() {
    // Add fade-in animation to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all section children for animation
    sections.forEach(section => {
        const children = section.querySelectorAll('.skill-category, .project-card, .timeline-item, .contact-card');
        children.forEach((child, index) => {
            child.classList.add(`delay-${(index % 5) + 1}`);
            observer.observe(child);
        });
    });
}

// ===== Initialize Everything =====
function init() {
    // Initialize theme
    initTheme();
    themeToggle.addEventListener('click', toggleTheme);
    
    // Initialize typing animation
    typeText();
    
    // Initialize mobile menu
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('mobile-open')) {
                toggleMobileMenu();
            }
        });
    });
    
    // Initialize smooth scrolling
    initSmoothScroll();
    
    // Initialize project popups
    initProjectPopups();
    
    // Initialize form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Initialize resume download
    if (resumeDownloadBtn) {
        resumeDownloadBtn.addEventListener('click', handleResumeDownload);
    }
    
    // Initialize animations
    initAnimations();
    
    // Set up scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial scroll check
    handleScroll();
}

// ===== Run when DOM is loaded =====
document.addEventListener('DOMContentLoaded', init);

// ===== Handle Window Resize =====
window.addEventListener('resize', () => {
    // Close mobile menu on resize if open
    if (window.innerWidth > 768 && navLinks.classList.contains('mobile-open')) {
        toggleMobileMenu();
    }
});