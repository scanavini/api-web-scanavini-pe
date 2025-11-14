const { sanitize } = require('./sanitizingInputs');
const { formatMailingDate } = require('./date');

/**
 * data: { name, email, phone?, subject, message, sentAt?: Date }
 * options: { logoSrc?: string, brandName?: string }
 */
function buildContactHtml(data, options = {}) {
  const sentAtStr = formatMailingDate(data.sentAt || new Date(), 'es-CL');

  // Colores corporativos
  const c = {
    brand: '#FA4616',
    brandDark: '#CE3007',
    brandLight: '#FF8464',
    accent: '#116cf9',
    bgLight: '#f9f9f9',
    bgMuted: '#dadada',
    text: '#374151',
    bgBorder: '#d6d6d6',
  };

  const logoSrc = options.logoSrc || 'Scanavini';
  const brandName = options.brandName || 'Departamento de Informática';

  // Prepara textos sanitizados
  const name = sanitize(data.name);
  const email = sanitize(data.email);
  const phone = sanitize(data.phone || '');
  const subject = sanitize(data.subject);
  const messageHtml = sanitize(data.message).replace(/\n/g, '<br>');


  return `
  <!doctype html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <title>Nuevo mensaje de contacto</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0; padding:0; background:${c.bgLight}; color:${c.text};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${c.bgLight}; padding:24px 0;">
      <tr>
        <td align="center">
          <table 
            role="presentation" 
            width="100%" 
            cellspacing="0" 
            cellpadding="0" 
            border="0" 
            style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.06);"
          >
            <!-- Header -->
            <tr>
              <td style="padding:0;">
                <table width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="background:${c.brand}; padding:12px 20px;">
                      <img src="${logoSrc}" width="120" height="auto" alt="Logo Scanavini" style="display:block; max-width:140px; height:auto;"/>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Título -->
            <tr>
              <td style="padding:22px 24px 12px 24px;">
                <h1 style="margin:0; text-align:center; font:700 26px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial; color:${c.text};">
                  Nueva oportunidad de servicio
                </h1>
                <h2 style="margin:0 0 16px 0; text-align:center; font:500 21px/1.3 system-ui, -apple-system, Segoe UI, Roboto, Arial; color:${c.text};">
                  Tu atención es necesaria
                </h2>
                <p style="margin:0 0 12px 0;  font:400 14px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Arial; color:${c.text};">
                  Un cliente ha confiado en nosotros y ha enviado una consulta desde nuestro sitio web. Revisa los detalles a continuación y proporciona una respuesta que refleje nuestro compromiso con la excelencia en el servicio.
                </p>
              </td>
            </tr>

            <!-- Chips resumen -->
            <tr>
              <td style="padding:12px 24px 0 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:separate;">
                  <!-- Asunto -->
                  <tr>
                    <td valign="top" width="120" style="padding:4px 0; color:#374151; font:700 13px/1.4 system-ui, -apple-system, Segoe UI, Roboto;">Asunto:</td>
                    <td valign="top" style="padding:4px 0; color:#374151; font:400 13px/1.6 system-ui, -apple-system, Segoe UI, Roboto;">
                      ${subject}
                    </td>
                  </tr>

                  <!-- Cliente -->
                  <tr>
                    <td valign="top" width="120" style="padding:4px 0; color:#374151; font:700 13px/1.4 system-ui, -apple-system, Segoe UI, Roboto;">Cliente:</td>
                    <td valign="top" style="padding:4px 0; color:#374151; font:400 13px/1.6 system-ui, -apple-system, Segoe UI, Roboto;">
                      ${name}
                    </td>
                  </tr>

                  <!-- Teléfono (si viene) -->
                  ${phone ? `
                  <tr>
                    <td valign="top" width="120" style="padding:4px 0; color:#374151; font:700 13px/1.4 system-ui, -apple-system, Segoe UI, Roboto;">Teléfono:</td>
                    <td valign="top" style="padding:4px 0; color:#374151; font:400 13px/1.6 system-ui, -apple-system, Segoe UI, Roboto;">
                      <a href="tel:+56${phone}" style="color:#116cf9; text-decoration:none;">+56 ${phone}</a>
                    </td>
                  </tr>` : ''}

                  <!-- Correo -->
                  <tr>
                    <td valign="top" width="120" style="padding:4px 0; color:#374151; font:700 13px/1.4 system-ui, -apple-system, Segoe UI, Roboto;">Correo:</td>
                    <td valign="top" style="padding:4px 0; color:#374151; font:400 13px/1.6 system-ui, -apple-system, Segoe UI, Roboto;">
                      <a href="mailto:${email}?subject=${encodeURIComponent('Re: ' + subject)}" style="color:#116cf9; text-decoration:none;">
                        ${email}
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Mensaje -->
            <tr>
              <td style="padding:16px 24px 8px 24px; background:#ffffff;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                      style="border:1px solid ${c.bgBorder}; border-radius:10px; background:#ffffff;">
                  <tr>
                    <td style="padding:16px; font:400 14px/1.6 system-ui, -apple-system, Segoe UI, Roboto; color:${c.text};">
                      <p style="margin:0 0 8px 0; font-weight:600;">Mensaje del cliente:</p>
                      ${messageHtml}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding:24px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td>
                      <span style="display:inline-block; color:${c.text}; font:400 13px/1.4 system-ui, -apple-system, Segoe UI, Roboto;">
                        Sugerencia: responde en <strong style="color:${c.brand};">menos de 15 minutos</strong> cuando sea posible. Tu expertise es clave en este momento.
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:0;">
                <table width="100%" role="footer" cellspacing="0" cellpadding="0" border="0" style="background:${c.bgMuted};">
                  <tr>
                    <td style="padding:16px 24px 4px; color:${c.text}; font:400 12px/1.4 system-ui, -apple-system, Segoe UI, Roboto;">
                      Este correo fue generado automáticamente desde el sitio web corporativo. <br />
                      Por favor, no respondas a este mensaje directamente, usa el correo del cliente para contactarlo.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 24px; color:${c.text}; font:600 12px/1.4 system-ui, -apple-system, Segoe UI, Roboto;">
                      Atte. <br /> ${brandName}
                    </td>
                  </tr>
                  <!-- Meta -->
                  <tr>
                    <td style="padding:14px 24px 14px 24px; color:${c.text}; text-align:right; font:400 12px/1.5 system-ui, -apple-system, Segoe UI, Roboto;">
                      Enviado el: <strong>${sanitize(sentAtStr)}</strong>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

function buildContactText(data) {
  const sentAtStr = formatMailingDate(data.sentAt || new Date(), 'es-CL');
  return `Nuevo mensaje de contacto

Nombre: ${data.name}
Email: ${data.email}
Teléfono: ${data.phone || ''}
Motivo: ${data.subject}

Mensaje:
${data.message}

Enviado el: ${sentAtStr}
Departamento: Departamento de Informática`;
}

module.exports = { buildContactHtml, buildContactText };