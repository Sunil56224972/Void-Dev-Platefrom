const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE = 'https://www.onehackhackerscult.xyz';
const OUT = __dirname;

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    fs.mkdirSync(dir, { recursive: true });
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { file.close(); reject(err); });
  });
}

async function main() {
  // Step 1: Download main HTML
  console.log('=== SCRAPING WEBSITE ===');
  console.log('Downloading index.html...');
  await download(BASE + '/', path.join(OUT, 'index.html'));

  // Step 2: Read HTML and find all asset URLs
  const html = fs.readFileSync(path.join(OUT, 'index.html'), 'utf8');
  const assets = new Set();

  // Find /assets/... references
  const regex1 = /(?:href|src|content)="(\/assets\/[^"]+)"/g;
  let m;
  while ((m = regex1.exec(html)) !== null) assets.add(m[1]);

  // Find other root-level files like /favicon.jpeg, /og.png
  const regex2 = /(?:href|src|content)="(\/(?:favicon|og)[^"]*\.(?:jpeg|jpg|png|ico|webp|svg))"/g;
  while ((m = regex2.exec(html)) !== null) assets.add(m[1]);

  // Find modulepreload JS files
  const regex3 = /href="(\/assets\/[^"]+\.js)"/g;
  while ((m = regex3.exec(html)) !== null) assets.add(m[1]);

  console.log(`Found ${assets.size} assets to download\n`);

  // Step 3: Download all assets
  let done = 0;
  let failed = 0;
  for (const asset of assets) {
    const url = BASE + encodeURI(decodeURIComponent(asset)).replace(/%25/g, '%');
    const dest = path.join(OUT, decodeURIComponent(asset));
    try {
      process.stdout.write(`  [${++done}/${assets.size}] ${decodeURIComponent(asset).substring(0, 60)}...`);
      await download(BASE + asset, dest);
      console.log(' OK');
    } catch (err) {
      failed++;
      console.log(` FAIL (${err.message})`);
    }
  }

  console.log(`\n=== DONE === ${done - failed} downloaded, ${failed} failed`);
  console.log('Starting local server...');
}

main().catch(console.error);
