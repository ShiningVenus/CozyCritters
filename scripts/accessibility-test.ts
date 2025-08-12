import fs from 'fs';

const html = fs.readFileSync('client/dist/index.html', 'utf8');
if (!html.includes('lang="')) {
  throw new Error('Missing lang attribute on html tag');
}
if (!html.includes('meta name="viewport"')) {
  throw new Error('Missing viewport meta tag');
}
console.log('Basic accessibility checks passed');
