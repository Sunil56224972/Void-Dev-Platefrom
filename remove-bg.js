const sharp = require('sharp');
const path = require('path');

async function removeBackground(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = Buffer.from(data);

  // First pass: identify definite foreground pixels (dark, saturated)
  const isForeground = new Uint8Array(width * height);
  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    const avg = (r + g + b) / 3;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    
    // Foreground = dark pixels OR high saturation (cyan eyes, colored text)
    if (avg < 140 || sat > 0.35) {
      isForeground[i / channels] = 1;
    }
  }

  // Second pass: set alpha based on foreground detection
  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
    const avg = (r + g + b) / 3;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const sat = max === 0 ? 0 : (max - min) / max;
    const idx = i / channels;

    if (isForeground[idx]) {
      pixels[i + 3] = 255; // fully opaque
    } else if (avg > 170) {
      // Light pixel - make transparent
      pixels[i + 3] = 0;
    } else {
      // Edge pixel - smooth transition
      const alpha = Math.max(0, Math.min(255, Math.round((170 - avg) * 3)));
      pixels[i + 3] = alpha;
    }
  }

  await sharp(pixels, { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);

  console.log('Done! Clean transparent logo saved');
}

removeBackground(
  path.join(__dirname, 'assets', 'voiddev-main.jpg'),
  path.join(__dirname, 'assets', 'voiddev-main.png')
).catch(console.error);
