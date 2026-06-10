"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifikasi = void 0;
class Notifikasi {
    constructor(userId, tipe, pesan) {
        this.userId = userId;
        this.tipe = tipe;
        this.pesan = pesan;
    }
    buatPesanStatus(kodeLaporan, statusLama, statusBaru) {
        const pesan = `Laporan ${kodeLaporan} status berubah dari ${statusLama} menjadi ${statusBaru}`;
        return pesan;
    }
    async kirimNotifikasiStatus(kodeLaporan, statusLama, statusBaru) {
        const pesan = this.buatPesanStatus(kodeLaporan, statusLama, statusBaru);
        console.log(`[NOTIFIKASI] User ${this.userId}: ${pesan}`);
        // TODO: Implementasi real-time notification (WebSocket/Email/SMS)
    }
    getPesan() {
        return this.pesan;
    }
}
exports.Notifikasi = Notifikasi;
//# sourceMappingURL=Notifikasi.js.map