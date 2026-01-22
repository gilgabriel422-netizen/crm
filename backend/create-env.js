const fs = require('fs');
const path = require('path');

const envContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=crm_database
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=mi_secreto_jwt_super_seguro_cambiar_en_produccion_minimo_32_caracteres
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
`;

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('⚠️  El archivo .env ya existe. No se sobrescribirá.');
  console.log('   Si deseas recrearlo, elimínalo primero.');
} else {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log('✅ Archivo .env creado exitosamente en:', envPath);
  console.log('');
  console.log('📝 IMPORTANTE: Ajusta los siguientes valores según tu configuración:');
  console.log('   - DB_PASSWORD: Tu contraseña de PostgreSQL');
  console.log('   - JWT_SECRET: Cambia por un secreto más seguro');
  console.log('   - DB_NAME: Puedes cambiar el nombre de la base de datos si lo deseas');
}
