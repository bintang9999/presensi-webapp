import { initializeDatabase } from './connection';
import bcrypt from 'bcrypt';

async function seed() {
  const db = await initializeDatabase();

  const email = 'admin@campuscare.com';
  const password = await bcrypt.hash('admin123', 10);

  const existingAdmin = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  
  if (!existingAdmin) {
    await db.run(
      'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin CampusCare', email, password, 'admin']
    );
    console.log('Admin user created:');
    console.log('Email: admin@campuscare.com');
    console.log('Password: admin123');
  } else {
    console.log('Admin user already exists');
  }

  // await db.close(); // Not strictly needed since process exits
}

seed().catch(console.error);
