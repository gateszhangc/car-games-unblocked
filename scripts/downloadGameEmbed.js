const fs = require('fs');
const https = require('https');

async function downloadPage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        fs.writeFileSync(filename, data, 'utf8');
        console.log(`✓ Downloaded ${url} to ${filename}`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function main() {
  await downloadPage('https://survival-race.io/survival-race.embed', 'survival-race.embed.html');
  console.log('Game embed download complete!');
}

main().catch(console.error);
