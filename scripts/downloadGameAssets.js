const fs = require('fs');
const https = require('https');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        fs.unlinkSync(filepath);
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        fs.unlinkSync(filepath);
        return reject(new Error(`Status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function main() {
  const baseUrl = 'https://survival-race.io/game/survival-race/';
  const files = [
    'Build/yandexBrotli.loader.js',
    'Build/yandexBrotli.framework.js.br',
    'Build/yandexBrotli.data.br',
    'Build/yandexBrotli.wasm.br'
  ];
  
  for (const file of files) {
    try {
      const url = baseUrl + file;
      const localPath = path.join('public', 'game', 'survival-race', file);
      ensureDir(path.dirname(localPath));
      
      await downloadFile(url, localPath);
      console.log(`✓ Downloaded ${file}`);
    } catch (err) {
      console.log(`✗ Failed: ${file} - ${err.message}`);
    }
  }
  
  console.log('\n✓ Game assets downloaded!');
}

main().catch(console.error);
