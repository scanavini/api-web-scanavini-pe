
const verifyRecaptcha = async (token, action) => {
  const secret = process.env.RECAPTCHA_SECRET;
  const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token })
  });

  const data = await resp.json();


  // v3: opcionalmente valida action y score
  if (!data.success) return { ok: false, reason: 'captcha-failed' };
  if (typeof data.score === 'number' && data.score < 0.3) return { ok: false, reason: 'low-score' };
  if (action && data.action && data.action !== action) return { ok: false, reason: 'wrong-action' };
  return { ok: true };
}



module.exports = { verifyRecaptcha };





