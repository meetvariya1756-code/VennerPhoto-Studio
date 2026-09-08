import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return { headers: [], rows: [] };

  function splitRow(rowText) {
    const fields = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < rowText.length; i++) {
      const char = rowText[i];
      if (char === '"') {
        if (inQuotes && rowText[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current);
    return fields;
  }

  const headers = splitRow(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));
  const rawRows = lines.slice(1).map(line => splitRow(line));

  const rows = rawRows.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      let val = row[i] ? row[i].trim().replace(/^"|"$/g, '') : null;
      if (val === '' || val === 'NULL' || val === 'null') val = null;
      if (val === 'TRUE' || val === 'true') val = true;
      if (val === 'FALSE' || val === 'false') val = false;
      if (typeof val === 'string') {
        if (!isNaN(val) && !val.includes('-') && !val.includes(':') && !val.startsWith('0')) {
          val = Number(val);
        } else if (val.startsWith('[') && val.endsWith(']')) {
          try { val = JSON.parse(val); } catch {}
        }
      }
      obj[h] = val;
    });
    return obj;
  });

  return rows;
}

function buildJSON() {
  const migrationDir = path.join(__dirname, '..', 'migration');
  const outputFile = path.join(__dirname, '..', 'src', 'lib', 'migratedData.json');

  const result = {
    services: [],
    service_gallery: [],
    portfolio_photos: [],
    reels: [],
    site_settings: [],
    testimonials: [],
    team_members: [],
    heroes: [],
    before_after_comparisons: [],
    wedding_highlights: []
  };

  if (fs.existsSync(migrationDir)) {
    const files = fs.readdirSync(migrationDir);
    for (const key of Object.keys(result)) {
      const csvFile = files.find(f => f.toLowerCase() === `${key}.csv` || f.toLowerCase().startsWith(`${key}_`));
      if (csvFile) {
        const content = fs.readFileSync(path.join(migrationDir, csvFile), 'utf-8');
        result[key] = parseCSV(content);
      }
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`SUCCESS! Generated migratedData.json with:`);
  console.log(`- ${result.services.length} services`);
  console.log(`- ${result.service_gallery.length} service gallery images`);
  console.log(`- ${result.portfolio_photos.length} portfolio photos`);
  console.log(`- ${result.reels.length} reels`);
  console.log(`- ${result.testimonials.length} testimonials`);
}

buildJSON();
