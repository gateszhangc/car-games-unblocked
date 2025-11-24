const fs = require('fs');
const path = require('path');

function extractFragments(htmlFile, baseName) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  
  // Extract head content
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (headMatch) {
    fs.writeFileSync(
      path.join('data', `${baseName}-head.html`),
      headMatch[1],
      'utf8'
    );
    console.log(`✓ Extracted head to data/${baseName}-head.html`);
  }
  
  // Extract body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    fs.writeFileSync(
      path.join('data', `${baseName}-body.html`),
      bodyMatch[1],
      'utf8'
    );
    console.log(`✓ Extracted body to data/${baseName}-body.html`);
  }
}

// Process downloaded HTML files
if (fs.existsSync('survival-race_home.html')) {
  extractFragments('survival-race_home.html', 'home');
}

console.log('Extraction complete!');
