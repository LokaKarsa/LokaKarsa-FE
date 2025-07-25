# LokaKarsa Frontend

LokaKarsa merupakan platform pembelajaran aksara Jawa yang interaktif dan seru, menggabungkan teknologi AI untuk memberikan pengalaman belajar yang personal dan efektif.

## Fitur Utama

### Pembelajaran Interaktif

-   **Kurikulum Terstruktur**: Pembelajaran bertahap dari dasar hingga mahir
-   **Multiple Choice Questions**: Soal pilihan ganda untuk pemahaman teori
-   **Canvas Drawing Practice**: Latihan menulis aksara langsung di canvas

### Teknologi AI

-   **Canvas Drawing Recognition**: AI dapat mengenali tulisan aksara Jawa
-   **Confidence Scoring**: Tingkat kepercayaan AI dalam mengenali tulisan
-   **Educational Guidance**: Tips dan saran untuk perbaikan tulisan

### Gamifikasi

-   **Progress Tracking**: Pantau kemajuan belajar
-   **Achievement Badges**: Dapatkan badge untuk pencapaian tertentu
-   **Score System**: Sistem penilaian yang memotivasi

## Tech Stack

-   **Frontend Framework**: React + Vite
-   **Routing**: React Router v7
-   **UI Library**: Tailwind CSS + Shadcn/ui
-   **HTTP Client**: Axios
-   **Icons**: Lucide React
-   **Package Manager**: Bun

## Prerequisites

Pastikan Anda memiliki:

-   **Node.js** (versi 18 atau lebih baru)
-   **Bun** (package manager)
-   **Git**

## 🛠️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/LokaKarsa/LokaKarsa-FE.git
cd LokaKarsa-FE
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Environment Configuration

Buat file `.env` di root project:

```env
VITE_API_BASE_URL=
VITE_MODEL_API_BASE_URL=
```

### 4. Development Server

```bash
bun run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── fragments/          # Komponen utama aplikasi
│   │   ├── auth/          # Komponen autentikasi
│   │   ├── ui/            # UI components (Shadcn)
│   │   ├── dashboard.jsx   # Dashboard utama
│   │   ├── practice-interface.jsx  # Interface latihan
│   │   ├── writing-canvas.jsx      # Canvas untuk menulis
│   │   └── navigation.jsx          # Navigasi aplikasi
│   └── layouts/           # Layout components
├── hooks/
│   └── api/              # Custom hooks untuk API calls
├── pages/                # Halaman utama aplikasi
├── provider/             # Context providers
├── routes/               # Konfigurasi routing
└── lib/                  # Utility functions
```

## 🎮 Cara Menggunakan

### 1. **Registrasi & Login**

-   Buat akun baru atau login dengan akun existing
-   Sistem autentikasi menggunakan JWT token

### 2. **Dashboard**

-   Lihat progress pembelajaran
-   Akses berbagai level dan unit
-   Pantau statistik belajar

### 3. **Latihan Canvas**

-   Pilih karakter aksara yang ingin dipelajari
-   Gambar di canvas menggunakan mouse/touch
-   Klik "Submit Jawaban" untuk analisis AI
-   Dapatkan feedback real-time

### 4. **Quiz & Assessment**

-   Jawab soal multiple choice
-   Kumpulkan poin dan badge
-   Naik level untuk unlock konten baru

**Dibuat dengan ❤️ untuk pelestarian budaya Jawa melalui teknologi modern**
