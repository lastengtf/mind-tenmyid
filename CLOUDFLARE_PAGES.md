# Panduan Deployment Cloudflare untuk Mind TEN (Excalidraw)

Proyek ini telah dikonfigurasi untuk dapat di-deploy ke **Cloudflare** menggunakan sistem Cloudflare Workers Builds.

---

## ⚙️ Pengaturan Build Configuration di Cloudflare Dashboard

Sesuai dengan pengaturan di dashboard Cloudflare Anda:

| Kolom | Nilai Rekomendasi (Default Cloudflare) |
| :--- | :--- |
| **Build command** | `yarn run build` |
| **Deploy command** | `npx wrangler deploy` |
| **Root directory** | `/` |

---

## 💡 Penjelasan Masalah & Solusi:
- **Penyebab Error Sebelumnya:** Cloudflare menjalankan perintah `npx wrangler deploy` langsung di root folder repository. Karena proyek ini adalah *monorepo / workspaces*, Wrangler kebingungan mencari target aplikasi jika tidak ada file konfigurasi `wrangler.toml` di root.
- **Solusi yang Diterapkan:** Kami telah menambahkan file [wrangler.toml](file:///c:/Users/TEN/WorkSpaceTen/04.%20PEKERJAAN%20%28Create%20Value%29/02.%20NON-PROFIT/Membangun%20Digitalisasi%20dan%20Automasi/01.CODING/TEN-MY-ID/mind-ten-my-id/wrangler.toml) di root directory yang mengarahkan aset statis langsung ke `excalidraw-app/build`.
- Dengan ini, Cloudflare dapat langsung menjalankan perintah default `npx wrangler deploy` tanpa error deteksi workspace.

