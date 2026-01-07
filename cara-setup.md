# Panduan Setup

## ❓ Penjelasan Istilah Penting

Sebelum mulai, mari pahami beberapa istilah yang akan sering muncul:

- **Node.js**: Software yang dibutuhkan untuk menjalankan aplikasi JavaScript di komputer
- **npm (Node Package Manager)**: Sudah **OTOMATIS terinstall** bersama Node.js, digunakan untuk mengelola library/package yang dibutuhkan project
- **Git**: Software untuk mengelola versi code dan download project dari GitHub
- **Terminal/Command Prompt**: Jendela hitam tempat kita mengetik perintah-perintah
- **Repository/Repo**: Tempat penyimpanan code di GitHub
- **Clone**: Proses download project dari GitHub ke komputer
- **Environment Variable**: File konfigurasi yang berisi pengaturan rahasia seperti password database
- **PATH**: Pengaturan Windows agar bisa menjalankan program dari mana saja di terminal

---

## 📋 BAGIAN 1: Download & Install Software

### 1. **Node.js** (Wajib) - Sudah Termasuk npm!

**Apa itu Node.js?**  
Node.js adalah software yang dibutuhkan untuk menjalankan aplikasi web modern.

**Apa itu npm?**  
npm (Node Package Manager) adalah tool untuk download dan mengelola library/package yang dibutuhkan project. npm **SUDAH INCLUDE** di dalam installer Node.js, jadi sekali install Node.js = langsung dapat npm juga!

**Cara Download:**

1. Buka browser (Chrome/Edge/Firefox)
2. Ketik di address bar: `https://nodejs.org/`
3. Akan muncul 2 tombol download:
   - **LTS (Recommended)** - Pilih yang ini! (biasanya warna hijau)
   - Current - Jangan pilih ini
4. Klik tombol **"Download Node.js (LTS)"**
5. File installer akan terdownload (nama file: `node-vXX.XX.X-x64.msi`)
6. Tunggu sampai download selesai

**Cara Install:**

1. Buka folder **Downloads** di komputer
2. Double-click file `node-vXX.XX.X-x64.msi`
3. Akan muncul jendela installer, klik **"Next"**
4. Klik **"I accept the terms..."** lalu klik **"Next"**
5. **PENTING**: Pada halaman "Custom Setup", pastikan semua checkbox tercentang, terutama:
   - ✅ Node.js runtime
   - ✅ npm package manager (ini penting!)
   - ✅ Add to PATH (ini sangat penting!)
6. Klik **"Next"** terus sampai ada tombol **"Install"**
7. Klik **"Install"** (mungkin akan muncul popup UAC, klik **"Yes"**)
8. Tunggu proses instalasi (sekitar 1-2 menit)
9. Klik **"Finish"**

**Verifikasi Instalasi:**

1. Tekan tombol **Windows + R** di keyboard
2. Ketik: `cmd` lalu tekan **Enter**
3. Jendela hitam (Command Prompt) akan terbuka
4. Ketik perintah ini lalu tekan **Enter**:
   ```
   node --version
   ```
5. Jika muncul tulisan seperti `v20.11.0` berarti **BERHASIL!**
6. Sekarang cek npm, ketik:
   ```
   npm --version
   ```
7. Jika muncul tulisan seperti `10.2.4` berarti **npm sudah terinstall!**
8. Ketik `exit` lalu Enter untuk keluar dari Command Prompt

**Jika npm tidak ditemukan (Error: 'npm' is not recognized):**

- Restart komputer terlebih dahulu
- Coba buka Command Prompt baru
- Jika masih error, lanjut ke bagian "Setting PATH Secara Manual" di bawah

### 2. **Git** (Wajib)

**Apa itu Git?**  
Git adalah software untuk mengelola code dan download project dari GitHub ke komputer.

**Cara Download:**

1. Buka browser
2. Ketik di address bar: `https://git-scm.com/download/win`
3. Download akan otomatis dimulai (jika tidak, klik link "Click here to download manually")
4. File yang terdownload: ` / VS Code\*\* (Sangat Disarankan)

**Apa itu VS Code?**  
VS Code adalah text editor khusus untuk coding. Seperti Microsoft Word tapi untuk nulis code.

**Cara Download:**

1. Buka browser
2. Ketik: `https://code.visualstudio.com/`
3. Klik tombol biru besar **"Download for Windows"**
4. File yang terdownload: `VSCodeUserSetup-x64-X.XX.X.exe`
5. Tunggu sampai download selesai

**Cara Install:**

1. Buka folder **Downloads**
2. Double-click file `VSCodeUserSetup-x64-X.XX.X.exe`
   3.# 1. **Buat Akun GitHub Baru**

**Apa itu GitHub?**  
GitHub adalah tempat penyimpanan code secara online, seperti Google Drive tapi khusus untuk programmer.

**Langkah-Langkah:**

1. **Buka Website GitHub:**

   - Buka browser
   - Ketik: `https://github.com/signup`
   - Tekan Enter

2. **Isi Form Registrasi:**
   - **Enter your email:** Ketik email Anda (bisa Gmail, Yahoo, dll)
   - Klik **"Continue"**
   - **Create a password:** Buat password (minimal 15 karakter atau 8 karakter dengan kombinasi huruf + angka)
   - Klik **"Continue"**
   - **Enter a username:** Pilih username unik (akan jadi `github.com/username-anda`)
   - Klik **"Continue"**
   - **Email preferences:** Ketik `n` (untuk tidak menerima email marketing)

---

## 🗄️ BAGIAN 3: Buat Database di Supabase

**Apa itu Database?**  
Database adalah tempat penyimpanan data aplikasi, seperti data user, soal quiz, nilai, dll. Kita akan pakai PostgreSQL yang disediakan **GRATIS** oleh Supabase.

**Mengapa Supabase?**

- ✅ 100% gratis untuk project kecil-menengah
- ✅ Database PostgreSQL full-featured
- ✅ 500MB storage gratis
- ✅ Tidak perlu kartu kredit untuk sign up
- ✅ Dashboard yang mudah digunakan

### Langkah 1: Buat Akun Supabase

1. **Buka Website Supabase:**

   - Buka browser
   - Ketik: `https://supabase.com`
   - Tekan Enter

2. **Sign Up:**

   - Klik tombol **"Start your project"** atau **"Sign Up"**
   - **Pilihan Sign Up:**
     - **Continue with GitHub** ← PILIH INI! (Recommended, langsung terintegrasi)
     - Continue with Google
     - Continue with Email
   - Jika pilih GitHub, klik **"Continue with GitHub"**
   - Authorize Supabase untuk akses GitHub
   - Anda akan login otomatis

3. **Selamat! Akun Supabase Sudah Jadi!**
   - Anda akan diarahkan ke Dashboard Supabase

### Langkah 2: Buat Project Database Baru

1. **Create New Project:**

   - Di Dashboard Supabase, klik tombol **"New Project"**
   - Atau klik **"+ New project"** di sidebar kiri

2. **Pilih Organization:**

   - Jika ini pertama kali, Supabase akan minta buat organization dulu
   - Klik **"Create a new organization"**
   - **Organization name:** Ketik nama (misal: nama Anda atau perusahaan)
   - **Plan:** Pilih **"Free"** (sudah terpilih)
   - Klik **"Create organization"**

3. **Isi Detail Project:**

   **a. Name:**

   - Ketik nama project: `lms-database` atau `learning-management-system`
   - Nama ini hanya untuk identifikasi di dashboard

   **b. Database Password:**

   - Generate password yang kuat
   - Klik icon generate (🔄) untuk auto-generate
   - Atau ketik password sendiri (minimal 12 karakter)
   - **PENTING: SIMPAN PASSWORD INI!** Copy ke Notepad

   **c. Region:**

   - Pilih region terdekat dengan lokasi Anda:
     - **Southeast Asia (Singapore)** ← Untuk Indonesia
     - Northeast Asia (Tokyo)
     - South Asia (Mumbai)
     - dll

   **d. Pricing Plan:**

   - Pastikan **"Free"** terpilih (limit 500MB database)

