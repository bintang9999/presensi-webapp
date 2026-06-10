import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let db: Database | null = null;

export async function initializeDatabase(): Promise<Database> {
  if (db) return db;

  db = await open({
    filename: process.env.DB_PATH || './database.sqlite',
    driver: sqlite3.Database,
  });

  await db.exec('PRAGMA foreign_keys = ON');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nama TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('pelapor', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kode_laporan TEXT NOT NULL UNIQUE,
      judul TEXT NOT NULL,
      deskripsi TEXT NOT NULL,
      lokasi TEXT NOT NULL,
      foto TEXT,
      status TEXT NOT NULL CHECK(status IN ('pending', 'diproses', 'selesai', 'ditolak')) DEFAULT 'pending',
      user_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
    CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
    CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
  `);

  console.log('Database initialized');
  return db;
}

export function getDatabase(): Database {
  if (!db) throw new Error('Database not initialized');
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) await db.close();
}
