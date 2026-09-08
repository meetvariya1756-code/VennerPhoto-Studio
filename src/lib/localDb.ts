import fs from 'fs';
import path from 'path';
import MIGRATED_DATA from './migratedData.json';

const DB_FILE_PATH = path.join(process.cwd(), 'src', 'lib', 'local_db.json');

function loadDb(): Record<string, any[]> {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const content = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.warn('Failed to read local_db.json, re-initializing from migratedData:', err);
  }

  // Initialize with migratedData
  const initialData = JSON.parse(JSON.stringify(MIGRATED_DATA));
  saveDb(initialData);
  return initialData;
}

function saveDb(data: Record<string, any[]>): void {
  try {
    const dir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write to local_db.json:', err);
  }
}

export function getLocalTable(table: string): any[] {
  const db = loadDb();
  return db[table] || [];
}

export function insertLocal(table: string, record: any): any {
  const db = loadDb();
  if (!db[table]) db[table] = [];

  const newRecord = {
    id: record.id || `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...record,
  };

  db[table].unshift(newRecord);
  saveDb(db);
  return newRecord;
}

export function updateLocal(table: string, id: string, updates: any): any | null {
  const db = loadDb();
  if (!db[table]) return null;

  const index = db[table].findIndex(item => item.id === id);
  if (index === -1) return null;

  db[table][index] = {
    ...db[table][index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  saveDb(db);
  return db[table][index];
}

export function deleteLocal(table: string, id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  const db = loadDb();
  if (!db[table]) return false;

  const initialLen = db[table].length;
  db[table] = db[table].filter(item => Boolean(item && item.id && item.id === id) ? false : true);

  if (db[table].length !== initialLen) {
    saveDb(db);
    return true;
  }
  return false;
}
