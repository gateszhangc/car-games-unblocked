const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const { URL } = require('url');

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
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

async function downloadAssets() {
  const headFile = path.join('data', 'home-head.html');
  if (!fs.existsSync(headFile)) {
    console.log('No head fragment found. Run extractHtml.js first.');
    return;
  }
  
  const headContent = fs.readFileSync(headFile, 'utf8');
  const baseUrl = 'https://survival-race.io';
  
  // Find CSS files
  const cssMatches = headContent.matchAll(/<link[^>]*href=["']([^"']+\.css[^"']*)["'][^>]*>/gi);
  const jsMatches = headContent.matchAll(/<script[^>]*src=["']([^"']+\.js[^"']*)["'][^>]*>/gi);
  
  const urls = new Set();
  for (const match of cssMatches) {
    urls.add(match[1]);
  }
  for (const match of jsMatches) {
    urls.add(match[1]);
  }
  
  for (const url of urls) {
    try {
      const fullUrl = url.startsWith('http') ? url : new URL(url, baseUrl).href;
      const filename = path.basename(new URL(fullUrl).pathname);
      const filepath = path.join('public', 'assets', filename);
      
      await downloadFile(fullUrl, filepath);
      console.log(`✓ Downloaded ${filename}`);
    } catch (err) {
      console.log(`✗ Failed to download ${url}: ${err.message}`);
    }
  }
  
  console.log('Asset download complete!');
}

downloadAssets().catch(console.error);
