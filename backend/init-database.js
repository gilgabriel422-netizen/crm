const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  let client;
  
  try {
    // Conectar a PostgreSQL (a la base de datos postgres por defecto)
    client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'postgres' // Conectar a la base postgres por defecto
    });

    await client.connect();
    console.log('✅ Conectado a PostgreSQL');

    // Verificar si la base de datos existe
    const dbExists = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );

    if (dbExists.rows.length === 0) {
      // Crear la base de datos
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`✅ Base de datos '${process.env.DB_NAME}' creada`);
    } else {
      console.log(`ℹ️  Base de datos '${process.env.DB_NAME}' ya existe`);
    }

    await client.end();

    // Conectar a la base de datos específica del CRM
    client = new Client({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    await client.connect();

    // Leer y ejecutar el schema
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    await client.query(schema);
    console.log('✅ Tablas creadas correctamente');
    console.log('');
    console.log('📝 Usuario administrador creado:');
    console.log('   Email: admin@crm.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login');

    await client.end();
    console.log('');
    console.log('🎉 ¡Inicialización completada! Puedes iniciar el servidor con: npm start');

  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    if (client) await client.end();
    process.exit(1);
  }
}

initDatabase();
