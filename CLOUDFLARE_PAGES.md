# Panduan Deployment Cloudflare Pages untuk Mind TEN (Excalidraw)

Proyek ini adalah web app Excalidraw yang di-deploy ke **Cloudflare Pages** sebagai Static Site / SPA.

---

## 🚀 Langkah-langkah & Pengaturan Wajib di Cloudflare Dashboard

Buka **Cloudflare Dashboard** > Masuk ke project Anda > Buka menu **Settings** > **Builds & deployments** > **Build configuration**:

| Pengaturan | Nilai yang Harus Diisi | Keterangan |
| :--- | :--- | :--- |
| **Framework preset** | `None` / `Vite` | Biarkan default |
| **Build command** | `yarn build` | Mem-bundle aplikasi web |
| **Build output directory** | `excalidraw-app/build` | Lokasi folder hasil compile Vite |
| **Deploy command** | **(KOSONGKAN / HAPUS)** | ⚠️ **PENTING: Jangan isi `npx wrangler deploy`! Kosongkan kolom ini.** |

---

## ⚠️ Mengapa "Deploy command" Harus Dikosongkan?
- Jika kolom **Deploy command** terisi `npx wrangler deploy`, Cloudflare akan mencoba men-deploy proyek sebagai Cloudflare Worker backend. Karena repositori ini berbentuk *monorepo workspace*, Wrangler akan error:
  `[ERROR] The Cloudflare application detection logic has been run in the root of a workspace`.
- **Cloudflare Pages adalah hosting web statis**: Cloudflare Pages secara otomatis akan langsung mengunggah folder `excalidraw-app/build` tanpa perlu perintah deploy manual.

---

## 🔧 Environment Variables (Opsional / Disarankan)
Pada menu **Settings** > **Variables and Secrets** > **Environment variables**:
- `NODE_VERSION`: `20` (atau `22`)
- `YARN_VERSION`: `1.22.22`

---

## 🔄 Cara Menjalankan Ulang (Redeploy)
1. Hapus isi **Deploy command** lalu klik **Save**.
2. Buka tab **Deployments**.
3. Klik tombol **Retry deployment** pada deployment yang terakhir (atau klik **Manage deployment** > **Retry**).
4. Build akan selesai dan aplikasi web langsung aktif di URL `*.pages.dev`.
