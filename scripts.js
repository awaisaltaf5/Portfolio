// Initialize EmailJS with your Public Key (replace with your actual key)
emailjs.init("ER6VjjztnDtX4qUCR");

// Smooth scroll for nav links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

function scrollToSection(id) {
  const targetElement = document.getElementById(id);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth' });
  }
}

// Theme toggle functionality
const themeSwitch = document.getElementById('theme-switch');
const slider = document.querySelector('.slider');

if (themeSwitch && slider) {
  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(savedTheme);
  if (savedTheme === 'dark') {
    themeSwitch.checked = true;
  }

  themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    // Update particle colors
    if (typeof particles !== 'undefined') {
      particles.forEach(p => {
        p.color = isDark ? '#8a83ff' : '#d0d2f7';
      });
    }
    // Add scale animation on toggle
    slider.style.transform = 'scale(1.15)';
    setTimeout(() => {
      slider.style.transform = 'scale(1)';
    }, 300);
  });
}

// Contact form submission with EmailJS
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const submitButton = this.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    const notification = document.getElementById('notification');

    emailjs.sendForm('service_th3c82o', 'template_0sw6lvi', this)
      .then(function(response) {
        if (notification) {
          notification.classList.add('show');
          contactForm.reset();
        }
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
        }
        if (notification) {
          setTimeout(() => {
            notification.classList.remove('show');
          }, 3000);
        }
      }, function(error) {
        alert('Failed to send message. Please try again later.');
        console.error('EmailJS Error:', error);
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Send Message';
        }
      });
  });
}

// Dynamic footer year
const currentYearElement = document.getElementById('current-year');
if (currentYearElement) {
  currentYearElement.textContent = new Date().getFullYear();
}

// Network particle animation
const canvas = document.getElementById('networkCanvas');
const ctx = canvas?.getContext('2d');
let width, height;
let particles = [];

function resizeCanvas() {
  if (canvas) {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    // Reposition particles on resize
    particles.forEach(p => {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
    });
  }
}

if (canvas) {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const numParticles = Math.min(20, Math.floor(window.innerWidth / 50)); // Dynamic particle count based on screen width
  const maxDistance = 150;

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.color = document.body.classList.contains('dark') ? '#8a83ff' : '#d0d2f7';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      if (ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }
  }

  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }

  let animationTime = 0;
  const animationDuration = 12000;

  function animate() {
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      animationTime = (Date.now() % animationDuration) / animationDuration;

      const isDark = document.body.classList.contains('dark');
      const colorT = Math.abs(animationTime - 0.5) * 2;
      let r, g, b;
      if (isDark) {
        r = Math.round(138 + (90 - 138) * colorT);
        g = Math.round(131 + (84 - 131) * colorT);
        b = Math.round(255 + (204 - 255) * colorT);
      } else {
        r = Math.round(208 + (74 - 208) * colorT);
        g = Math.round(210 + (66 - 210) * colorT);
        b = Math.round(247 + (192 - 247) * colorT);
      }
      const currentColor = `rgb(${r}, ${g}, ${b})`;

      particles.forEach(p => {
        p.color = currentColor;
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${1 - distance / maxDistance})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
  }

  animate();
}