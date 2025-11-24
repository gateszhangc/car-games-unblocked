const fs = require('fs');
const path = require('path');

function combineFragments() {
  const headPath = path.join('data', 'home-head.html');
  const bodyPath = path.join('data', 'home-body.html');
  
  if (!fs.existsSync(headPath) || !fs.existsSync(bodyPath)) {
    console.log('Missing head or body fragments. Run extractHtml.js first.');
    return;
  }
  
  const head = fs.readFileSync(headPath, 'utf8');
  const body = fs.readFileSync(bodyPath, 'utf8');
  
  const html = `<!DOCTYPE html>
<html>
<head>
${head}
</head>
<body>
${body}
</body>
</html>`;
  
  fs.writeFileSync(path.join('public', 'original.html'), html, 'utf8');
  console.log('✓ Created public/original.html');
}

combineFragments();
