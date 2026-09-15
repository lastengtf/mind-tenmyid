# Panduan Deployment Cloudflare Pages untuk Mind TEN (Excalidraw)

Proyek ini adalah web app Excalidraw yang dapat di-deploy secara langsung ke **Cloudflare Pages** sebagai Static Site / SPA.

---

## 🚀 Langkah-langkah Deploy di Cloudflare Pages

1. **Buka Cloudflare Dashboard**:
   - Masuk ke akun Cloudflare Anda di [dash.cloudflare.com](https://dash.cloudflare.com).
   - Pilih menu **Compute (Workers & Pages)** > klik **Create application**.
   - Pilih tab **Pages** > klik **Connect to Git**.

2. **Pilih Repositori GitHub**:
   - Hubungkan akun GitHub Anda jika belum terhubung.
   - Pilih repositori: `lastengtf/mind-tenmyid`
   - Pilih branch produksi: `main`
   - Klik **Begin setup**.

3. **Konfigurasi Build Settings**:
   Sesuaikan pengaturan build seperti di bawah ini:
   - **Project name**: `mind-tenmyid` (atau sesuai keinginan Anda)
   - **Production branch**: `main`
   - **Framework preset**: `None` (atau biarkan default)
   - **Build command**:
     ```bash
     yarn build
     ```
   - **Build output directory**:
     ```bash
     excalidraw-app/build
     ```

4. **Environment Variables (Variabel Lingkungan)**:
   Tambahkan variabel lingkungan berikut pada menu **Environment variables (advanced)**:
   - `NODE_VERSION`: `20` (atau `22`)
   - `YARN_VERSION`: `1.22.22`

5. **Deploy**:
   - Klik **Save and Deploy**.
   - Tunggu hingga proses build selesai (Cloudflare akan menginstal dependensi dan mem-build static bundle).
   - Setelah sukses, Anda akan mendapatkan URL publik (*.pages.dev) dan dapat menambahkan custom domain Anda sendiri (misal `mind.ten.my.id`).

---

## ⚙️ Catatan Fitur Kolaborasi (Real-time Collaboration)
- Versi static site ini sudah lengkap dengan seluruh fitur whiteboard, export PNG/SVG, library elemen, penyimpanan lokal (IndexedDB / LocalStorage), PWA offline support, dan dark mode.
- Jika Anda ingin mengaktifkan kolaborasi live multi-user (share link whiteboard ke orang lain secara real-time), Anda dapat menghubungkan server WebSocket (seperti `excalidraw-room`) dengan menambahkan environment variable `VITE_APP_WS_SERVER_URL` saat build di Cloudflare Pages.
