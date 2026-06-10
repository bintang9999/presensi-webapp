import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../database/connection';
import { Pelapor } from '../models/Pelapor';
import { Admin } from '../models/Admin';
import { BaseUser } from '../models/BaseUser';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

export class AuthService {
  async register(nama: string, email: string, password: string, role: 'pelapor' | 'admin' = 'pelapor'): Promise<any> {
    const db = getDatabase();

    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      throw new Error('Email sudah terdaftar');
    }

    const hashedPassword = await this.hashPassword(password);
    const result = await db.run(
      'INSERT INTO users (nama, email, password, role) VALUES (?, ?, ?, ?)',
      [nama, email, hashedPassword, role]
    );

    const userId = result.lastID!;
    const token = this.generateToken(userId, email, role);

    return {
      token,
      userId,
      nama,
      role,
    };
  }

  async login(email: string, password: string): Promise<any> {
    const db = getDatabase();
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);

    if (!user) {
      throw new Error('Email atau password salah');
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Email atau password salah');
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      token,
      userId: user.id,
      nama: user.nama,
      role: user.role,
    };
  }

  async getUserById(userId: number): Promise<BaseUser> {
    const db = getDatabase();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);

    if (!user) {
      throw new Error('Pengguna tidak ditemukan');
    }

    if (user.role === 'admin') {
      return new Admin(user.id, user.nama, user.email, user.role);
    } else {
      return new Pelapor(user.id, user.nama, user.email, user.role);
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  private generateToken(userId: number, email: string, role: string): string {
    return jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRY as any });
  }

  verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }
}
