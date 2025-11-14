const rateLimit = require('express-rate-limit');


// ---- Rate limit (ajusta según tráfico)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 20,             // 20 req/min por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Demasiadas peticiones, intenta más tarde'
  }
});

module.exports = { limiter };