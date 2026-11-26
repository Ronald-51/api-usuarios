import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { config } from './config/env.js';
import { pool } from './config/db.js';
import usuariosRoutes from './routes/usuarios.routes.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// TODO 1: confiar en los 2 saltos de proxy de Render (Cloudflare + balanceador)
app.set('trust proxy', 2);

// TODO 2: activar helmet()
app.use(helmet());

// TODO 3: CORS con lista blanca
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || config.origenes.includes(origin)) {
        return cb(null, true);
      }
      const error = new Error('Origen no permitido');
      error.codigo = 'CORS';
      return cb(error);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    maxAge: 600,
  })
);

// TODO 4: express.json con límite de 10kb
app.use(express.json({ limit: '10kb' }));

// Salud ANTES del limitador
app.get('/api/salud', async (req, res) => {
  const { rows } = await pool.query('SELECT now() AS hora');
  res.json({ estado: 'ok', version: '1.0.1', entorno: config.entorno, hora: rows[0].hora });
});

// TODO 5: limitador general para /api
app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: config.limiteMax,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { mensaje: 'Demasiadas peticiones, intente más tarde' },
  })
);

app.use('/api/usuarios', usuariosRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;