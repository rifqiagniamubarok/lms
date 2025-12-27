# Learning Management System (LMS)

Sistem Manajemen Pembelajaran berbasis web yang dibangun dengan teknologi modern untuk mendukung kegiatan belajar mengajar secara online.

## 📋 Daftar Isi

- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Persiapan Sebelum Menjalankan](#persiapan-sebelum-menjalankan)
- [Cara Menjalankan Proyek](#cara-menjalankan-proyek)
- [Struktur Proyek](#struktur-proyek)
- [Fitur Utama](#fitur-utama)

## 🚀 Teknologi yang Digunakan

### Framework & Library Utama

- **[Next.js 16.0.7](https://nextjs.org/)** - Framework React untuk production dengan fitur Server-Side Rendering (SSR) dan Static Site Generation (SSG)
- **[React 19.2.0](https://react.dev/)** - Library JavaScript untuk membangun user interface
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript dengan type safety untuk pengembangan yang lebih robust

### Database & ORM

- **[Prisma 5.19.0](https://www.prisma.io/)** - ORM (Object-Relational Mapping) modern untuk Node.js dan TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Database relational yang powerful dan open-source

### Authentication

- **[NextAuth.js v5 Beta](https://next-auth.js.org/)** - Solusi autentikasi lengkap untuk Next.js
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Library untuk hashing password
- **[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)** - Implementasi JSON Web Tokens untuk autentikasi

### UI & Styling

- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[HeroUI React](https://www.heroui.com/)** - Component library untuk React
- **[Framer Motion](https://www.framer.com/motion/)** - Library animasi untuk React
- **[Heroicons](https://heroicons.com/)** - Icon library dari Tailwind CSS

### Data Visualization

- **[Chart.js](https://www.chartjs.org/)** - Library charting yang fleksibel
- **[react-chartjs-2](https://react-chartjs-2.js.org/)** - React wrapper untuk Chart.js

### Utilities

- **[Zod](https://zod.dev/)** - Schema validation library untuk TypeScript
- **[date-fns](https://date-fns.org/)** - Library manipulasi tanggal modern
- **[avvvatars-react](https://avvvatars.com/)** - Avatar generator untuk React

### Development Tools

- **[ESLint](https://eslint.org/)** - Linter untuk JavaScript/TypeScript
- **[tsx](https://github.com/esbuild-kit/tsx)** - TypeScript executor untuk Node.js

## 📦 Persiapan Sebelum Menjalankan

### 1. Persyaratan Sistem

Pastikan sistem Anda telah memiliki:

- **Node.js** versi 18.x atau lebih tinggi ([Download](https://nodejs.org/))
- **npm** atau **yarn** atau **pnpm** (package manager)
- **PostgreSQL** database ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### 2. Clone Repository

```bash
git clone <repository-url>
cd lms
```

### 3. Install Dependencies

```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### 4. Setup Database

#### A. Buat Database PostgreSQL

Buat database baru di PostgreSQL:

```sql
CREATE DATABASE lms_db;
```

#### B. Setup Environment Variables

Buat file `.env` di root folder proyek dan tambahkan konfigurasi berikut:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db"
DATABASE_DIRECT_URL="postgresql://username:password@localhost:5432/lms_db"

# NextAuth Configuration
AUTH_SECRET="your-random-secret-key-here"
# Generate dengan: openssl rand -base64 32

# Application URL
NEXTAUTH_URL="http://localhost:3000"
```

**Catatan:**

- Ganti `username` dan `password` dengan kredensial PostgreSQL Anda
- Ganti `your-random-secret-key-here` dengan secret key yang di-generate secara random

### 5. Migrasi Database

Jalankan migrasi Prisma untuk membuat struktur database:

```bash
npx prisma migrate dev
```

### 6. Seed Database (Opsional)

Untuk mengisi database dengan data awal (quiz, badges, dll):

```bash
npx prisma db seed
```

## 🏃 Cara Menjalankan Proyek

### Development Mode

Jalankan aplikasi dalam mode development:

```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

### Build untuk Production

```bash
npm run build
npm run start
```

### Menjalankan Linter

```bash
npm run lint
```

### Prisma Studio (Database GUI)

Untuk membuka Prisma Studio dan melihat data database secara visual:

```bash
npx prisma studio
```

## 📁 Struktur Proyek

```
lms/
├── app/                      # Next.js App Router
│   ├── (admin)/             # Admin dashboard routes
│   │   ├── dashboard/       # Dashboard utama admin
│   │   ├── quiz/            # Manajemen quiz
│   │   ├── student/         # Manajemen siswa
│   │   └── Profile/         # Profil admin
│   ├── (auth)/              # Authentication routes
│   │   └── login/           # Halaman login
│   └── api/                 # API Routes
│       ├── admin/           # Admin API endpoints
│       ├── auth/            # NextAuth endpoints
│       └── users/           # User API endpoints
├── components/              # React components
│   ├── layout/              # Layout components
│   ├── partial/             # Partial components (Navbar, Sidebar)
│   └── providers/           # Context providers
├── prisma/                  # Prisma ORM
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Database seeder
│   ├── migrations/          # Database migrations
│   ├── soal/                # Quiz questions data
│   └── badges/              # Badges data
├── utils/                   # Utility functions
│   ├── encryption.ts        # Encryption utilities
│   ├── handleAuth.ts        # Auth handlers
│   ├── handleError.ts       # Error handlers
│   ├── prisma.ts            # Prisma client
│   └── validations/         # Zod validation schemas
├── public/                  # Static files
├── auth.ts                  # NextAuth configuration
├── middleware.ts            # Next.js middleware
└── next.config.ts           # Next.js configuration
```

## ✨ Fitur Utama

### Untuk Admin

- 📊 Dashboard dengan statistik dan analitik
- 📝 Manajemen quiz dan soal
- 👥 Manajemen data siswa
- 📈 Visualisasi data dengan chart
- 🔔 Sistem notifikasi

### Untuk Siswa/User

- 📚 Mengerjakan quiz berdasarkan level
- 🏆 Sistem badge dan achievement
- 📊 Tracking progress belajar
- 🎯 Level dan experience points
- 📱 Responsive design untuk mobile

### Sistem Umum

- 🔐 Autentikasi dan authorization dengan NextAuth
- 🔒 Password hashing dengan bcrypt
- ✅ Validasi data dengan Zod
- 🎨 UI modern dengan Tailwind CSS dan HeroUI
- ⚡ Performance optimized dengan Next.js
- 🗄️ Database management dengan Prisma ORM

## 🛠️ Troubleshooting

### Error: "Cannot connect to database"

- Pastikan PostgreSQL service berjalan
- Cek kredensial database di file `.env`
- Pastikan database sudah dibuat

### Error: "AUTH_SECRET is not defined"

- Pastikan file `.env` sudah dibuat
- Tambahkan `AUTH_SECRET` dengan value yang di-generate

### Port 3000 sudah digunakan

Ganti port dengan menjalankan:

```bash
PORT=3001 npm run dev
```

## 📝 License

Proyek ini bersifat private dan digunakan untuk keperluan pembelajaran.

## 👨‍💻 Developer

Dikembangkan dengan ❤️ untuk meningkatkan pengalaman belajar mengajar.
