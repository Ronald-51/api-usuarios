export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo no es un JSON válido' });
  }

  // TODO 9: cuerpo demasiado grande
  if (err.type === 'entity.too.large') {
    return res
      .status(413)
      .json({ mensaje: 'El cuerpo de la petición excede el tamaño permitido' });
  }

  // TODO 10: origen no permitido por CORS
  if (err.codigo === 'CORS') {
    return res.status(403).json({ mensaje: 'Origen no permitido' });
  }

  if (err.code === '23505') {
    return res.status(409).json({ mensaje: 'El correo ya está registrado' });
  }

  console.error(`[${req.method} ${req.originalUrl}]`, err.message);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
}