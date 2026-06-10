import { Database } from 'sqlite';

export abstract class BaseUser {
  protected id: number;
  protected nama: string;
  protected email: string;
  protected role: 'pelapor' | 'admin';

  constructor(id: number, nama: string, email: string, role: 'pelapor' | 'admin') {
    this.id = id;
    this.nama = nama;
    this.email = email;
    this.role = role;
  }

  getId(): number {
    return this.id;
  }

  getNama(): string {
    return this.nama;
  }

  getEmail(): string {
    return this.email;
  }

  getRole(): string {
    return this.role;
  }

  abstract getDashboardData(): Promise<any>;
}
