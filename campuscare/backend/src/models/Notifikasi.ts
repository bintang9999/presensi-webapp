export class Notifikasi {
  private userId: number;
  private tipe: string;
  private pesan: string;

  constructor(userId: number, tipe: string, pesan: string) {
    this.userId = userId;
    this.tipe = tipe;
    this.pesan = pesan;
  }

  buatPesanStatus(kodeLaporan: string, statusLama: string, statusBaru: string): string {
    const pesan = `Laporan ${kodeLaporan} status berubah dari ${statusLama} menjadi ${statusBaru}`;
    return pesan;
  }

  async kirimNotifikasiStatus(kodeLaporan: string, statusLama: string, statusBaru: string): Promise<void> {
    const pesan = this.buatPesanStatus(kodeLaporan, statusLama, statusBaru);
    
    console.log(`[NOTIFIKASI] User ${this.userId}: ${pesan}`);
    
    // TODO: Implementasi real-time notification (WebSocket/Email/SMS)
  }

  getPesan(): string {
    return this.pesan;
  }
}
