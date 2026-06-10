export declare class Notifikasi {
    private userId;
    private tipe;
    private pesan;
    constructor(userId: number, tipe: string, pesan: string);
    buatPesanStatus(kodeLaporan: string, statusLama: string, statusBaru: string): string;
    kirimNotifikasiStatus(kodeLaporan: string, statusLama: string, statusBaru: string): Promise<void>;
    getPesan(): string;
}
//# sourceMappingURL=Notifikasi.d.ts.map