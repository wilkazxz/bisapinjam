/* Baca settings/app (ikon aplikasi) dari Firestore lewat REST. Aturan Firestore mengizinkan baca publik. */
const URL_ = 'https://firestore.googleapis.com/v1/projects/pinjam-6eb03/databases/(default)/documents/settings/app?key=AIzaSyDY3JSSFZVHrHqAhiEbl8jAhvFwv0cOdwY';
module.exports = async function getSettings() {
  try {
    const r = await fetch(URL_);
    if (!r.ok) return {};
    const f = (await r.json()).fields || {};
    const g = k => (f[k] && f[k].stringValue) || '';
    return { icon: g('icon'), iconM: g('iconM') };
  } catch (e) { return {}; }
};
