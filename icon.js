/* /api/icon?k=a (ikon biasa, juga untuk iPhone) atau k=m (maskable). Jika admin belum memilih ikon: pakai icon.jpg */
const getSettings = require('./_settings');
module.exports = async (req, res) => {
  const s = await getSettings();
  const data = (req.query.k === 'm' ? s.iconM : s.icon) || s.icon;
  const m = data && /^data:(image\/[a-z+]+);base64,(.+)$/.exec(data);
  if (!m) { res.statusCode = 302; res.setHeader('Location', '/icon.jpg'); return res.end(); }
  res.setHeader('Content-Type', m[1]);
  res.setHeader('Cache-Control', req.query.v ? 'public, max-age=31536000, immutable' : 'public, max-age=300, s-maxage=300');
  res.status(200).send(Buffer.from(m[2], 'base64'));
};
