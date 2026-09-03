// Generates config.js from environment variables at deploy time (e.g. on Vercel).
// Run with: node generate-config.js
// Set these env vars in your hosting dashboard:
//   EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID

const fs = require('fs');

const publicKey = process.env.EMAILJS_PUBLIC_KEY;
const serviceId = process.env.EMAILJS_SERVICE_ID;
const templateId = process.env.EMAILJS_TEMPLATE_ID;

if (!publicKey || !serviceId || !templateId) {
  console.error('Missing EmailJS environment variables (EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID)');
  process.exit(1);
}

const content = `// Auto-generated at deploy time from environment variables - do not commit.
window.APP_CONFIG = {
  emailjs: {
    publicKey: "${publicKey}",
    serviceId: "${serviceId}",
    templateId: "${templateId}"
  }
};
`;

fs.writeFileSync('config.js', content);
console.log('config.js generated successfully.');
