const { Pool } = require('pg');
require('dotenv').config();

// Crear pool de conexiones PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Manejar errores del pool
pool.on('error', (err, client) => {
  console.error('Error inesperado en el cliente PostgreSQL', err);
});

// Probar conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error conectando a PostgreSQL:', err.message);
    return;
  }
  console.log('✅ Conectado a PostgreSQL');
});

module.exports = pool;
