# Implementasi Pemrograman Berorientasi Objek (PBO/OOP) di CampusCare

Dokumen ini menjelaskan penerapan konsep PBO pada backend CampusCare. Tujuan penerapan ini adalah untuk memisahkan logic bisnis dari *controller*, meningkatkan keterbacaan kode, dan kemudahan pemeliharaan (*maintainability*).

## Konsep OOP yang Diterapkan

### 1. Abstraction (Abstraksi)
Abstraksi digunakan untuk mendefinisikan *blueprint* umum dari sebuah entitas tanpa mengimplementasikan detailnya secara spesifik.

**Contoh di sistem:**
```typescript
export abstract class BaseUser {
  protected id: number;
  protected nama: string;
  protected email: string;
  protected role: 'pelapor' | 'admin';

  // Method abstract ini wajib di-implementasikan oleh subclass
  abstract getDashboardData(): Promise<any>;
  
  // Method dengan implementasi biasa
  getId(): number { return this.id; }
}
```
Class `BaseUser` tidak bisa di-instansiasi langsung (`new BaseUser()`), melainkan harus melalui subclass-nya.

### 2. Inheritance (Pewarisan)
Pewarisan memungkinkan class turunan (subclass) memiliki semua atribut dan metode dari class induk (superclass), sehingga mengurangi duplikasi kode.

**Contoh di sistem:**
- Class `Pelapor extends BaseUser`
- Class `Admin extends BaseUser`

Kedua class ini otomatis mewarisi properti `id`, `nama`, `email`, dan `role` beserta getter-nya. `Admin` memiliki kemampuan ekstra seperti `ubahStatusLaporan` dan `kelolaUser`.

### 3. Encapsulation (Enkapsulasi)
Enkapsulasi melindungi data di dalam objek dari modifikasi langsung di luar class. Data hanya bisa diakses dan dimodifikasi melalui method yang disediakan (*getter* dan *setter*).

**Contoh di sistem:**
```typescript
export class Report {
  // Properti disembunyikan dari luar (private)
  private id: number;
  private status: 'pending' | 'diproses' | 'selesai' | 'ditolak';

  // Diakses via getter
  getStatus(): string { return this.status; }

  // Dimodifikasi via method khusus dengan validasi
  updateStatus(newStatus: string): void {
    if (this.isEditable()) {
      this.status = newStatus;
    }
  }
}
```

### 4. Polymorphism (Polimorfisme)
Polimorfisme memungkinkan method yang sama memiliki implementasi berbeda di subclass yang berbeda.

**Contoh di sistem:**
Method `getDashboardData()` didefinisikan secara abstract di `BaseUser`.

Di `Pelapor`, implementasinya mengembalikan data statistik pribadi dan daftar laporan miliknya:
```typescript
async getDashboardData(): Promise<any> {
  const reports = await this.lihatRiwayatLaporan();
  // Return statistik pelapor
}
```

Di `Admin`, implementasinya mengembalikan data statistik seluruh sistem dan laporan global:
```typescript
async getDashboardData(): Promise<any> {
  // Query seluruh database
  // Return statistik global
}
```

Service hanya perlu memanggil method ini tanpa peduli tipe spesifik user:
```typescript
const user = authService.getUserById(id);
return user.getDashboardData(); // Memanggil implementasi yang sesuai otomatis
```

## Diagram Relasi Class

```text
┌───────────────────────────────────────┐
│              <<abstract>>             │
│                BaseUser               │
├───────────────────────────────────────┤
│ # id: number                          │
│ # nama: string                        │
│ # email: string                       │
│ # role: string                        │
├───────────────────────────────────────┤
│ + getId(): number                     │
│ + getNama(): string                   │
│ + getEmail(): string                  │
│ + getDashboardData(): Promise<any>    │
└───────────────────▲───────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────┴───────┐       ┌───────┴───────┐
│    Pelapor    │       │     Admin     │
├───────────────┤       ├───────────────┤
│               │       │               │
├───────────────┤       ├───────────────┤
│ + buatLaporan │       │ + ubahStatus  │
│ + lihatRiwayat│       │ + kelolaUser  │
└───────┬───────┘       └───────┬───────┘
        │                       │
        │      ┌─────────┐      │
        └─────▶│  Report │◀─────┘
               ├─────────┤
               │ - id    │
               │ - judul │
               │ - status│
               ├─────────┤
               │ + get*  │
               │ + update│
               └─────────┘
```

## Pemisahan Logic (Separation of Concerns)

Untuk mematuhi prinsip *Clean Architecture* dan *SOLID*:
1. **Model/Class** (`Admin.ts`, `Pelapor.ts`, `Report.ts`): Menangani logic spesifik entitas, data encapsulation, dan rules.
2. **Service** (`AuthService.ts`, `ReportService.ts`, `UserService.ts`): Mengkoordinasikan interaksi antar Model dan akses database. Business logic ada di sini.
3. **Controller** (`authController.ts`, dll): **HANYA** bertugas mem-parsing Request dari HTTP (Express) dan memformat Response JSON. Tidak boleh ada query `SELECT/UPDATE` langsung di file Controller.

### Alasan Memenuhi Tugas PBO
Project ini merupakan implementasi PBO murni di TypeScript dengan environment backend Express. Proyek tidak sekadar membuat *class kosong*, namun menggunakannya untuk *business logic* yang kompleks dengan penerapan 4 pilar PBO secara sempurna.
