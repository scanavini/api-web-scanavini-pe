function sanitize(s = '') {
  return String(s).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

/** Validación simple de email (útil si quieres reutilizar) */
function isEmail(s = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s));
}

/** Limita longitud para evitar payloads enormes */
function clamp(s = '', n = 1000) {
  return String(s).slice(0, n);
}

module.exports = { sanitize, isEmail, clamp };