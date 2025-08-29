// Initialize EmailJS with your Public Key
emailjs.init("ER6VjjztnDtX4qUCR");

// Smooth scroll for nav links
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    scrollToSection(targetId);
  });
});

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Theme toggle functionality
const themeSwitch = document.getElementById('theme-switch');
const slider = document.querySelector('.slider');

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
  // Update particle colors and other theme-dependent elements
  particles.forEach(p => {
    p.color = isDark ? '#8a83ff' : '#d0d2f7';
  });
  // Add scale animation on toggle
  slider.style.transform = 'scale(1.15)';
  setTimeout(() => {
    slider.style.transform = 'scale(1)';
  }, 300);
});

// Contact form submission with EmailJS
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Disable the submit button to prevent multiple submissions
  const submitButton = this.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  // Get the notification element
  const notification = document.getElementById('notification');

  // Send form data using EmailJS
  emailjs.sendForm('service_th3c82o', 'template_0sw6lvi', this)
    .then(function(response) {
      // Show notification
      notification.classList.add('show');
      // Reset form
      document.getElementById('contact-form').reset();
      // Reset button
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
      // Hide notification after 3 seconds
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }, function(error) {
      alert('Failed to send message. Please try again later.');
      console.error('EmailJS Error:', error);
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    });
});

// Dynamic footer year
document.getElementById('current-year').textContent = new Date().getFullYear();

// Network particle animation
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
let width, height;

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const numParticles = 30; // Reduced for better performance
const maxDistance = 150;

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.color = document.body.classList.contains('dark') ? '#8a83ff' : '#d0d2f7';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

for (let i = 0; i < numParticles; i++) {
  particles.push(new Particle());
}

let animationTime = 0;
const animationDuration = 12000; // 12s for color cycle

function animate() {
  ctx.clearRect(0, 0, width, height);
  animationTime = (Date.now() % animationDuration) / animationDuration;

  // Update particle colors based on animation time and theme
  const isDark = document.body.classList.contains('dark');
  const colorT = Math.abs(animationTime - 0.5) * 2; // 0 to 1
  let r, g, b;
  if (isDark) {
    // Dark mode: Transition from #8a83ff to #5a54cc
    r = Math.round(138 + (90 - 138) * colorT);
    g = Math.round(131 + (84 - 131) * colorT);
    b = Math.round(255 + (204 - 255) * colorT);
  } else {
    // Light mode: Transition from #d0d2f7 to #4a42c0
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

  // Draw lines between nearby particles
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

animate();