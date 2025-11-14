function formatMailingDate(date = new Date()) {
  return date.toLocaleString('es-PE', {
    timeZone: 'America/Lima',      // fuerza hora local(Perú)
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}


module.exports = { formatMailingDate };
