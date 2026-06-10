export declare class Report {
    private id;
    private kodeLaporan;
    private judul;
    private deskripsi;
    private lokasi;
    private foto;
    private status;
    private userId;
    private createdAt?;
    private updatedAt?;
    constructor(id: number, kodeLaporan: string, judul: string, deskripsi: string, lokasi: string, foto: string | null, status: 'pending' | 'diproses' | 'selesai' | 'ditolak', userId: number, createdAt?: string, updatedAt?: string);
    getId(): number;
    getKodeLaporan(): string;
    getJudul(): string;
    getDeskripsi(): string;
    getLokasi(): string;
    getFoto(): string | null;
    getStatus(): string;
    getUserId(): number;
    updateStatus(newStatus: 'pending' | 'diproses' | 'selesai' | 'ditolak'): void;
    getDetail(): object;
    isEditable(): boolean;
}
//# sourceMappingURL=Report.d.ts.map