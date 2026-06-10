import { Report } from '../models/Report';
export declare class ReportService {
    createReport(userId: number, data: any): Promise<any>;
    getReportsByUser(userId: number): Promise<Report[]>;
    getReportById(reportId: number, userId?: number): Promise<any>;
    getAllReports(): Promise<any[]>;
    updateReport(reportId: number, userId: number, data: any): Promise<boolean>;
    updateReportStatus(reportId: number, newStatus: string): Promise<boolean>;
    deleteReport(reportId: number, userId: number): Promise<boolean>;
    getStatistics(): Promise<any>;
    getDashboardData(userId: number, role: string): Promise<any>;
}
//# sourceMappingURL=ReportService.d.ts.map