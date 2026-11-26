const ORDENABLES = {
  id: 'id',
  nombre: 'nombre',
  correo: 'correo',
  creado: 'creado_en',
};

export function validarConsulta(req, res, next) {
  const {
    orden = 'id',
    dir = 'asc',
    q = '',
    limite = '20',
    pagina = '1',
  } = req.query;
  const errores = [];

  // TODO 8: validaciones de query params
  if (typeof orden !== 'string' || !Object.hasOwn(ORDENABLES, orden)) {
    errores.push('orden no válido');
  }

  if (dir !== 'asc' && dir !== 'desc') {
    errores.push('dir debe ser asc o desc');
  }

  if (typeof q !== 'string' || q.length > 50) {
    errores.push('q no debe exceder 50 caracteres');
  }

  if (
    typeof limite !== 'string' ||
    !/^\d+$/.test(limite) ||
    Number(limite) < 1 ||
    Number(limite) > 100
  ) {
    errores.push('limite debe ser un entero entre 1 y 100');
  }

  if (
    typeof pagina !== 'string' ||
    !/^\d+$/.test(pagina) ||
    Number(pagina) < 1
  ) {
    errores.push('pagina debe ser un entero mayor o igual a 1');
  }

  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Parámetros no válidos', errores });
  }

  res.locals.consulta = {
    columna: ORDENABLES[orden],
    dir: dir.toUpperCase(),
    q,
    limite: Number(limite),
    pagina: Number(pagina),
  };

  next();
}