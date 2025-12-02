const fs = require('fs');

// Create simple colored squares as placeholders
const createIcon = (size) => {
  const svg = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#1e3a8a"/>
    <text x="50%" y="50%" font-size="${size * 0.5}" fill="white" text-anchor="middle" dominant-baseline="central" font-family="Arial">📚</text>
  </svg>`;
  return svg;
};

fs.writeFileSync('icon-192.svg', createIcon(192));
fs.writeFileSync('icon-512.svg', createIcon(512));
console.log('Icons created successfully');
