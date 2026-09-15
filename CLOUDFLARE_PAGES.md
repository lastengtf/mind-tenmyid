# Panduan Deployment Cloudflare untuk Mind TEN (Excalidraw)

Proyek ini telah dikonfigurasi untuk dapat di-deploy ke **Cloudflare** menggunakan sistem Cloudflare Workers Builds.

---

## ⚙️ Pengaturan Build Configuration di Cloudflare Dashboard

Sesuai dengan tampilan pada menu **Build configuration** di dashboard Cloudflare Anda:

| Kolom | Nilai yang Harus Diisi |
| :--- | :--- |
| **Build command** | `yarn run build` |
| **Deploy command** | `npx wrangler deploy --config excalidraw-app/wrangler.toml` |
| **Version command** | `npx wrangler versions upload --config excalidraw-app/wrangler.toml` |
| **Root directory** | `/` |

---

## 💡 Penjelasan:
- Karena proyek ini adalah *monorepo workspace*, perintah `npx wrangler deploy` bawaan Cloudflare tidak tahu subfolder mana yang harus di-deploy.
- Dengan menambahkan `--config excalidraw-app/wrangler.toml`, Wrangler akan langsung mengenali konfigurasi aset web statis Excalidraw dan folder `build`-nya tanpa error deteksi workspace.
