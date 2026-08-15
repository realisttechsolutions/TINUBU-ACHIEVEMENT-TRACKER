import { runQueryFile } from './database.mjs';

function serializeValue(value) {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function escapeCsv(value) {
  const text = serializeValue(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function rowsToCsv(rows) {
  if (rows.length === 0) return '';
  const headers = Object.keys(rows[0]);
  return [headers.join(','), ...rows.map((row) => headers.map((key) => escapeCsv(row[key])).join(','))].join('\r\n');
}

export async function exportPublicDataset(db, {
  format = 'json', sector = null, status = null, limit = 10_000, offset = 0,
} = {}) {
  if (!['json', 'csv'].includes(format)) throw new Error(`Unsupported local export format: ${format}`);
  if (!Number.isInteger(limit) || limit < 1 || limit > 10_000) throw new Error('limit must be between 1 and 10000');
  const { rows } = await runQueryFile(db, '12-public-download.sql', [sector, status, limit, offset]);
  const body = format === 'json' ? JSON.stringify(rows, null, 2) : rowsToCsv(rows);
  return {
    contentType: format === 'json' ? 'application/json' : 'text/csv; charset=utf-8',
    fileName: `tat-public-synthetic.${format}`,
    rowCount: rows.length,
    body,
  };
}
