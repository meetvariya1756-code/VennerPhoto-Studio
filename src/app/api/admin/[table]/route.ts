import { NextResponse } from 'next/server';
import { queryPg } from '@/lib/postgres';
import { getLocalTable, insertLocal, updateLocal, deleteLocal } from '@/lib/localDb';

const ALLOWED_TABLES = new Set([
  'portfolio_photos',
  'reels',
  'services',
  'site_settings',
  'heroes',
  'team_members',
  'testimonials',
  'before_after_comparisons',
  'wedding_highlights',
  'service_packages',
  'service_gallery',
  'contact_inquiries',
]);

function sanitizeTable(table: string): string | null {
  const t = table.toLowerCase();
  if (ALLOWED_TABLES.has(t)) {
    return t;
  }
  return null;
}

async function getValidColumnsForTable(table: string): Promise<Set<string>> {
  try {
    const rows = await queryPg<{ column_name: string }>(
      `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = $1`,
      [table]
    );
    if (rows && rows.length > 0) {
      return new Set(rows.map(r => r.column_name));
    }
  } catch {
    // fallback if info schema fails
  }
  return new Set();
}

// GET /api/admin/[table]?select=*&order=created_at.desc&limit=100
export async function GET(
  request: Request,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const { table: rawTable } = await params;
    const table = sanitizeTable(rawTable);
    if (!table) {
      return NextResponse.json({ error: 'Invalid or disallowed table' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 500;
    const order = searchParams.get('order') || '';
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');

    let sql = `SELECT * FROM public."${table}"`;
    const whereConditions: string[] = [];
    const sqlParams: any[] = [];

    if (id) {
      sqlParams.push(id);
      whereConditions.push(`id = $${sqlParams.length}`);
    }

    if (slug) {
      sqlParams.push(slug);
      whereConditions.push(`slug = $${sqlParams.length}`);
    }

    if (whereConditions.length > 0) {
      sql += ` WHERE ${whereConditions.join(' AND ')}`;
    }

    if (order) {
      const [col, dir] = order.split('.');
      const direction = dir && dir.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
      const safeCol = col.replace(/[^a-zA-Z0-9_]/g, '');
      if (safeCol) {
        sql += ` ORDER BY "${safeCol}" ${direction}`;
      }
    }

    sqlParams.push(limit);
    sql += ` LIMIT $${sqlParams.length}`;

    let rows: any[] = [];
    try {
      rows = await queryPg(sql, sqlParams);
    } catch {
      rows = [];
    }

    // Always merge localDb data to guarantee records created locally are never missing
    let localData = getLocalTable(table);

    if (id) {
      localData = localData.filter(item => item.id === id);
    }
    if (slug) {
      localData = localData.filter(item => item.slug === slug);
    }

    const rowIdSet = new Set((rows || []).map(r => r.id));
    for (const localItem of localData) {
      if (localItem && localItem.id && !rowIdSet.has(localItem.id)) {
        rows.push(localItem);
      }
    }

    if (order && order.includes('created_at')) {
      const isDesc = order.toLowerCase().includes('desc');
      rows.sort((a, b) => {
        const timeA = new Date(a.created_at || a.createdAt || 0).getTime();
        const timeB = new Date(b.created_at || b.createdAt || 0).getTime();
        return isDesc ? timeB - timeA : timeA - timeB;
      });
    }

    rows = rows.slice(0, limit);
    return NextResponse.json(rows);
  } catch (err: any) {
    console.warn('GET /api/admin/[table] warning:', err?.message || err);
    const { table: rawTable } = await params;
    const table = sanitizeTable(rawTable);
    const localData = table ? getLocalTable(table) : [];
    return NextResponse.json(localData);
  }
}

// POST /api/admin/[table]
export async function POST(
  request: Request,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const { table: rawTable } = await params;
    const table = sanitizeTable(rawTable);
    if (!table) {
      return NextResponse.json({ error: 'Invalid or disallowed table' }, { status: 400 });
    }

    const body = await request.json();
    const rowsToInsert = Array.isArray(body) ? body : [body];

    if (rowsToInsert.length === 0) {
      return NextResponse.json({ error: 'Empty payload' }, { status: 400 });
    }

    const validColumns = await getValidColumnsForTable(table);
    const insertedResults: any[] = [];

    for (const item of rowsToInsert) {
      if (!item.id) {
        item.id = crypto.randomUUID();
      }
      let insertedItem: any = null;

      try {
        const keys = Object.keys(item).filter(
          k => item[k] !== undefined && (validColumns.size === 0 || validColumns.has(k))
        );

        if (keys.length > 0) {
          const columns = keys.map(k => `"${k.replace(/[^a-zA-Z0-9_]/g, '')}"`).join(', ');
          const valuePlaceholders = keys.map((_, idx) => `$${idx + 1}`).join(', ');
          const values = keys.map(k => item[k]);

          const sql = `INSERT INTO public."${table}" (${columns}) VALUES (${valuePlaceholders}) RETURNING *`;
          const result = await queryPg(sql, values);
          if (result && result.length > 0) {
            insertedItem = result[0];
          }
        }
      } catch (pgErr) {
        console.warn('PostgreSQL insert notice:', pgErr);
      }

      // Always persist to localDb as guaranteed local storage
      const localItem = insertLocal(table, insertedItem || item);
      insertedResults.push(insertedItem || localItem);
    }

    return NextResponse.json(Array.isArray(body) ? insertedResults : insertedResults[0] || {});
  } catch (err: any) {
    console.warn('POST /api/admin/[table] error, writing to localDb:', err?.message || err);
    const { table: rawTable } = await params;
    const table = sanitizeTable(rawTable);
    const body = await request.json();
    if (table) {
      const localItem = insertLocal(table, body);
      return NextResponse.json(localItem);
    }
    return NextResponse.json({ error: err.message || 'Database insert error' }, { status: 500 });
  }
}

// PUT /api/admin/[table]?id=xyz
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const { table: rawTable } = await params;
    const table = sanitizeTable(rawTable);
    if (!table) {
      return NextResponse.json({ error: 'Invalid or disallowed table' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    const body = await request.json();

    if (!id && body.id) {
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: 'Missing record id for update' }, { status: 400 });
    }

    const validColumns = await getValidColumnsForTable(table);
    let updatedItem: any = null;
    try {
      const keys = Object.keys(body).filter(
        k => k !== 'id' && body[k] !== undefined && (validColumns.size === 0 || validColumns.has(k))
      );

      if (keys.length > 0) {
        const setClauses = keys.map((k, idx) => `"${k.replace(/[^a-zA-Z0-9_]/g, '')}" = $${idx + 1}`).join(', ');
        const values = keys.map(k => body[k]);
        values.push(id);

        const sql = `UPDATE public."${table}" SET ${setClauses}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
        const result = await queryPg(sql, values);
        if (result && result.length > 0) {
          updatedItem = result[0];
        }
      }
    } catch (pgErr) {
      console.warn('PostgreSQL update notice:', pgErr);
    }

    // Always sync localDb
    const localUpdated = updateLocal(table, id, body);
    return NextResponse.json(updatedItem || localUpdated || { id, ...body });
  } catch (err: any) {
    console.warn('PUT /api/admin/[table] warning:', err?.message || err);
    return NextResponse.json({ error: err.message || 'Database update error' }, { status: 500 });
  }
}

// DELETE /api/admin/[table]?id=xyz
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ table: string }> }
) {
  try {
    const { table: rawTable } = await params;
    const table = sanitizeTable(rawTable);
    if (!table) {
      return NextResponse.json({ error: 'Invalid or disallowed table' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing record id for deletion' }, { status: 400 });
    }

    let deletedItem: any = null;
    try {
      const sql = `DELETE FROM public."${table}" WHERE id = $1 RETURNING *`;
      const result = await queryPg(sql, [id]);
      if (result && result.length > 0) {
        deletedItem = result[0];
      }
    } catch (pgErr) {
      console.warn('PostgreSQL delete notice:', pgErr);
    }

    deleteLocal(table, id);
    return NextResponse.json({ success: true, deleted: deletedItem || { id } });
  } catch (err: any) {
    console.warn('DELETE /api/admin/[table] warning:', err?.message || err);
    return NextResponse.json({ error: err.message || 'Database delete error' }, { status: 500 });
  }
}

