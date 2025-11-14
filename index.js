const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { limiter } = require("./middlewares/rateLimit");
const { verifyRecaptcha } = require("./helpers/verifyRecaptcha");
const { transporter } = require("./helpers/emailTransporter");
const { buildContactHtml, buildContactText } = require("./helpers/emailTemplates");
const { clamp, isEmail } = require("./helpers/sanitizingInputs");



//Configuración incial de variables de entorno y app Express
dotenv.config();
const app = express();

//Si se usa Proxy (p.ej. Vercel, Heroku, Render, Cloudflare), habilitar esta línea
// para que req.ip refleje la IP real del cliente
app.set("trust proxy", 1);

// ---- Middlewares
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));
app.use("/contact", limiter); // Aplica rate limit solo al endpoint /contact

// ---- Seguridad básica con HELMET
app.use(helmet({ contentSecurityPolicy: false })); // sirve solo JSON, ajustar si se sirve HTML

/* CORS */
app.use(
  cors({
    origin: process.env.ORIGIN_ALLOWLIST, // ajusta a tu dominio en producción
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
    maxAge: 600,
  })
);

// ---- Endpoint raíz (opcional)
app.get("/", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ---- Endpoint de contacto
app.post("/contact", async (req, res) => {
  try {
    const { name, email, phone, subject, message, token, action, hp_field } =
      req.body || {};

    // Honeypot: si viene relleno, responder OK y salir
    if (hp_field) return res.json({ ok: true });

    // Validaciones mínimas
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ ok: false, error: "Campos requeridos" });
    }
    if (!isEmail(email)) {
      return res.status(400).json({ ok: false, error: "Email inválido" });
    }
    if (!token)
      return res
        .status(400)
        .json({ ok: false, error: "Falta token reCAPTCHA" });

    // reCAPTCHA v3
    const vr = await verifyRecaptcha(token, action || "contact");
    if (!vr.ok)
      return res
        .status(400)
        .json({ ok: false, error: `reCAPTCHA: ${vr.reason}` });

    // Sanitizado/límites de longitud (server-side)
    const data = {
      name: clamp(name, 150),
      email: clamp(email, 200),
      phone: clamp(phone || "", 12),
      subject: clamp(subject, 140),
      message: clamp(message, 5000),
      sentAt: new Date(),
    };

    // Construcción de correos
    const html = buildContactHtml(
      data, 
      { 
        logoSrc: process.env.LOGO_URL, 
        brandName: 'Departamento de Informática' 
      });
    const text = buildContactText(data);

    // Envío de correo
    await transporter.sendMail({
      from: `Web Scanavini <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      replyTo: email,
      subject: `🚨 Nueva consulta del sitio web - ${data.subject}`,
      text,
      html
    });

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: "Error interno" });
  }
});

const port = Number(process.env.PORT || 8080);

app.listen(port, () => {
  console.log(`API contacto escuchando en :${port}`);
});



