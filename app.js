document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavbar();
  initSmoothScroll();
  initStatCounters();
  initContactForm();
});

// Navbar functionality
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  // Toggle mobile menu
  navToggle.addEventListener('click', function() {
    navMenu.classList.toggle('active');
  });
  
  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
    });
  });
  
  // Change navbar style on scroll
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

// Smooth scrolling for navigation links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navbarHeight = document.getElementById('navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Animated counters for statistics
function initStatCounters() {
  const statsSection = document.querySelector('.stats-grid');
  if (!statsSection) return;
  
  const counters = document.querySelectorAll('.stat-number');
  let started = false;
  
  function startCounting() {
    if (started) return;
    
    const sectionTop = statsSection.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    
    if (sectionTop < windowHeight * 0.75) {
      started = true;
      
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        function updateCounter() {
          const currentTime = Date.now();
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          
          // Easing function for smoother animation
          const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          
          const currentValue = Math.floor(ease(progress) * target);
          counter.textContent = currentValue;
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target;
          }
        }
        
        updateCounter();
      });
    }
  }
  
  // Check on scroll and on load
  window.addEventListener('scroll', startCounting);
  window.addEventListener('load', startCounting);
}

// Contact form validation and submission
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();
    
    // Simple validation
    if (name === '' || email === '' || subject === '' || message === '') {
      showFormMessage('Please fill in all fields', 'error');
      return;
    }
    
    if (!isValidEmail(email)) {
      showFormMessage('Please enter a valid email address', 'error');
      return;
    }
    
    // Simulate form submission
    submitForm(name, email, subject, message);
  });
  
  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
  
  function submitForm(name, email, subject, message) {
    // Show loading state
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Success case
      showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
      contactForm.reset();
      
      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }, 1500);
  }
  
  function showFormMessage(message, type) {
    // Remove any existing message
    const existingMessage = contactForm.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type === 'error' ? 'form-message-error' : 'form-message-success'}`;
    messageElement.textContent = message;
    
    // Add message to the top of the form
    contactForm.prepend(messageElement);
    
    // Automatically remove the message after 5 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }
}

// Helper function to check if an element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}