const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');
const { URL } = require('url');

const baseUrl = 'https://survival-race.io';
const downloadedUrls = new Set();

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    if (downloadedUrls.has(url)) {
      console.log(`⊘ Skipped (already downloaded): ${url}`);
      return resolve();
    }
    
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
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
        downloadedUrls.add(url);
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
  const bodyFile = path.join('data', 'home-body.html');
  
  if (!fs.existsSync(headFile)) {
    console.log('No fragments found. Run extract first.');
    return;
  }
  
  const headContent = fs.readFileSync(headFile, 'utf8');
  const bodyContent = fs.readFileSync(bodyFile, 'utf8');
  const fullContent = headContent + bodyContent;
  
  // Extract all resource URLs
  const cssRegex = /<link[^>]*href=["']([^"']+\.css[^"']*)["'][^>]*>/gi;
  const jsRegex = /<script[^>]*src=["']([^"']+\.js[^"']*)["'][^>]*>/gi;
  const imgRegex = /(?:src|href)=["']([^"']+\.(?:jpg|jpeg|png|gif|webp|svg|ico)[^"']*)["']/gi;
  
  const urls = new Set();
  
  // Collect CSS
  let match;
  while ((match = cssRegex.exec(fullContent)) !== null) {
    urls.add(match[1]);
  }
  
  // Collect JS (skip external domains)
  while ((match = jsRegex.exec(fullContent)) !== null) {
    const url = match[1];
    if (!url.includes('google') && !url.includes('gstatic')) {
      urls.add(url);
    }
  }
  
  // Collect images
  while ((match = imgRegex.exec(fullContent)) !== null) {
    urls.add(match[1]);
  }
  
  console.log(`Found ${urls.size} resources to download\n`);
  
  for (const url of urls) {
    try {
      const fullUrl = url.startsWith('http') ? url : new URL(url, baseUrl).href;
      const urlPath = new URL(fullUrl).pathname;
      const localPath = path.join('public', urlPath);
      
      ensureDir(path.dirname(localPath));
      
      await downloadFile(fullUrl, localPath);
      console.log(`✓ ${urlPath}`);
    } catch (err) {
      console.log(`✗ Failed: ${url} - ${err.message}`);
    }
  }
  
  console.log('\n✓ Asset download complete!');
}

downloadAssets().catch(console.error);
