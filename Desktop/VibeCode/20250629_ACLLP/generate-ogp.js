const puppeteer = require('puppeteer');
const path = require('path');

async function generateOGPImage() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to OGP image size
  await page.setViewport({ width: 1200, height: 630 });
  
  // Load the OGP HTML file
  await page.goto(`file://${path.join(__dirname, 'ogp-image.html')}`);
  
  // Wait for images to load
  await page.waitForLoadState('networkidle');
  
  // Take screenshot
  await page.screenshot({
    path: 'ogp-image.png',
    width: 1200,
    height: 630
  });
  
  await browser.close();
  console.log('OGP image generated: ogp-image.png');
}

generateOGPImage().catch(console.error);