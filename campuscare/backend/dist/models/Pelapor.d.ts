import { BaseUser } from './BaseUser';
import { Report } from './Report';
export declare class Pelapor extends BaseUser {
    buatLaporan(laporan: any): Promise<Report>;
    lihatRiwayatLaporan(): Promise<Report[]>;
    getDashboardData(): Promise<any>;
}
//# sourceMappingURL=Pelapor.d.ts.map