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

// Contact form submission with EmailJS
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();

  // Disable the submit button to prevent multiple submissions
  const submitButton = this.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  // Send form data using EmailJS
  emailjs.sendForm('service_th3c82o', 'template_0sw6lvi', this)
    .then(function(response) {
      alert('Thanks for getting in touch! I\'ll reply soon.');
      document.getElementById('contact-form').reset();
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    }, function(error) {
      alert('Failed to send message. Please try again later.');
      console.error('EmailJS Error:', error);
      submitButton.disabled = false;
      submitButton.textContent = 'Send Message';
    });
});

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
const numParticles = 50;
const maxDistance = 150;

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.color = '#d0d2f7';
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

  // Update particle colors based on animation time
  const colorT = Math.abs(animationTime - 0.5) * 2; // 0 to 1
  const r = Math.round(208 + (74 - 208) * colorT); // #d0d2f7 to #4a42c0
  const g = Math.round(210 + (66 - 210) * colorT);
  const b = Math.round(247 + (192 - 247) * colorT);
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