# Kainlab Malaysia Empire: Landing Page

Landing page statik untuk Kainlab Malaysia Empire (sublimation printing & custom apparel).
Tiada proses build: fail ini terus boleh dihoskan.

## Struktur
- `index.html`: halaman utama (SEO, JSON-LD, jadual harga)
- `css/style.css`, `js/main.js`: gaya dan fungsi (kalkulator, tab harga, lightbox)
- `js/config.js`: tetapan popup aktiviti dan bar promo (isi data SEBENAR sahaja)
- `assets/`: logo, maskot, poster dan design (WebP)
- `robots.txt`, `sitemap.xml`: SEO

## Alamat laman
URL SEO (canonical, Open Graph, sitemap, robots, schema) menggunakan `https://donkeladi.github.io/kainlab-landing/`.
Apabila domain tetap digunakan, gantikan alamat ini dalam `index.html`, `sitemap.xml` dan `robots.txt`.

## Jalankan setempat
```
python3 -m http.server 8000
```
Buka http://localhost:8000. Tambah `#demo` pada URL untuk pratonton popup dan bar promo (data contoh).

## Hosting percuma
GitHub Pages: Settings → Pages → Deploy from a branch → `main` / root.
Alternatif: Netlify atau Cloudflare Pages (sambung repo ini, tiada arahan build, publish directory `/`).
