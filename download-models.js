const fs = require('fs');
const https = require('https');
const path = require('path');

const tsContent = fs.readFileSync(path.join(__dirname, 'lib', 'vehicle-specs-data.ts'), 'utf8');
const modelsToFetch = [];
const regex = /\{ brand:\s*'([^']+)',\s*model:\s*'([^']+)'/g;
let match;
while ((match = regex.exec(tsContent)) !== null) {
  modelsToFetch.push({ brand: match[1], model: match[2] });
}

const uniqueModels = [];
const seen = new Set();
for (const item of modelsToFetch) {
  const key = item.brand + '|' + item.model;
  if (!seen.has(key)) {
    seen.add(key);
    uniqueModels.push(item);
  }
}

const outDir = path.join(__dirname, 'public', 'models');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function downloadImage(url, dest) {
  const options = { headers: { 'User-Agent': 'FuelWiseBot/2.0 (dwita.velany@binus.ac.id)' } };
  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function run() {
  console.log("Total unique models to fetch:", uniqueModels.length);
  for (let i = 0; i < uniqueModels.length; i++) {
    const { brand, model } = uniqueModels[i];
    const fileName = brand.toLowerCase().replace(/\\s+/g, '-') + '-' + model.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.jpg';
    const dest = path.join(outDir, fileName);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      continue;
    }

    try {
      const query = encodeURIComponent(brand + ' ' + model + ' car');
      const url = "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=" + query + "&gsrlimit=1&prop=pageimages&format=json&pithumbsize=600";
      const options = { headers: { 'User-Agent': 'FuelWiseBot/2.0 (dwita.velany@binus.ac.id)' } };
      
      const response = await new Promise((resolve, reject) => {
        let data = '';
        https.get(url, options, (res) => {
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(data)); } catch(e) { reject(new Error("Invalid JSON")); }
          });
        }).on('error', reject);
      });

      if (response.query && response.query.pages) {
        const pages = response.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pages[pageId].thumbnail) {
          const imgUrl = pages[pageId].thumbnail.source;
          await downloadImage(imgUrl, dest);
          console.log("[" + (i+1) + "/" + uniqueModels.length + "] Downloaded", fileName);
        } else {
          console.log("[" + (i+1) + "/" + uniqueModels.length + "] No image found for", brand, model);
        }
      } else {
        console.log("[" + (i+1) + "/" + uniqueModels.length + "] No query pages for", brand, model);
      }
    } catch (err) {
      console.error("Error processing " + brand + " " + model + ":", err.message);
    }
    await new Promise(r => setTimeout(r, 600));
  }
}

run();
