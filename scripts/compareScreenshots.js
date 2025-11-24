const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');

function compareScreenshots() {
  const img1 = PNG.sync.read(fs.readFileSync('screenshots/original.png'));
  const img2 = PNG.sync.read(fs.readFileSync('screenshots/clone.png'));
  
  const { width, height } = img1;
  const diff = new PNG({ width, height });
  
  const numDiffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );
  
  fs.writeFileSync('screenshots/diff.png', PNG.sync.write(diff));
  
  const totalPixels = width * height;
  const diffPercent = ((numDiffPixels / totalPixels) * 100).toFixed(2);
  
  console.log(`Differing pixels: ${numDiffPixels} / ${totalPixels} (${diffPercent}%)`);
  console.log('✓ Saved diff to screenshots/diff.png');
}

compareScreenshots();