4. **Create Project:**
   - Klik tombol **"Create new project"**
   - **Tunggu 1-3 menit** (Supabase sedang setup database)
   - Progress bar akan muncul
   - Setelah selesai, dashboard project akan terbuka

### Langkah 3: Dapatkan Connection String (Kode Koneksi Database)

**Apa itu Connection String?**  
Connection String adalah kode rahasia yang digunakan aplikasi untuk connect ke database. Seperti password WiFi tapi untuk database.

1. **Buka Project Settings:**

   - Di dashboard project, klik icon **⚙️ Settings** di sidebar kiri bawah
   - Atau klik **"Project Settings"** di menu

2. **Buka Database Settings:**

   - Di sidebar Settings, klik **"Database"**
   - Scroll ke bagian **"Connection string"**

3. **Pilih Connection String untuk Prisma:**

   - Akan ada beberapa tab:
     - URI
     - Nodejs
     - JDBC
     - Golang
     - Python
   - Klik tab **"URI"**

4. **Copy Connection String:**

   - Akan ada 2 jenis URI:
     - **Connection pooling** (Session mode)
     - **Direct connection** (Transaction mode)

   **Kita butuh KEDUA-DUANYA untuk Prisma:**

   **a. Connection Pooling (untuk DATABASE_URL):**

   - Mode: **Session**
   - Klik untuk reveal/show string
   - Format:
     ```
     postgresql://postgres.xxxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - Klik icon copy (📋) untuk copy
   - Paste di Notepad, beri label: **DATABASE_URL**

   **b. Direct Connection (untuk DATABASE_DIRECT_URL):**

   - Mode: **Transaction**
   - Klik untuk reveal/show string
   - Format:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
     ```
   - Klik icon copy
   - Paste di Notepad, beri label: **DATABASE_DIRECT_URL**

5. **Replace [YOUR-PASSWORD]:**

   - Di kedua connection string, ada placeholder `[YOUR-PASSWORD]`
   - Ganti dengan password database yang Anda buat tadi
   - Jangan pakai tanda kurung `[]`

   **Contoh:**

   - Before: `postgres.xxx:[YOUR-PASSWORD]@aws`
   - After: `postgres.xxx:MyStr0ngP@ssw0rd@aws`

6. **Simpan ke Notepad:**

   - Save file dengan nama: `supabase-credentials.txt`
   - Simpan di lokasi aman
   - **JANGAN SHARE FILE INI!** Berisi password database

   **Contoh isi file:**

   ```
   DATABASE_URL=postgresql://postgres.abcdefghijk:MyStr0ngP@ssw0rd@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

   DATABASE_DIRECT_URL=postgresql://postgres:MyStr0ngP@ssw0rd@db.abcdefghijk.supabase.co:5432/postgres
   ```

---

## 🚀 BAGIAN 4: Download & Setup Project

### Langkah 1: Clone & Reset Git History (Project Seolah-olah Buatan Anda 100%)

**Tujuan:**  
Meng-clone project dan **menghapus semua history commit** dari repository asli, sehingga project benar-benar terlihat seperti dibuat dari awal oleh Anda.

**Perbedaan Metode:**

- **Fork:** History commit tetap terlihat dari repo asli
- **Import GitHub:** History masih ada tapi owner berubah
- **Clone + Reset History (METODE INI):** History commit hilang total, seolah-olah project baru 100%

**Langkah-Langkah:**

#### A. Clone Repository Asli ke Komputer

1. **Buat Folder untuk Project:**

   - Buka **File Explorer** (Windows + E)
   - Pergi ke **Documents** atau lokasi lain yang diinginkan
   - Klik kanan → **"New"** → **"Folder"**
   - Nama: `Projects` atau `Coding`
   - Buka folder tersebut

2. **Buka Git Bash:**

   - Klik kanan di dalam folder
   - Pilih **"Git Bash Here"**

3. **Clone Repository:**

   - Ketik perintah:
     ```bash
     git clone https://github.com/rifqiagniamubarok/lms.git
     ```
   - Tekan **Enter**
   - Tunggu download selesai (30-60 detik)

4. **Masuk ke Folder Project:**
   ```bash
   cd lms
   ```

#### B. Reset Git History (Hapus Semua Commit Lama)

**PENTING:** Langkah ini akan **menghapus semua history commit** dari repo asli!

1. **Hapus Folder .git (History Lama):**

   ```bash
   rm -rf .git
   ```

   - Perintah ini menghapus semua git history
   - Sekarang folder `lms` jadi folder biasa (bukan git repo)

2. **Inisialisasi Git Baru:**

   ```bash
   git init
   ```

   - Membuat git repository baru dari nol
   - Output: `Initialized empty Git repository`

3. **Add Semua File:**

   ```bash
   git add .
   ```

   - Menambahkan semua file ke staging

4. **Commit Pertama (Sebagai Pembuat Project):**
   ```bash
   git commit -m "Initial commit: LMS Project"
   ```
   - Ini akan jadi commit PERTAMA dan SATU-SATUNYA
   - Seolah-olah Anda yang buat project dari awal

#### C. Buat Repository Baru di GitHub

1. **Buka GitHub:**

   - Login ke akun GitHub baru Anda
   - Klik tombol **"+"** di pojok kanan atas
   - Pilih **"New repository"**

2. **Isi Detail Repository:**

   - **Repository name:** `lms` (atau nama lain sesuai keinginan)
   - **Description:** (opsional) "Learning Management System"
   - **Public** atau **Private** (pilih sesuai kebutuhan)
   - **JANGAN centang:**
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
   - (Kita sudah punya semua file dari clone)

3. **Create Repository:**
   - Klik **"Create repository"**
   - Akan muncul halaman dengan instruksi

#### D. Push ke Repository Baru Anda

1. **Connect ke Remote Repository:**

   - Copy URL repository baru (format: `https://github.com/username-anda/lms.git`)
   - Di Git Bash, ketik:
     ```bash
     git remote add origin https://github.com/username-anda/lms.git
     ```
   - Ganti `username-anda` dengan username GitHub Anda

2. **Rename Branch ke Main:**

   ```bash
   git branch -M main
   ```

3. **Push ke GitHub:**

   ```bash
   git push -u origin main
   ```

   - Mungkin akan minta login GitHub
   - Tunggu upload selesai (1-2 menit)

4. **Verifikasi:**
   - Buka repository di GitHub (`github.com/username-anda/lms`)
   - Cek tab **"Insights"** → **"Contributors"**
   - Hanya akan ada **1 contributor: ANDA**
   - Cek commit history: Hanya ada **1 commit: "Initial commit: LMS Project"**
   - **BERHASIL!** Project sekarang 100% milik Anda!

---

### Alternatif: Import Repository (Jika Tidak Masalah Ada History)

**Jika Anda tidak masalah history commit masih terlihat**, bisa pakai metode Import yang lebih cepat:

1. **Buka Halaman Import GitHub:**

   - Login ke GitHub
   - Buka: `https://github.com/new/import`

2. **Isi Form:**
   - **Old repository URL:**
     **Apa itu Clone?**  
     Clone adalah proses download project dari GitHub ke komputer Anda, sehingga bisa diedit dan dijalankan di local.

**Metode 1: Via Git Bash (Disarankan)**

1. **Buat Folder untuk Project:**

   - Buka **File Explorer** (tekan Windows + E)
   - Pergi ke **Documents** (atau lokasi lain yang Anda inginkan)
   - Klik kanan di area kosong
   - Pilih **"New"** → **"Folder"**
   - Nama folder: `Projects` atau `Coding`
   - Buka folder tersebut

2. **Buka Git Bash di Folder Tersebut:**

   - Klik kanan di area kosong dalam folder
   - Pilih **"Git Bash Here"** dari menu
   - Terminal Git Bash akan terbuka dengan path yang sudah benar

3. **Clone Repository:**
   - Pertama, kita perlu URL repository Anda
   - Buka browser, pergi ke repository GitHub Anda (`github.com/username-anda/lms`)
   - Klik tombol hijau **"<> Code"**
   - Akan muncul popup, pastikan tab **"HTTPS"** terpilih
   - Klik icon copy (📋) untuk copy URL
   - URL akan sBuka Project di VS Code

