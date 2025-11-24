const fs = require('fs');
const https = require('https');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

async function downloadPage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        ensureDir(path.dirname(filename));
        fs.writeFileSync(filename, data, 'utf8');
        console.log(`✓ Downloaded ${url}`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  // Download game embed page
  await downloadPage(
    'https://survival-race.io/survival-race.embed',
    'public/survival-race.embed.html'
  );
  
  // Download actual game page
  await downloadPage(
    'https://survival-race.io/game/survival-race/',
    'public/game/survival-race/index.html'
  );
  
  console.log('\n✓ Game pages downloaded!');
}

main().catch(console.error);
