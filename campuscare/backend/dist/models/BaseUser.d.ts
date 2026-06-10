export declare abstract class BaseUser {
    protected id: number;
    protected nama: string;
    protected email: string;
    protected role: 'pelapor' | 'admin';
    constructor(id: number, nama: string, email: string, role: 'pelapor' | 'admin');
    getId(): number;
    getNama(): string;
    getEmail(): string;
    getRole(): string;
    abstract getDashboardData(): Promise<any>;
}
//# sourceMappingURL=BaseUser.d.ts.map