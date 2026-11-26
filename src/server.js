import app from './app.js';
import { config } from './config/env.js';
import { pool } from './config/db.js';

const servidor = app.listen(config.puerto, '0.0.0.0', () => {
  console.log(`API (${config.entorno}) escuchando en el puerto ${config.puerto}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM recibido: cerrando conexiones...');
  servidor.close(async () => {
    await pool.end();
    process.exit(0);
  });
});