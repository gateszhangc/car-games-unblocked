const { chromium } = require('playwright');

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    javaScriptEnabled: false
  });
  
  // Capture original site
  const page1 = await context.newPage();
  await page1.goto('https://survival-race.io/', { waitUntil: 'networkidle' });
  await page1.screenshot({ path: 'screenshots/original.png', fullPage: true });
  console.log('✓ Captured original site screenshot');
  
  // Capture local clone
  const page2 = await context.newPage();
  await page2.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page2.screenshot({ path: 'screenshots/clone.png', fullPage: true });
  console.log('✓ Captured clone screenshot');
  
  await browser.close();
  console.log('Screenshot capture complete!');
}

captureScreenshots().catch(console.error);
