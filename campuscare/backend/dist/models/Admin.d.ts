import { BaseUser } from './BaseUser';
export declare class Admin extends BaseUser {
    ubahStatusLaporan(reportId: number, newStatus: string): Promise<boolean>;
    kelolaUser(userId: number, updates: any): Promise<boolean>;
    hapusUser(userId: number): Promise<boolean>;
    getDashboardData(): Promise<any>;
}
//# sourceMappingURL=Admin.d.ts.map