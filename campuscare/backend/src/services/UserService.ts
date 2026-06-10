import { getDatabase } from '../database/connection';
import { Admin } from '../models/Admin';

export class UserService {
  async getAllUsers(): Promise<any[]> {
    const db = getDatabase();
    return db.all('SELECT id, nama, email, role, created_at FROM users ORDER BY created_at DESC');
  }

  async getUserById(userId: number): Promise<any> {
    const db = getDatabase();
    const user = await db.get('SELECT id, nama, email, role, created_at FROM users WHERE id = ?', [userId]);

    if (!user) {
      throw new Error('Pengguna tidak ditemukan');
    }

    return user;
  }

  async updateUser(userId: number, updates: any): Promise<boolean> {
    const admin = new Admin(1, '', '', 'admin');
    return admin.kelolaUser(userId, updates);
  }

  async deleteUser(userId: number, adminId: number): Promise<boolean> {
    const admin = new Admin(adminId, '', '', 'admin');
    return admin.hapusUser(userId);
  }

  async countUsers(): Promise<number> {
    const db = getDatabase();
    const result = await db.get('SELECT COUNT(*) as count FROM users');
    return result.count;
  }
}
