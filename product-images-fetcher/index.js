// download_ektra_images.js
// Node.js script using puppeteer to extract images from product URLs in CSV
// Images are saved directly to my-website/public/images/
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch'); // v2
// Removed archiver - no longer creating zip files

const CSV_PATH = path.resolve(__dirname, '../my-website/public/inventory.csv');
const OUT_DIR = path.resolve(__dirname, '../my-website/public/images');

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function safeName(name) {
  return name ? name.replace(/[\/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_').slice(0,200) : 'unknown';
}

function downloadBinary(url, outPath) {
  return fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } })
    .then(res => {
      if (!res.ok) throw new Error(`Failed ${res.status} ${url}`);
      return res.buffer();
    })
    .then(buf => fs.promises.writeFile(outPath, buf));
}

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  const rows = [];

  // Read CSV and collect rows that have Matched URL
  await new Promise((res, rej) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', data => rows.push(data))
      .on('end', () => res())
      .on('error', e => rej(e));
  });

  const downloadedFolders = [];

  console.log(`\n🚀 Starting image extraction for ${rows.length} product(s)\n`);
  console.log('═'.repeat(80));

  for (const row of rows) {
    const url = (row['Matched URL'] || row['MatchedURL'] || row['Matched Url'] || '').trim();
    const desc = row['Corrected Description'] || row['Description'] || 'product';
    if (!url) continue;
    
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`🔍 Processing: ${desc}`);
    console.log(`   URL: ${url}`);

    const slug = safeName(desc);
    const productDir = path.join(OUT_DIR, slug);
    if (!fs.existsSync(productDir)) fs.mkdirSync(productDir, { recursive: true });

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    } catch (e) {
      console.warn(`⚠️  Failed to open page (maybe blocked): ${url}`);
      console.warn(`   Error: ${e.message}\n`);
      continue;
    }

    // extract image URLs from div.product-images.wd-grid-col container only
    const result = await page.evaluate(() => {
      const imageInfo = [];
      const skippedThumbnails = [];
      const seenUrls = new Set();
      
      // Function to check if image is a thumbnail
      const isThumbnail = (img) => {
        const classes = (img.className || '').toLowerCase();
        const width = img.naturalWidth || img.width || 0;
        const height = img.naturalHeight || img.height || 0;
        
        // Check for thumbnail class patterns (e.g., size-150x0, attachment-150x0)
        const thumbnailPatterns = [
          /size-\d+x\d+/i,           // size-150x0, size-100x100, etc.
          /attachment-\d+x\d+/i,     // attachment-150x0, etc.
          /thumbnail/i,               // contains "thumbnail"
          /thumb/i                   // contains "thumb"
        ];
        
        // Check if classes match thumbnail patterns
        if (thumbnailPatterns.some(pattern => pattern.test(classes))) {
          return { isThumbnail: true, reason: 'thumbnail class pattern' };
        }
        
        // Check if image dimensions are too small (likely thumbnail)
        if (width > 0 && height > 0 && (width < 300 || height < 300)) {
          return { isThumbnail: true, reason: `small dimensions (${width}x${height})` };
        }
        
        return { isThumbnail: false };
      };
      
      // Find images only within div.product-images.wd-grid-col container
      const container = document.querySelector('div.product-images.wd-grid-col');
      if (container) {
        container.querySelectorAll('img').forEach(img => {
          const thumbnailCheck = isThumbnail(img);
          
          // Skip thumbnails
          if (thumbnailCheck.isThumbnail) {
            const imgUrl = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src') || '';
            skippedThumbnails.push({
              url: imgUrl,
              classes: img.className || '',
              reason: thumbnailCheck.reason
            });
            return;
          }
          
          const urls = [];
          if (img.src) urls.push({ url: img.src, attr: 'src' });
          if (img.getAttribute('data-src')) urls.push({ url: img.getAttribute('data-src'), attr: 'data-src' });
          if (img.getAttribute('data-lazy-src')) urls.push({ url: img.getAttribute('data-lazy-src'), attr: 'data-lazy-src' });
          
          urls.forEach(({ url, attr }) => {
            if (!seenUrls.has(url)) {
              seenUrls.add(url);
              imageInfo.push({
                url: url,
                tag: img.tagName.toLowerCase(),
                classes: img.className || '',
                attribute: attr
              });
            }
          });
        });
      }
      return {
        images: imageInfo.slice(0, 20),
        skipped: skippedThumbnails
      };
    }).catch(e => { console.warn('⚠️  Evaluate failed:', e.message); return { images: [], skipped: [] }; });

    const imageData = result.images || [];
    const skippedThumbnails = result.skipped || [];

    // Log skipped thumbnails
    if (skippedThumbnails.length > 0) {
      console.log(`\n⏭️  Skipped ${skippedThumbnails.length} thumbnail(s):`);
      skippedThumbnails.forEach((thumb, idx) => {
        console.log(`   [${idx + 1}] Classes: ${thumb.classes || '(none)'} - Reason: ${thumb.reason}`);
      });
      console.log('');
    }

    if (!imageData || imageData.length === 0) {
      console.warn(`⚠️  No images found in div.product-images.wd-grid-col for: ${desc}`);
      console.warn(`   URL: ${url}\n`);
      continue;
    }

    console.log(`\n📦 Product: ${desc}`);
    console.log(`   Found ${imageData.length} image(s) in container\n`);

    // download each image
    let i = 0;
    for (const imgInfo of imageData) {
      try {
        i += 1;
        const ext = path.extname(new URL(imgInfo.url).pathname).split('?')[0] || '.jpg';
        const outFile = path.join(productDir, `${slug}_${i}${ext}`);
        
        console.log(`   [${i}/${imageData.length}] Fetching image from:`);
        console.log(`      Tag: <${imgInfo.tag}>`);
        console.log(`      Classes: ${imgInfo.classes || '(none)'}`);
        console.log(`      Attribute: ${imgInfo.attribute}`);
        console.log(`      URL: ${imgInfo.url}`);
        
        await downloadBinary(imgInfo.url, outFile);
        console.log(`      ✅ Downloaded → ${outFile}\n`);
      } catch (e) {
        console.warn(`      ❌ Failed to download: ${imgInfo.url}`);
        console.warn(`         Error: ${e.message}\n`);
      }
    }

    // Skip zip creation - images go directly to public/images
    downloadedFolders.push({ product: desc, folder: productDir });
  }

  console.log(`${'═'.repeat(80)}\n`);

  await browser.close();
  console.log(`${'═'.repeat(80)}`);
  console.log(`✨ Done! Processed ${downloadedFolders.length} product(s)`);
  console.log(`📁 Output folder: ${OUT_DIR}`);
  console.log(`${'═'.repeat(80)}\n`);
})();
