import fs from 'fs';

const sw = fs.readFileSync('client/dist/sw.js', 'utf8');
if (!sw.includes("self.addEventListener('install'") || !sw.includes('caches.open')) {
  throw new Error('Service worker missing offline cache logic');
}
if (!sw.includes("self.addEventListener('fetch'") ) {
  throw new Error('Service worker missing fetch handler');
}
console.log('Offline service worker cache logic present');
