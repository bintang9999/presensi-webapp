export class Report {
  private id: number;
  private kodeLaporan: string;
  private judul: string;
  private deskripsi: string;
  private lokasi: string;
  private foto: string | null;
  private status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
  private userId: number;
  private createdAt?: string;
  private updatedAt?: string;

  constructor(
    id: number,
    kodeLaporan: string,
    judul: string,
    deskripsi: string,
    lokasi: string,
    foto: string | null,
    status: 'pending' | 'diproses' | 'selesai' | 'ditolak',
    userId: number,
    createdAt?: string,
    updatedAt?: string
  ) {
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

  getId(): number {
    return this.id;
  }

  getKodeLaporan(): string {
    return this.kodeLaporan;
  }

  getJudul(): string {
    return this.judul;
  }

  getDeskripsi(): string {
    return this.deskripsi;
  }

  getLokasi(): string {
    return this.lokasi;
  }

  getFoto(): string | null {
    return this.foto;
  }

  getStatus(): string {
    return this.status;
  }

  getUserId(): number {
    return this.userId;
  }

  updateStatus(newStatus: 'pending' | 'diproses' | 'selesai' | 'ditolak'): void {
    if (this.isEditable()) {
      this.status = newStatus;
    }
  }

  getDetail(): object {
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

  isEditable(): boolean {
    return this.status === 'pending';
  }
}
