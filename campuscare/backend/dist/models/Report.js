"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
class Report {
    constructor(id, kodeLaporan, judul, deskripsi, lokasi, foto, status, userId, createdAt, updatedAt) {
        this.id = id;
        this.kodeLaporan = kodeLaporan;
        this.judul = judul;
        this.deskripsi = deskripsi;
        this.lokasi = lokasi;
        this.foto = foto;
        this.status = status;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    getId() {
        return this.id;
    }
    getKodeLaporan() {
        return this.kodeLaporan;
    }
    getJudul() {
        return this.judul;
    }
    getDeskripsi() {
        return this.deskripsi;
    }
    getLokasi() {
        return this.lokasi;
    }
    getFoto() {
        return this.foto;
    }
    getStatus() {
        return this.status;
    }
    getUserId() {
        return this.userId;
    }
    updateStatus(newStatus) {
        if (this.isEditable()) {
            this.status = newStatus;
        }
    }
    getDetail() {
        return {
            id: this.id,
            kode_laporan: this.kodeLaporan,
            judul: this.judul,
            deskripsi: this.deskripsi,
            lokasi: this.lokasi,
            foto: this.foto,
            status: this.status,
            user_id: this.userId,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        };
    }
    isEditable() {
        return this.status === 'pending';
    }
}
exports.Report = Report;
//# sourceMappingURL=Report.js.map