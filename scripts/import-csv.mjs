import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to parse CSV format with quotes handling
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
  const rows = lines.slice(1).map(line => splitRow(line));

  return { headers, rows };
}

// Convert CSV value to SQL-formatted string
function formatSQLValue(val, colName) {
  if (val === undefined || val === null || val.trim() === '' || val.trim().toUpperCase() === 'NULL') {
    return 'NULL';
  }
  const cleanVal = val.trim().replace(/^"|"$/g, '');
  if (cleanVal === '' || cleanVal === 'NULL') return 'NULL';
  if (cleanVal.toUpperCase() === 'TRUE') return 'TRUE';
  if (cleanVal.toUpperCase() === 'FALSE') return 'FALSE';

  // Handle JSON Array [] -> PostgreSQL TEXT[] formatting for tags
  if (cleanVal.startsWith('[') && cleanVal.endsWith(']')) {
    try {
      const parsed = JSON.parse(cleanVal);
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) return "'{}'::text[]";
        const items = parsed.map(item => String(item).replace(/"/g, '\\"'));
        return `'{"${items.join('","')}"}'::text[]`;
      }
    } catch {
      if (cleanVal === '[]') return "'{}'::text[]";
    }
  }

  if (!isNaN(cleanVal) && !cleanVal.includes('-') && !cleanVal.includes(':') && !cleanVal.startsWith('0')) {
    return cleanVal;
  }

  // Escape single quotes for SQL
  const escaped = cleanVal.replace(/'/g, "''");
  return `'${escaped}'`;
}

// Main generator
function generateSQLFromCSVFolder() {
  const migrationDir = path.join(__dirname, '..', 'migration');
  const outputFile = path.join(__dirname, '..', 'migration_import.sql');

  if (!fs.existsSync(migrationDir)) {
    fs.mkdirSync(migrationDir, { recursive: true });
    console.log(`Created folder: ${migrationDir}`);
    return;
  }

  const files = fs.readdirSync(migrationDir).filter(f => f.endsWith('.csv'));
  if (files.length === 0) {
    console.log('No CSV files found in "migration" folder.');
    return;
  }

  // Import order to preserve foreign key constraints
  const tableOrder = [
    'services',
    'site_settings',
    'heroes',
    'service_gallery',
    'service_packages',
    'portfolio_photos',
    'reels',
    'team_members',
    'testimonials',
    'before_after_comparisons',
    'wedding_highlights'
  ];

  let sqlStatements = `-- VENNER PHOTO STUDIO AUTOMATED CSV IMPORT SCRIPT\n`;
  sqlStatements += `-- Generated on ${new Date().toISOString()}\n\n`;
  sqlStatements += `-- Clear temporary seed data so original Supabase UUIDs are preserved\n`;
  sqlStatements += `TRUNCATE TABLE public.service_gallery CASCADE;\n`;
  sqlStatements += `TRUNCATE TABLE public.service_packages CASCADE;\n`;
  sqlStatements += `TRUNCATE TABLE public.portfolio_photos CASCADE;\n`;
  sqlStatements += `TRUNCATE TABLE public.reels CASCADE;\n`;
  sqlStatements += `TRUNCATE TABLE public.team_members CASCADE;\n`;
  sqlStatements += `TRUNCATE TABLE public.testimonials CASCADE;\n`;
  sqlStatements += `TRUNCATE TABLE public.before_after_comparisons CASCADE;\n`;
  sqlStatements += `TRUNCATE TABLE public.wedding_highlights CASCADE;\n`;
  sqlStatements += `TRUNCATE TABLE public.heroes CASCADE;\n`;
  sqlStatements += `TRUNCATE TABLE public.site_settings CASCADE;\n`;
  sqlStatements += `TRUNCATE TABLE public.services CASCADE;\n\n`;

  for (const tableName of tableOrder) {
    const csvFile = files.find(f => f.toLowerCase() === `${tableName}.csv` || f.toLowerCase().startsWith(`${tableName}_`));
    if (!csvFile) continue;

    const filePath = path.join(migrationDir, csvFile);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { headers, rows } = parseCSV(content);

    if (headers.length === 0 || rows.length === 0) continue;

    sqlStatements += `-- ==========================================\n`;
    sqlStatements += `-- Table: ${tableName} (${rows.length} rows)\n`;
    sqlStatements += `-- ==========================================\n`;

    const colList = headers.map(h => `"${h}"`).join(', ');

    for (const row of rows) {
      if (row.length < headers.length) continue;
      const valuesList = row.slice(0, headers.length).map((v, idx) => formatSQLValue(v, headers[idx])).join(', ');
      sqlStatements += `INSERT INTO public."${tableName}" (${colList}) VALUES (${valuesList}) ON CONFLICT DO NOTHING;\n`;
    }

    sqlStatements += `\n`;
  }

  fs.writeFileSync(outputFile, sqlStatements, 'utf-8');
  console.log(`SUCCESS! Re-generated import SQL file at: ${outputFile}`);
}

generateSQLFromCSVFolder();