**Cara Termudah:**

1. **Via File Explorer:**
   - Buka File Explorer (Windows + E)
   - Pergi ke folder project Anda (misal: `C:\Users\NamaAnda\Documents\Projects\lms`)
   - Klik kanan di area kosong dalam folder
   - Pilih **"Open with Code"**
   - VS Code5: Setup Environment Variables (File Konfigurasi Rahasia)

**Apa itu Environment Variables?**  
Environment Variables adalah file yang berisi pengaturan rahasia seperti password database, API keys, dll. File ini **TIDAK boleh di-upload ke GitHub** karena berisi data sensitif.

**Apa itu File `.env`?**

- File konfigurasi untuk development (di komputer local)
- Dimulai dengan titik `.` (hidden file di Linux/Mac, tapi terlihat di Windows)
- Format: `NAMA_VARIABLE="nilai"`
- **CATATAN:** Project ini menggunakan `.env` (bukan `.env.local` atau `.env.production`)

**Langkah-Langkah:**

1. **Buat File `.env`:**

   **Cara 1 - Via VS Code (Termudah):**

   - Di VS Code, di sidebar kiri (Explorer), klik kanan di area kosong
   - Pilih **"New File"**
   - Ketik nama file: `.env` (pastikan ada titik di depan!)
   - Tekan **Enter**
   - File baru akan terbuka

   **Cara 2 - Copy dari .env.example:**

   - Di VS Code, buka file `.env.example`
   - Klik kanan pada file → **"Copy"**
   - Klik kanan di area kosong → **"Paste"**
   - Rename file hasil copy menjadi `.env`

   **Cara 3 - Via Terminal:**

   - Buka terminal di VS Code (Ctrl + `)
   - Ketik:
     ```bash
     cp .env.example .env
     ```
   - Atau:
     ````bash
     touch .env
     ```6: Setup Database Schema
     ````

**Apa itu Prisma?**  
Prisma adalah ORM (Object-Relational Mapping) - tools yang memudahkan interaksi dengan database. File `prisma/schema.prisma` berisi struktur database (tabel, kolom, relasi).

**Apa yang Akan Kita Lakukan:**

1. Generate Prisma Client (code untuk akses database)
2. Push schema ke database (membuat tabel-tabel)
3. Seed database (mengisi data awal)

**Langkah-Langkah:**

1. **Generate Prisma Client:**

   **Apa ini:** Generate code TypeScript untuk akses database

   - Di terminal VS Code, ketik:
     ```bash
     npx prisma generate
     ```
   - Tekan **Enter**
   - Akan muncul output:

     ```
     Prisma schema loaded from prisma\schema.prisma

     ✔ Generated Prisma Client (5.19.0) to .\node_modules\@prisma\client

     Start by importing your Prisma Client:
     ...
     ```

   - TBAGIAN 5: Deploy ke Vercel (Publish ke Internet)esai (10-30 detik)
   - Jika muncul tanda centang ✔, berarti **BERHASIL!**

2. **Push Schema ke Database:**

   **Apa ini:** Membuat tabel-tabel di database sesuai schema

   - Ketik perintah:
     ```bash
     npx prisma db push
     ```
   - Tekan **Enter**
   - Akan muncul output:

     ```
     Prisma schema loaded from prisma\schema.prisma
     Datasource "db": PostgreSQL database "verceldb"

     🚀 Your database is now in sync with your Prisma schema. Done in 2.5s

     ✔ Generated Prisma Client (5.19.0) to .\node_modules\@prisma\client
     ```

   - **Tunggu** sampai selesai (30-60 detik)
   - Jika muncul "database is now in sync", berarti **BERHASIL!**
   - Tabel-tabel seperti `users`, `admins`, `quiz`, dll sudah dibuat di database

3. **Seed Database (Isi Data Awal):**

   **Apa ini:** Mengisi database dengan data awal (soal quiz, badges, dll)

   - Ketik perintah:
     ```bash
     npx prisma db seed
     ```
   - Tekan **Enter**
   - Akan muncul output panjang:
     ```
     Running seed command...
     Seeding database...
     Creating classes...
     Creating levels...
     Creating quiz...
     ...
     ✅ Seeding completed successfully!
     ```
   - **Tunggu** sampai selesai (1-3 menit, karena banyak data)
   - Jika muncul "Seeding completed", berarti **BERHASIL!**
   - Database sekarang sudah berisi data dummy untuk testing

**Troubleshooting:**

- **Error: Environment variable not found: DATABASE_URL**

  - File `.env.local` belum dibuat atau salah nama
  - Pastikan file ada dan berisi `DATABASE_URL`
  - Restart terminal (tutup dan buka lagi)

- **Error: Can't reach database server**

  - Connection string salah
  - Cek kembali nilai DATABASE_URL di `.env.local`
  - Pastikan tidak ada spasi atau karakter aneh
  - Pastikan copy paste dari Vercel dengan benar

- **Error: P1001 atau P1003 (Connection error)**
  - Database belum siap atau region salah
  - Cek di Vercel apakah database sudah fully created
  - Tunggu beberapa menit lalu coba lagi

### Langkah 7: Jalankan Development Server

**Apa itu Development Server?**  
Server local yang menjalankan aplikasi di komputer Anda untuk testing. Bisa diakses via browser di `http://localhost:3000`.

**Langkah-Langkah:**

1. **Jalankan Server:**

   - Di terminal VS Code, ketik:
     ```bash
     npm run dev
     ```
   - Tekan **Enter**

2. **Tunggu Server Starting:**

   - Akan muncul output:

     ```
     > lms@0.1.0 dev
     > next dev

        ▲ Next.js 16.0.7
        - Local:        http://localhost:3000

      ✓ Starting...
      ✓ Ready in 2.5s
     ```

   - Tunggu sampai muncul tulisan **"Ready in X.Xs"**
   - Jika sudah muncul, server sudah jalan!

3. **Buka di Browser:**

   - Buka browser (Chrome/Edge/Firefox)
   - Di address bar, ketik:
     ```
     http://localhost:3000
     ```
   - Atau **Ctrl + Click** pada link `http://localhost:3000` di terminal
   - Tekan **Enter**

4. **Verifikasi Aplikasi Jalan:**

   - Halaman aplikasi LMS akan terbuka
   - Jika muncul halaman login atau homepage, berarti **BERHASIL!**
   - **SELAMAT! Project sudah jalan di local!**

5. **Testing:**
   - Coba klik-klik menu dan fitur
   - Coba login (lihat kredensial default di `prisma/seed.ts`)
   - Jika ada error, lihat di terminal atau browser console

**Cara Stop Server:**

- Kembali ke terminal VS Code
- Tekan **Ctrl + C**
- Ketik `Y` jika ditanya, lalu Enter
- Server akan stop

**Cara Jalankan Lagi:**

- Ketik `npm run dev` lagi
- Tekan Enter

**Troubleshooting:**

- **Error: Port 3000 is already in use**

  - Ada aplikasi lain yang pakai port 3000
  - Stop server lain yang jalan
  - Atau edit `package.json`, ubah script `dev` jadi: `"dev": "next dev -p 3001"`
  - Lalu akses di `http://localhost:3001`

- **Error: Module not found**

  - Dependencies belum terinstall lengkap
  - Stop server (Ctrl+C)
  - Jalankan `npm install` lagi
  - Lalu `npm run dev` lagi

- **Halaman error "Database connection failed"**

  - Cek `.env.local` apakah DATABASE_URL sudah benar
  - Cek koneksi internet
  - Restart development server

- **Halaman blank atau loading terus**

  - Check browser console (F12)
  - Lihat error di console
  - Atau coba refresh (Ctrl+R) atau hard refresh (Ctrl+Shift+R)n nilai `DATABASE_URL`

  - Copy nilai dari `POSTGRES_URL_NON_POOLING`
  - Paste di `.env.local` menggantikan nilai `DATABASE_DIRECT_URL`
    **Contoh hasil akhir:**

  ```env
  DATABASE_URL="postgres://default:abc123xyz@ep-example-123.us-east-1.postgres.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15"
  DATABASE_DIRECT_URL="postgres://default:abc123xyz@ep-example-123.us-east-1.postgres.vercel-storage.com:5432/verceldb"
  ```

4. **Generate AUTH_SECRET dan JWT_SECRET:**

   **Apa itu AUTH_SECRET & JWT_SECRET?**  
   String random untuk encrypt session authentication dan JWT token. Harus unique dan rahasia.

   **Cara Generate:**

   - Buka terminal di VS Code (Ctrl + `)
   - Generate AUTH_SECRET, ketik perintah ini lalu Enter:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     ```
   - Akan muncul output string random, seperti:
     ```
     qen1/zf88sNgTfqlVE4syNFHQUgBUlI2/3soDo1xn64=
     ```
   - **Copy string tersebut** (select dengan mouse lalu Ctrl+C)
   - Paste di `.env` setelah `AUTH_SECRET=`

   - Generate JWT_SECRET, ketik perintah ini lagi lalu Enter:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     ```
   - Akan muncul output string random yang berbeda, seperti:
     ```
     bbrIrq7x0/h4k9OynnpRMIciZWEOperFjapYANkPR0M=
     ```
   - **Copy string tersebut**
   - Paste di `.env` setelah `JWT_SECRET=`

5. **Hasil Akhir File `.env`:**

   File Anda sekarang harus terlihat seperti ini (dengan nilai sesungguhnya):

   ```env
   # Database Configuration - Supabase
   DATABASE_URL="postgresql://postgres.abcdefghijk:MyStr0ngP@ssw0rd@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DATABASE_DIRECT_URL="postgresql://postgres:MyStr0ngP@ssw0rd@db.abcdefghijk.supabase.co:5432/postgres"

   # Authentication Secrets
   AUTH_SECRET="qen1/zf88sNgTfqlVE4syNFHQUgBUlI2/3soDo1xn64="
   JWT_SECRET="bbrIrq7x0/h4k9OynnpRMIciZWEOperFjapYANkPR0M="
   ```

   **PENTING:**

   - Tidak ada tanda kutip (") di sekitar nilai
   - Langsung tulis nilai setelah tanda `=`
   - Tidak ada spasi sebelum atau sesudah `=`

6. **Save File:**

   - Tekan **Ctrl + S** untuk save
   - Pastikan tidak ada dot putih di tab file (tanda unsaved)

7. **PENTING - Jangan Upload ke GitHub:**
   - File `.env` sudah otomatis di-ignore oleh Git (tercantum di `.gitignore`)
   - Cek file `.gitignore` di root project, pastikan ada baris:
     ```
     .env
     ```
   - Jika ada, berarti aman! File tidak akan ter-upload ke GitHub
   - File `.env.example` **BOLEH** di-upload (template tanpa nilai sensitif)

**Troubleshooting:**

- **File `.env` tidak bisa dibuat:**

  - Windows mungkin block pembuatan file yang dimulai dengan titik
  - Gunakan cara via terminal: `cp .env.example .env`
  - Atau buat dengan nama sementara `env` lalu rename di terminal: `ren env .env`

- **String DATABASE_URL terlalu panjang:**
  - Itu normal, connection string memang panjang
  - Pastikan tidak ada line break (harus 1 baris)
  - Pastikan ada tanda kutip pembuka dan penutup
    Dependencies adalah library/package yang dibutuhkan project untuk berjalan. Seperti addon/plugin. Daftar semua dependencies ada di file `package.json`.

**Apa itu `npm install`?**  
`npm install` adalah perintah untuk download dan install semua dependencies yang tercantum di `package.json`. Ini wajib dilakukan setiap kali clone project baru.

**Langkah-Langkah:**

1. **Buka Terminal di VS Code:**

   - Di VS Code, tekan **Ctrl + `** (tombol backtick, sebelah kiri angka 1)
   - Atau klik menu **"Terminal"** → **"New Terminal"**
   - Terminal akan muncul di bagian bawah VS Code

2. **Pastikan Path Sudah Benar:**

   - Di terminal, lihat path yang ditampilkan
   - Harus menunjuk ke folder project, contoh:
     ```
     PS C:\Users\NamaAnda\Documents\Projects\lms>
     ```
   - Jika belum benar, ketik (sesuaikan dengan path Anda):
     ```bash
     cd C:\Users\NamaAnda\Documents\Projects\lms
     ```

3. **Install Dependencies:**

   - Ketik perintah:
     ```bash
     npm install
     ```
   - Atau versi singkatnya:
     ```bash
     npm i
     ```
   - Tekan **Enter**

4. **Tunggu Proses Instalasi:**

   - Akan muncul output seperti ini:

     ```
     npm WARN deprecated ...

     added 345 packages, and audited 346 packages in 1m

     50 packages are looking for funding
       run `npm fund` for details

     found 0 vulnerabilities
     ```

   - Proses ini akan **download ratusan file** (dependencies dan sub-dependencies)
   - **Durasi:** 2-10 menit tergantung kecepatan internet
   - **Ukuran download:** sekitar 100-300 MB

5. **Tunggu Sampai Selesai:**

   - Proses selesai jika muncul prompt lagi (misal: `PS C:\...\lms>`)
   - Jika tidak ada error merah, berarti **BERHASIL!**

6. **Verifikasi:**
   - Cek di File Explorer, sekarang ada folder baru: `node_modules`
   - Folder ini berisi semua dependencies yang baru diinstall
   - **Jangan edit atau hapus folder `node_modules` secara manual!**

**Troubleshooting:**

- **Error: 'npm' is not recognized:**

  - Node.js belum terinstall atau PATH belum di-set
  - Restart VS Code setelah install Node.js
  - Lihat bagian "Setting PATH Secara Manual" di atas

- **Error: EACCES atau permission denied:**

  - Jalankan terminal sebagai Administrator
  - Atau pindah folder project ke lokasi yang tidak butuh permission (hindari Program Files)

- **Error: network timeout atau ETIMEDOUT:**

  - Masalah koneksi internet
  - Coba lagi beberapa saat
  - Atau gunakan VPN jika ada blocking

- **Warning packages deprecated:**

  - Ini hanya warning, bukan error
  - Project tetap bisa jalan
  - Bisa diabaikan

    - Klik kanan di Git Bash → **"Paste"**
    - Atau tekan **Shift + Insert**

  - Tekan **Enter**

4. **Tunggu Proses Download:**

   - Akan muncul output seperti ini:
     ```
     Cloning into 'lms'...
     remote: Enumerating objects: 150, done.
     remote: Counting objects: 100% (150/150), done.
     remote: Compressing objects: 100% (100/100), done.
     remote: Total 150 (delta 50), reused 150 (delta 50)
     Receiving objects: 100% (150/150), 2.5 MiB | 1.2 MiB/s, done.
     Resolving deltas: 100% (50/50), done.
     ```
   - Tunggu sampai selesai (biasanya 10-60 detik)

5. **Masuk ke Folder Project:**

   - Setelah selesai, ketik:
     ```bash
     cd lms
     ```
   - Tekan **Enter**
   - Prompt akan berubah menunjukkan Anda sekarang di dalam folder lms

6. **Verifikasi:**
   - Ketik:
     ```bash
     ls
     ```
   - Tekan **Enter**
   - Akan muncul daftar file dan folder project (seperti: app, prisma, package.json, dll)
   - Jika muncul, berarti **BERHASIL!**

**Metode 2: Via GitHub Desktop (Lebih Mudah untuk Pemula)**

1. **Buka GitHub Desktop:**

   - Cari di Start Menu: `GitHub Desktop`
   - Buka aplikasi

2. **Clone Repository:**

   - Klik **"File"** di menu bar (pojok kiri atas)
   - Pilih **"Clone repository..."**
   - Atau tekan **Ctrl + Shift + O**

3. **Pilih Repository:**

   - Tab **"GitHub.com"** akan terbuka (jika belum login, login dulu)
   - Di daftar "Your repositories", cari repository `lms`
   - Klik pada repository tersebut

4. **Pilih Lokasi:**

   - Di bagian **"Local path"**, klik **"Choose..."**
   - Pilih folder tempat Anda ingin menyimpan project (misal: `C:\Users\NamaAnda\Documents\Projects`)
   - Klik **"Select Folder"**

5. **Clone:**

   - Klik tombol biru **"Clone"**
   - Tunggu proses download selesai
   - Setelah selesai, akan muncul tampilan repository di GitHub Desktop

6. **Buka Folder Project:**
   - Di GitHub Desktop, klik menu **"Repository"** → **"Show in Explorer"**
   - Atau klik **"Open in Visual Studio Code"** jika sudah install VS Code
   - Folder project akan terbukai, akan muncul halaman repository baru Anda
   - URL akan seperti: `https://github.com/username-anda/lms`
   - Repository sudah siap digunakan!

**Alternatif: Fork (Jika Tidak Masalah History Tetap Terlihat)**

Jika tidak masalah history commit menunjukkan repository asli, bisa pakai Fork yang lebih cepat:

1. Login ke GitHub
2. Buka: `https://github.com/rifqiagniamubarok/lms`
3. Klik tombol **"Fork"** di pojok kanan atas
4. Pilih akun Anda sebagai owner
5. Klik **"Create fork"**
6. Selesai dalam beberapa detik
   Vercel adalah platform untuk deploy (meng-online-kan) website secara gratis. Website Anda akan punya URL seperti `namaproject.vercel.app`.

**Langkah-Langkah:**

1. **Buka Website Vercel:**

   - Buka browser (tab baru)
   - Ketik: `https://vercel.com/signup`
   - Tekan Enter

2. **Sign Up dengan GitHub (PENTING!):**

   - Di halaman sign up, akan ada beberapa pilihan login:
     - Continue with GitHub ← **PILIH INI!**
     - Continue with GitLab
     - Continue with Bitbucket
     - Continue with Email
   - Klik tombol **"Continue with GitHub"**

3. **Authorize Vercel:**

   - Anda akan diarahkan ke halaman GitHub (jika belum login, login dulu)
   - GitHub akan tanya: "Authorize Vercel?"
   - Scroll ke bawah
   - Klik tombol hijau **"Authorize Vercel"**

4. **Konfirmasi Password GitHub:**

   - GitHub mungkin minta konfirmasi password
   - Ketik password GitHub Anda
   - Klik **"Confirm"**

5. **Selamat! Akun Vercel Sudah Terhubung dengan GitHub!**
   - Anda akan diarahkan ke Vercel Dashboard
   - Dashboard ini akan kosong dulu karena belum ada project

**Verifikasi Koneksi:**

- Di Vercel Dashboard, klik icon profil (pojok kanan atas)
- Pilih **"Account"** atau **"Settings"**
- Di tab **"General"**, Anda akan lihat akun GitHub Anda terhubung
- Jika ada, berarti **BERHASIL!**Prisma"\*\* by Prisma (yang paling atas)

5. Ulangi untuk extension lainnya:
   - Ketik: `ESLint` → Install
   - Ketik: `Tailwind CSS IntelliSense` → Install
6. Selesai!

### 4. **GitHub Desktop** (Optional - Untuk Yang Belum Familiar dengan Terminal)

**Apa itu GitHub Desktop?**  
Aplikasi dengan tampilan grafis untuk mengelola Git, lebih mudah untuk pemula daripada menggunakan terminal.

**Cara Download & Install:**

1. Buka browser
2. Ketik: `https://desktop.github.com/`
3. Klik **"Download for Windows"**
4. Double-click file yang terdownload: `GitHubDesktopSetup-x64.exe`
5. Instalasi akan berjalan otomatis
6. Setelah selesai, login dengan akun GitHub Anda (nanti setelah buat akun)

---

## 🔧 Setting PATH Secara Manual (Jika Ada Masalah)

**Apa itu PATH?**  
PATH adalah daftar lokasi folder di Windows yang berisi program-program. Dengan setting PATH, kita bisa menjalankan `node` atau `npm` dari folder mana saja.

**Cara Setting PATH untuk Node.js & npm:**

1. **Buka Environment Variables:**

   - Klik kanan icon **"This PC"** atau **"My Computer"** di desktop
   - Pilih **"Properties"**
   - Klik **"Advanced system settings"** di sidebar kiri
   - Klik tombol **"Environment Variables..."** di bagian bawah

2. **Edit PATH:**

   - Di bagian **"User variables"** (bagian atas), cari variable bernama **"Path"**
   - Klik pada **"Path"** lalu klik tombol **"Edit..."**
   - Jendela baru akan muncul dengan daftar path

3. **Tambahkan Path Node.js:**
   - Klik tombol **"New"**
   - Ketik path berikut (sesuaikan dengan username Windows Anda):
     ```
     C:\Program Files\nodejs\
     ```
   - Klik **"New"** lagi
   - Ketik:
     ```
     C:\Users\NamaUserAnda\AppData\Roaming\npm
     ```
     Ganti `NamaUserAnda` dengan username Windows Anda
4. **Simpan:**

   - Klik **"OK"** pada semua jendela
   - **RESTART komputer** agar perubahan berlaku

5. **Verifikasi Lagi:**
   - Setelah restart, buka Command Prompt baru
   - Ketik: `npm --version`
   - Jika muncul versi, berarti **BERHASIL!**

---

## 🔐 BAGIAN 2: Buat Akun-Akun Yang Dibutuhkan

6. Klik **"Next"**
7. Pada "Choosing the default editor", pilih **"Use Visual Studio Code as Git's default editor"** (jika sudah install VS Code) atau biarkan **"Use Vim"**
8. Pada "Adjusting your PATH environment", pilih **"Git from the command line and also from 3rd-party software"** (biasanya sudah terpilih)
9. Untuk halaman-halaman selanjutnya, klik **"Next"** terus dengan setting default
10. Klik **"Install"** dan tunggu proses selesai
11. Klik **"Finish"**

**Verifikasi Instalasi:**

1. Klik kanan di **Desktop** (layar utama Windows)
2. Jika muncul menu **"Git Bash Here"**, berarti **BERHASIL!**
3. Klik **"Git Bash Here"** untuk membuka terminal Git
4. Jendela terminal akan muncul (background hitam/biru)
5. Ketik perintah ini lalu tekan **Enter**:
   ```bash
   git --version
   ```
6. Jika muncul tulisan seperti `git version 2.43.0` berarti **BERHASIL!**
7. Ketik `exit` lalu Enter untuk keluar

**Setting Git (Hanya Dilakukan Sekali):**

1. Buka Git Bash (klik kanan di desktop → "Git Bash Here")
2. Ketik perintah ini satu per satu (ganti dengan data Anda):

   ```bash
   git config --global user.name "Nama Anda"
   ```

   Tekan **Enter**

   ```bash
   git config --global user.email "email@anda.com"
   ```

   Tekan **Enter**

3. Selesai! Git sudah siap digunakan

### 3. **Visual Studio Code** (Recommended)

- Download dari: https://code.visualstudio.com/
- Pilih versi Windows
- Extension yang disarankan:
  - Prisma (untuk database schema)
  - ESLint (untuk code linting)
  - Tailwind CSS IntelliSense

### 4. **GitHub Desktop** (Optional - untuk yang tidak familiar dengan Git CLI)

- Download dari: https://desktop.github.com/

---

## 🔐 Akun Yang Perlu Dibuat

### 1. **GitHub Account**

1. Buka: https://github.com/signup
2. Masukkan email baru
3. Buat username unik
4. Buat password yang kuat
5. Verifikasi email
6. Setup profile (foto, bio, dll)

### 2. **Vercel Account**

1. Buka: https://vercel.com/signup
2. **Penting**: Sign up menggunakan akun GitHub yang baru dibuat
3. Authorize Vercel untuk akses GitHub
4. Vercel akan otomatis terhubung dengan GitHub

---

## 🗄️ Setup Database di Vercel

### Langkah 1: Buat Postgres Database

1. Login ke Vercel Dashboard: https://vercel.com/dashboard
2. Klik tab **"Storage"** di menu atas
3. Klik tombol **"Create Database"**
4. Pilih **"Postgres"**
5. Masukkan nama database: `lms-database` (atau nama lain sesuai keinginan)
6. Pilih region terdekat (misalnya: Singapore untuk Indonesia)
7. Klik **"Create"**

### Langkah 2: Dapatkan Connection String

1. Setelah database dibuat, buka database tersebut
2. Klik tab **".env.local"**
3. Copy semua environment variables yang ditampilkan:
   ```
   POSTGRES_URL="..."
   POSTGRES_PRISMA_URL="..."
   POSTGRES_URL_NO_SSL="..."
   POSTGRES_URL_NON_POOLING="..."
   POSTGRES_USER="..."
   POSTGRES_HOST="..."
   POSTGRES_PASSWORD="..."
   POSTGRES_DATABASE="..."
   ```
4. Simpan informasi ini di notepad dulu, nanti akan digunakan

---

## 🚀 Setup Project dari GitHub

### Langkah 1: Fork Repository (Membuat Kepemilikan Sendiri)

#### Cara 1: Via GitHub Website

1. Login ke akun GitHub baru
2. Buka: https://github.com/rifqiagniamubarok/lms
3. Klik tombol **"Fork"** di kanan atas
4. Pilih akun GitHub baru sebagai owner
5. Biarkan nama repository tetap `lms` atau ganti sesuai keinginan
6. Klik **"Create Fork"**

#### Cara 2: Import Repository (Seolah-olah Project Baru)

1. Login ke akun GitHub baru
2. Buka: https://github.com/new/import
3. Masukkan URL repository lama: `https://github.com/rifqiagniamubarok/lms.git`
4. Beri nama repository baru: `lms` atau nama lain
5. Pilih **Public** atau **Private**
6. Klik **"Begin Import"**
7. Tunggu proses import selesai (biasanya 1-5 menit)

### Langkah 2: Clone Repository ke Komputer

#### Via Git Bash:

1. Buka Git Bash (klik kanan di desktop → "Git Bash Here")
2. Pindah ke folder tempat project akan disimpan:
   ```bash
   cd C:/Users/NamaUser/Documents
   ```
3. Clone repository (ganti `USERNAME` dengan username GitHub baru):
   ```bash
   git clone https://github.com/USERNAME/lms.git
   ```
4. Masuk ke folder project:
   ```bash
   cd lms
   ```

#### Via GitHub Desktop:

1. Buka GitHub Desktop
2. Klik **"File"** → **"Clone Repository"**
3. Pilih repository `lms` yang sudah di-fork
4. Pilih lokasi folder
5. Klik **"Clone"**

### Langkah 3: Install Dependencies

1. Buka terminal (Git Bash atau Command Prompt) di folder project
2. Jalankan perintah:
   ```bash
   npm install
   ```
3. Tunggu hingga semua package terinstall (biasanya 2-5 menit)

### Langkah 4: Setup Environment Variables

1. Copy file `.env.example` menjadi `.env`:

   ```bash
   cp .env.example .env
   ```

2. Buka file `.env` dan isi dengan nilai yang benar:

   ```env
   # Database - Copy dari Supabase
   DATABASE_URL=postgresql://...
   DATABASE_DIRECT_URL=postgresql://...

   # Authentication Secrets
   AUTH_SECRET=
   JWT_SECRET=
   ```

3. **Cara generate AUTH_SECRET dan JWT_SECRET:**

   - Buka terminal
   - Jalankan untuk AUTH_SECRET:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     ```
   - Copy hasilnya dan paste ke `AUTH_SECRET=`

   - Jalankan lagi untuk JWT_SECRET:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
     ```
   - Copy hasilnya dan paste ke `JWT_SECRET=`

**PENTING:** Jangan pakai tanda kutip di file `.env`, langsung tulis nilai setelah `=`

### Langkah 5: Setup Database Schema

1. Generate Prisma Client:

   ```bash
   npx prisma generate
   ```

2. Push schema ke database:

   ```bash
   npx prisma db push
   ```

3. Seed database dengan data awal (soal, badges, dll):
   ```bash
   npx prisma db seed
   ```

### Langkah 6: Jalankan Development Server

1. Jalankan perintah:
   ```bash
   npm run dev
   ```
2. Buka browser dan akses: http://localhost:3000
3. Project sekarang berjalan di local!

---

## 🌐 Deploy ke Vercel

### Langkah 1: Connect Repository ke Vercel

1. Login ke Vercel Dashboard
2. Klik **"Add New"** → **"Project"**
3. Pilih repository `lms` dari GitHub
4. Klik **"Import"**

### Langkah 2: Configure Project

1. **Project Name**: Biarkan default atau ubah sesuai keinginan
2. **Framework Preset**: Next.js (otomatis terdeteksi)
3. **Root Directory**: `./` (default)
4. **Build Settings**: Biarkan default

### Langkah 3: Setup Environment Variables

1. Klik **"Environment Variables"**
2. Tambahkan variable berikut satu per satu:

   - `DATABASE_URL` = (copy dari Supabase - Connection Pooling)
   - `DATABASE_DIRECT_URL` = (copy dari Supabase - Direct Connection)
   - `DATABASE_URL` = (copy dari Supabase - Connection Pooling)\n - `DATABASE_DIRECT_URL` = (copy dari Supabase - Direct Connection)\n - `AUTH_SECRET` = (sama dengan yang di .env)\n - `JWT_SECRET` = (sama dengan yang di .env)
   - `NEXTAUTH_URL` = (akan diisi setelah deploy, untuk sementara kosongkan)

3. Klik **"Deploy"**

### Langkah 4: Update NEXTAUTH_URL

1. Setelah deploy selesai, copy URL production (misalnya: `https://lms-username.vercel.app`)
2. Kembali ke **"Settings"** → **"Environment Variables"**
3. Edit `NEXTAUTH_URL` dengan URL production
4. Redeploy project (Vercel akan otomatis redeploy)

### Langkah 5: Connect Database ke Vercel Project

1. Buka project di Vercel Dashboard
2. Klik tab **"Storage"**
3. Klik **"Connect Store"**
4. Pilih database yang sudah dibuat sebelumnya
5. Klik **"Connect"**

---

## ✅ Verifikasi Setup Berhasil

### Di Local:

- [ ] `npm run dev` berjalan tanpa error
- [ ] Bisa akses http://localhost:3000
- [ ] Halaman login tampil dengan benar
- [ ] Database terkoneksi (tidak ada error Prisma)

### Di Production:

- [ ] URL Vercel bisa diakses
- [ ] Halaman login tampil dengan benar
- [ ] Bisa login dengan akun yang di-seed
- [ ] Database production terkoneksi

---

---

## 🔧 BAGIAN 7: Troubleshooting Umum

### Masalah Instalasi Software

#### **Error: 'node' is not recognized as an internal or external command**

**Penyebab:** Node.js belum terinstall atau PATH belum di-set

**Solusi:**

1. Pastikan Node.js sudah terinstall (cek di Control Panel > Programs)
2. Restart Command Prompt/Terminal
3. Restart VS Code
4. Restart komputer
5. Jika masih error, lihat bagian "Setting PATH Secara Manual"

#### **Error: 'npm' is not recognized**

**Penyebab:** npm tidak terinstall atau PATH belum di-set (padahal npm terinstall otomatis dengan Node.js)

**Solusi:**

1. Cek apakah Node.js terinstall: `node --version`
2. Jika Node.js terinstall tapi npm tidak, reinstall Node.js
3. Pastikan saat install Node.js, opsi "npm package manager" tercentang
4. Set PATH secara manual (lihat bagian di atas)

#### **Error: 'git' is not recognized**

**Penyebab:** Git belum terinstall atau PATH belum di-set

**Solusi:**

1. Reinstall Git dari https://git-scm.com/download/win
2. Pastikan pilih opsi "Git from the command line and also from 3rd-party software"
3. Restart terminal
4. Restart komputer

### Masalah Clone & Download Repository

#### **Error: Permission denied (publickey)**

**Penyebab:** Mencoba clone dengan SSH tapi belum setup SSH key

**Solusi:**

- Gunakan HTTPS untuk clone, bukan SSH
- URL HTTPS: `https://github.com/username/lms.git`
- Bukan URL SSH: `git@github.com:username/lms.git`

#### **Error: Repository not found**

**Penyebab:** URL repository salah atau repository private tapi belum login

**Solusi:**

1. Cek URL repository, pastikan username benar
2. Pastikan repository sudah di-fork/import ke akun Anda
3. Jika repository private, login ke GitHub via Git:
   ```bash
   git config --global credential.helper wincred
   ```
   Lalu clone lagi, akan muncul popup login

### Masalah Dependencies & Install

#### **Error: npm ERR! EACCES permission denied**

**Penyebab:** Tidak punya permission untuk install di folder tertentu

**Solusi:**

1. **Jangan install di folder Program Files**
2. Pindah project ke folder Documents atau folder user
3. Atau jalankan terminal sebagai Administrator (tidak disarankan)

#### **Error: npm ERR! network timeout / ETIMEDOUT**

**Penyebab:** Koneksi internet lambat atau terblokir

**Solusi:**

1. Cek koneksi internet
2. Coba lagi beberapa saat
3. Gunakan VPN jika ada blocking
4. Ubah npm registry:
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

#### **Error: npm ERR! code ERESOLVE (dependency conflict)**

**Penyebab:** Konflik versi dependencies

**Solusi:**

1. Hapus folder `node_modules` dan file `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   ```
2. Install ulang dengan force:
   ```bash
   npm install --legacy-peer-deps
   ```

### Masalah Environment Variables

#### **Error: Environment variable not found: DATABASE_URL**

**Penyebab:** File `.env.local` tidak ada atau salah lokasi

**Solusi:**

1. Pastikan file `.env.local` ada di **root project** (sejajar dengan `package.json`)
2. Pastikan nama file tepat: `.env.local` (pakai titik di depan!)
3. Restart terminal VS Code (tutup dan buka lagi)
4. Restart VS Code

#### **Error: Invalid connection string**

**Penyebab:** Connection string salah format atau ada karakter aneh

**Solusi:**

1. Copy ulang dari Vercel, pastikan tidak ada spasi atau line break
2. Connection string harus dalam tanda kutip:
   ```env
   DATABASE_URL="postgresql://..."
   ```
3. Pastikan tidak ada karakter tersembunyi (copy ke Notepad dulu, lalu copy ke .env.local)

#### **File `.env.local` tidak bisa dibuat di Windows**

**Penyebab:** Windows Explorer tidak bisa buat file yang dimulai dengan titik

**Solusi:**

- Buat via VS Code (New File → ketik `.env.local`)
- Atau via terminal: `touch .env.local`
- Atau buat file `env.local` dulu, lalu rename via terminal:
  ```bash
  ren env.local .env.local
  ```

### Masalah Prisma & Database

#### **Error: Can't reach database server at ...**

**Penyebab:** Connection string salah atau database tidak accessible

**Solusi:**

1. Cek `.env.local`, pastikan `DATABASE_URL` benar
2. Test connection string:
   ```bash
   npx prisma db pull
   ```
3. Login ke Vercel, cek apakah database masih aktif
4. Cek di Vercel > Storage > lms-database > Data, apakah ada data
5. Tunggu beberapa menit (database mungkin masih booting)

#### **Error: P1001 Authentication failed**

**Penyebab:** Password atau username database salah

**Solusi:**

1. Copy ulang connection string dari Vercel (tab .env.local)
2. Pastikan copy dari **POSTGRES_PRISMA_URL** untuk DATABASE_URL
3. Pastikan tidak ada perubahan tidak sengaja di connection string

#### **Error: Prisma schema not found**

**Penyebab:** Menjalankan command prisma di folder yang salah

**Solusi:**

1. Pastikan terminal berada di root project:
   ```bash
   pwd    # Linux/Mac
   cd     # Windows
   ```
2. Harus menunjuk ke folder yang ada `package.json` dan folder `prisma`
3. Jika salah folder:
   ```bash
   cd C:\Users\NamaAnda\Documents\Projects\lms
   ```

#### **Error saat seed: Duplicate entry**

**Penyebab:** Mencoba seed ulang padahal data sudah ada

**Solusi:**

1. Reset database:
   ```bash
   npx prisma migrate reset
   ```
   Ketik `yes` untuk confirm
2. Atau hapus semua data manual via Prisma Studio:
   ```bash
   npx prisma studio
   ```
   Buka di browser, hapus data, lalu seed ulang

### Masalah Development Server

#### **Error: Port 3000 already in use**

**Penyebab:** Ada aplikasi lain yang pakai port 3000

**Solusi:**

1. **Cara 1:** Stop aplikasi lain yang pakai port 3000
2. **Cara 2:** Ubah port Next.js:
   - Edit `package.json`
   - Ubah baris:
     ```json
     "dev": "next dev"
     ```
     Jadi:
     ```json
     "dev": "next dev -p 3001"
     ```
   - Save, lalu jalankan `npm run dev`
   - Akses di `http://localhost:3001`

#### **Error: Module not found**

**Penyebab:** Dependencies tidak terinstall lengkap

**Solusi:**

1. Stop server (Ctrl+C)
2. Hapus `node_modules`:
   ```bash
   rm -rf node_modules
   ```
3. Install ulang:
   ```bash
   npm install
   ```
4. Generate Prisma:
   ```bash
   npx prisma generate
   ```
5. Jalankan lagi:
   ```bash
   npm run dev
   ```

#### **Halaman blank atau error di browser**

**Penyebab:** Bisa berbagai hal

**Solusi:**

1. Buka Browser Console (F12)
2. Lihat error di tab Console
3. Cek tab Network untuk error API
4. Hard refresh: Ctrl + Shift + R
5. Clear cache & cookies
6. Coba browser lain

### Masalah Deploy Vercel

#### **Build Error di Vercel**

**Penyebab:** Environment variables tidak lengkap atau ada error di code

**Solusi:**

1. Buka Vercel > Project > Deployments > Klik deployment yang error
2. Klik **"View Build Logs"**
3. Baca error yang muncul
4. Common issues:
   - Environment variables belum di-set
   - Typo di DATABASE_URL
   - Dependencies yang tidak compatible
5. Fix issue, lalu redeploy

#### **Deployment Success tapi Website Error**

**Penyebab:** Runtime error, biasanya database connection

**Solusi:**

1. Cek **Function Logs** di Vercel
2. Verifikasi environment variables:
   - DATABASE_URL
   - DATABASE_DIRECT_URL
   - AUTH_SECRET
   - NEXTAUTH_URL
3. Pastikan NEXTAUTH_URL sudah di-update dengan URL production
4. Pastikan database Vercel masih aktif

#### **Error: "Application error: a client-side exception has occurred"**

**Penyebab:** Runtime error di production

**Solusi:**

1. Cek browser console (F12)
2. Cek Vercel Function Logs
3. Biasanya karena:
   - AUTH_SECRET tidak di-set
   - NEXTAUTH_URL salah
   - Database tidak terkoneksi
4. Fix environment variables, lalu redeploy

---

## 📝 BAGIAN 8: Tips & Best Practices

---

## 📝 BAGIAN 8: Tips & Best Practices

### Untuk Development (Coding)

#### **Gunakan Git Branch untuk Fitur Baru**

Jangan langsung edit di branch `main`. Buat branch baru untuk setiap fitur:

```bash
# Cek branch saat ini
git branch

# Buat dan pindah ke branch baru
git checkout -b fitur-baru

# Atau
git branch fitur-baru
git checkout fitur-baru
```

Setelah selesai coding:

```bash
# Add & commit perubahan
git add .
git commit -m "Menambahkan fitur baru"

# Push ke GitHub
git push origin fitur-baru
```

Lalu buat Pull Request di GitHub untuk merge ke `main`.

#### **Commit Perubahan Secara Berkala**

Jangan tunggu sampai banyak perubahan. Commit sering dengan pesan yang jelas:

```bash
# Cek file yang berubah
git status

# Add file tertentu
git add nama-file.tsx

# Atau add semua
git add .

# Commit dengan pesan
git commit -m "Fix bug login page"

# Push ke GitHub
git push
```

#### **Gunakan Prisma Studio untuk Manage Data**

Untuk melihat dan edit data database secara visual:

```bash
npx prisma studio
```

Browser akan terbuka di `http://localhost:5555` dengan UI untuk CRUD data.

#### **Hot Reload Otomatis**

Saat development server jalan (`npm run dev`), setiap kali Anda save file, halaman akan otomatis reload. Tidak perlu restart server.

### Untuk Production (Deploy)

#### **Auto Deploy dari GitHub**

Setelah setup awal, setiap kali Anda push ke branch `main`, Vercel akan otomatis deploy:

```bash
# Coding selesai di local
git add .
git commit -m "Update fitur XYZ"
git push origin main
```

Langsung cek di Vercel Dashboard, deployment otomatis jalan!

#### **Preview Deployment untuk Branch Lain**

Jika push ke branch selain `main`, Vercel akan membuat **Preview Deployment** dengan URL unik:

```bash
git checkout -b testing-fitur
# ... coding ...
git push origin testing-fitur
```

Vercel akan deploy di URL seperti: `https://lms-git-testing-fitur-username.vercel.app`

Berguna untuk testing sebelum merge ke `main`.

#### **Rollback Deployment**

Jika deployment baru ada bug, bisa rollback ke versi sebelumnya:

1. Buka Vercel > Project > Deployments
2. Cari deployment yang stabil (ada tanda centang hijau)
3. Klik **"..."** → **"Promote to Production"**
4. Deployment lama akan jadi production lagi

### Database Management

#### **Backup Data Secara Berkala**

Vercel Postgres gratisan tidak punya auto-backup. Backup manual:

1. Export data via Prisma:

   ```bash
   npx prisma db pull
   npx prisma db push --preview-feature
   ```

2. Atau via Vercel Storage dashboard:
   - Buka database di Vercel
   - Tab "Data"
   - Export table satu per satu (tidak ada export all di free tier)

#### **Jangan Edit Database Production Sembarangan**

- Gunakan Prisma migrations untuk perubahan schema
- Test di local dulu sebelum push ke production
- Gunakan environment variable untuk switch antara local dan production database

#### **Monitor Database Usage**

Free tier Vercel Postgres punya limit:

- **Storage:** 256 MB
- **Compute:** 60 jam/bulan

Cek usage di: Vercel > Storage > lms-database > Usage

### Security

#### **Jangan Commit File `.env.local`**

File `.env.local` sudah ada di `.gitignore`, tapi double check:

```bash
git status
```

Jika `.env.local` muncul di list, berarti `.gitignore` belum bekerja. Tambahkan manual:

1. Buka file `.gitignore`
2. Tambahkan baris:
   ```
   .env*.local
   .env
   ```
3. Save

#### **Ganti Password Default**

Setelah seed database, ada akun admin dengan password default. **WAJIB GANTI** setelah login pertama kali!

#### **Gunakan Strong Password untuk AUTH_SECRET**

AUTH_SECRET yang kita generate dengan:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Sudah cukup kuat. **Jangan gunakan kata-kata biasa!**

### Performance

#### **Gunakan `npm run build` Untuk Test Production Build**

Sebelum deploy, test production build di local:

```bash
npm run build
npm run start
```

Akses di `http://localhost:3000`. Jika ada error, fix dulu sebelum deploy.

#### **Monitor Vercel Analytics**

Vercel punya analytics gratis:

1. Buka project di Vercel
2. Tab **"Analytics"**
3. Lihat:
   - Page load time
   - Visitor count
   - Geographic distribution

---

## 📚 BAGIAN 9: Dokumentasi & Resources

### File Penting di Project

| File/Folder            | Fungsi                                          |
| ---------------------- | ----------------------------------------------- |
| `package.json`         | Daftar dependencies dan scripts                 |
| `.env.local`           | Environment variables untuk local               |
| `prisma/schema.prisma` | Schema database (struktur tabel)                |
| `prisma/seed.ts`       | Script untuk isi data awal                      |
| `app/`                 | Folder halaman dan routing (Next.js App Router) |
| `components/`          | Reusable UI components                          |
| `utils/`               | Helper functions                                |
| `public/`              | Static files (gambar, dll)                      |
| `node_modules/`        | Dependencies (jangan edit!)                     |
| `.next/`               | Build output (jangan edit!)                     |

### Command Cheat Sheet

#### **NPM Commands:**

```bash
npm install              # Install dependencies
npm run dev             # Jalankan development server
npm run build           # Build untuk production
npm run start           # Jalankan production build
npm run lint            # Check linting errors
```

#### **Prisma Commands:**

```bash
npx prisma generate     # Generate Prisma Client
npx prisma db push      # Push schema ke database
npx prisma db pull      # Pull schema dari database
npx prisma db seed      # Seed database dengan data
npx prisma studio       # Buka Prisma Studio (GUI)
npx prisma migrate dev  # Create migration (jika pakai migrations)
npx prisma migrate reset # Reset database & rerun migrations
```

#### **Git Commands:**

```bash
git status              # Lihat status file
git add .               # Add semua perubahan
git add file.txt        # Add file tertentu
git commit -m "pesan"   # Commit dengan pesan
git push                # Push ke GitHub (branch saat ini)
git push origin main    # Push ke branch main
git pull                # Pull perubahan dari GitHub
git checkout -b branch  # Buat dan pindah ke branch baru
git checkout main       # Pindah ke branch main
git branch              # Lihat semua branch
git log                 # Lihat history commit
```

### Dokumentasi Online

**Teknologi yang Digunakan:**

- **Next.js:** https://nextjs.org/docs
- **React:** https://react.dev/
- **Prisma:** https://www.prisma.io/docs
- **NextAuth:** https://next-auth.js.org/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs
- **Vercel:** https://vercel.com/docs

**Tutorial & Learning:**

- Next.js Tutorial: https://nextjs.org/learn
- Prisma Getting Started: https://www.prisma.io/docs/getting-started
- Git Tutorial: https://www.atlassian.com/git/tutorials

---

## 🎯 BAGIAN 10: Next Steps (Setelah Setup Berhasil)

### Yang Bisa Dilakukan Selanjutnya:

1. **Eksplorasi Codebase:**

   - Baca file-file di folder `app/` untuk understand routing
   - Lihat `prisma/schema.prisma` untuk understand struktur database
   - Cek `components/` untuk lihat UI components yang tersedia

2. **Customisasi:**

   - Ubah warna/tema di `app/globals.css`
   - Edit nama aplikasi di `app/layout.tsx`
   - Tambah logo sendiri di `public/`

3. **Tambah Fitur Baru:**

   - Buat halaman baru di `app/`
   - Tambah API route di `app/api/`
   - Buat component baru di `components/`

4. **Setup Custom Domain (Optional):**

   - Beli domain (Namecheap, GoDaddy, dll)
   - Connect ke Vercel: Vercel > Project > Settings > Domains
   - Ubah DNS settings di registrar
   - Website bisa diakses via domain sendiri (misal: `www.namaanda.com`)

5. **Monitoring & Analytics:**

   - Setup Vercel Analytics (sudah include)
   - Atau setup Google Analytics
   - Monitor errors dengan Sentry (opsional)

6. **Collaboration:**
   - Invite teman ke repository GitHub
   - Gunakan Pull Request untuk code review
   - Setup CI/CD dengan GitHub Actions (advanced)

---

## 🎉 Selamat!

**Congratulations!** 🎊

Project LMS Anda sekarang sudah:

- ✅ Terinstall lengkap di komputer Windows
- ✅ Jalan di local development (http://localhost:3000)
- ✅ Ter-deploy online di Vercel
- ✅ Punya database online PostgreSQL
- ✅ Repository GitHub milik akun baru
- ✅ Siap untuk dikembangkan lebih lanjut!

**Repository GitHub baru Anda sekarang seolah-olah adalah project yang Anda buat sendiri dari awal!** Semua history dan commit akan tercatat atas nama akun GitHub baru.
