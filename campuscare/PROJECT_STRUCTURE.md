# CampusCare Project Structure

```
campuscare/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.ts        # Auth logic (login, register, profile)
│   │   │   ├── reportController.ts      # Report CRUD & statistics
│   │   │   └── userController.ts        # User management (admin only)
│   │   ├── routes/
│   │   │   ├── authRoutes.ts            # /api/auth endpoints
│   │   │   ├── reportRoutes.ts          # /api/reports endpoints
│   │   │   └── userRoutes.ts            # /api/users endpoints
│   │   ├── middleware/
│   │   │   └── auth.ts                  # JWT & role verification
│   │   ├── services/
│   │   ├── database/
│   │   │   ├── connection.ts            # SQLite setup & schema
│   │   │   └── seed.ts                  # Initial admin user
│   │   ├── models/
│   │   │   └── types.ts                 # TypeScript interfaces
│   │   ├── utils/
│   │   │   └── auth.ts                  # JWT, bcrypt, code generation
│   │   └── index.ts                     # Express app & server
│   ├── uploads/                         # Uploaded report photos
│   ├── database.sqlite                  # SQLite database (auto-created)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/                  # Reusable UI components
│   │   ├── pages/
│   │   │   ├── Login.tsx                # Login page
│   │   │   ├── Dashboard.tsx            # Dashboard (admin & pelapor)
│   │   │   ├── NewReport.tsx            # Create report form
│   │   │   ├── MyReports.tsx            # User's reports list
│   │   │   ├── ReportDetail.tsx         # View report details
│   │   │   ├── EditReport.tsx           # Edit pending report
│   │   │   ├── AdminReports.tsx         # Admin: manage all reports
│   │   │   └── AdminUsers.tsx           # Admin: manage users
│   │   ├── layouts/
│   │   │   ├── Layout.tsx               # Main layout with sidebar
│   │   │   ├── Navbar.tsx               # Top navigation bar
│   │   │   └── Sidebar.tsx              # Left sidebar menu
│   │   ├── services/
│   │   │   └── api.ts                   # Axios instance & interceptors
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx          # Global auth state
│   │   ├── hooks/                       # Custom React hooks
│   │   ├── types/
│   │   │   └── index.ts                 # TypeScript interfaces
│   │   ├── utils/                       # Utility functions
│   │   ├── App.tsx                      # App router
│   │   ├── main.tsx                     # React entry point
│   │   └── index.css                    # Tailwind & global styles
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── postcss.config.cjs
│   ├── tailwind.config.js
│   └── dist/                            # Production build
│
├── README.md                            # Project overview
├── SETUP.sh                             # Quick setup guide
└── FEATURES.md                          # Feature documentation
```

## Database Schema

### users table
- `id` (INTEGER, PRIMARY KEY)
- `nama` (TEXT, NOT NULL)
- `email` (TEXT, UNIQUE)
- `password` (TEXT, hashed with bcrypt)
- `role` (TEXT: 'pelapor' or 'admin')
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### reports table
- `id` (INTEGER, PRIMARY KEY)
- `kode_laporan` (TEXT, UNIQUE) - Auto-generated: CC-YYYYMMDD-NNN
- `judul` (TEXT)
- `deskripsi` (TEXT)
- `lokasi` (TEXT)
- `foto` (TEXT, path to uploaded image)
- `status` (TEXT: 'pending', 'diproses', 'selesai', 'ditolak')
- `user_id` (FOREIGN KEY -> users.id)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)
