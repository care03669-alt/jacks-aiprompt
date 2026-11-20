# Jaccksallas AI Master Prompt Builder — V1.0

Website generator master prompt untuk proyek Game, APK/Mobile App, dan Website.

## Fitur yang tersedia pada V1.0

- Dashboard dark futuristic dan responsive untuk HP Android.
- Prompt Studio dengan kategori Game, APK/Mobile App, dan Website.
- Local prompt engine: membuat master prompt terstruktur tanpa API key.
- Starter Template Library.
- Multi-AI Studio: OpenAI, Anthropic Claude, dan Google Gemini melalui API Routes.
- Prompt Generator AI, Prompt Enhancer, dan Prompt Analyzer.
- Model ID dapat disesuaikan di AI Studio.
- Copy prompt, simpan riwayat di browser, dan export Markdown.
- Navigasi responsif.
- Kerangka proyek Next.js siap deploy ke Vercel.

> Catatan: Tahap 1 dan 2 adalah fondasi dan UI/UX. Login/register, database cloud, admin panel, dan sinkronisasi riwayat lintas perangkat tidak termasuk dalam arsitektur no-database ini. Menu AI Settings menjelaskan status ini. Jangan menganggap local prompt engine sebagai model AI eksternal.

## Kebutuhan

- Node.js 20.9 atau lebih baru
- npm
- Akun GitHub dan Vercel

## Jalankan lokal

```bash
npm install
npm run dev
```

Buka `http://localhost:3000`.

## Deploy lewat GitHub dan Vercel (bisa dari HP Android)

1. Ekstrak ZIP ini di HP.
2. Buka GitHub di browser dan buat repository baru bernama `jaccksallas-ai-master-prompt-builder`.
3. Upload isi folder proyek ke repository (bukan ZIP-nya). Pastikan `package.json`, folder `app`, dan folder `components` berada di root repository.
4. Buka Vercel dan login dengan GitHub.
5. Pilih **Add New → Project**, lalu import repository tersebut.
6. Framework akan terdeteksi sebagai Next.js. Biarkan Build Command dan Output Directory menggunakan default.
7. Klik **Deploy**.
8. Setelah build sukses, buka domain `.vercel.app` yang diberikan Vercel.

Jika upload folder melalui browser HP sulit, gunakan GitHub mobile website dengan opsi Add file / Upload files. Unggah file proyek secara bertahap jika banyak file.

## Environment variables

Untuk memakai AI Studio, tambahkan minimal satu API key di Vercel → Project → Settings → Environment Variables:
- Tambahkan API key melalui Vercel → Project → Settings → Environment Variables.
- Gunakan nama seperti `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, dan `GOOGLE_AI_API_KEY`.
- Jangan beri awalan `NEXT_PUBLIC_` pada secret.
- Jangan commit file `.env` atau `.env.local` ke GitHub.

## Struktur folder

```text
jaccksallas-ai-master-prompt-builder/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── prompt-builder.tsx
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## AI Studio provider setup\n\nSet environment variables di Vercel (tambahkan hanya provider yang ingin digunakan):\n\n- `OPENAI_API_KEY` — OpenAI\n- `ANTHROPIC_API_KEY` — Anthropic Claude\n- `GOOGLE_AI_API_KEY` — Google Gemini\n\nSetelah mengubah environment variables, lakukan redeploy. AI Studio menyediakan task Generate, Enhance, dan Analyze. Model ID bisa diedit dari UI agar bisa mengikuti model yang aktif pada akun provider. Perhatikan billing dan rate limits dari provider.\n\n## Catatan pengembangan

- Prompt history V1.0 menggunakan `localStorage`, hanya tersedia di browser/perangkat yang sama.
- Tidak ada autentikasi pada versi ini.
- Validasi build final dilakukan oleh Vercel saat deployment.
- Lanjutkan ke Tahap 3 untuk API routes server-side dan multi-provider AI.
