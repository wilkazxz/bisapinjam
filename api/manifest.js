/* /manifest.json (lewat rewrite di vercel.json): manifest PWA yang ikonnya mengikuti pilihan admin. */
const crypto = require('crypto');
const getSettings = require('./_settings');
module.exports = async (req, res) => {
  const s = await getSettings();
  let icons = [
    { src: 'icon.jpg', sizes: '192x192', type: 'image/jpeg', purpose: 'any' },
    { src: 'icon.jpg', sizes: '512x512', type: 'image/jpeg', purpose: 'any' }
  ];
  if (s.icon) {
    const v = crypto.createHash('md5').update(s.icon + (s.iconM || '')).digest('hex').slice(0, 8);
    const a = '/api/icon?k=a&v=' + v;
    icons = [
      { src: a, sizes: '192x192', type: 'image/jpeg', purpose: 'any' },
      { src: a, sizes: '512x512', type: 'image/jpeg', purpose: 'any' }
    ];
    if (s.iconM) icons.push({ src: '/api/icon?k=m&v=' + v, sizes: '512x512', type: 'image/jpeg', purpose: 'maskable' });
  }
  const m = {
    name: 'BisaPINJAM', short_name: 'BisaPINJAM', description: 'Pinjam barang dengan QR', lang: 'id',
    start_url: 'index.html', scope: './', display: 'standalone', orientation: 'portrait',
    background_color: '#1f63c9', theme_color: '#1f63c9', icons,
    shortcuts: [{ name: 'Masuk admin', short_name: 'Admin', url: 'admin.html' }]
  };
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600');
  res.status(200).send(JSON.stringify(m));
};
