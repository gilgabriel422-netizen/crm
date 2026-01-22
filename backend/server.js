const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Permitir todos los orígenes en desarrollo
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importar rutas
const clientesRoutes = require('./routes/clientes');
const contactosRoutes = require('./routes/contactos');
const actividadesRoutes = require('./routes/actividades');
const usuariosRoutes = require('./routes/usuarios');

// Importar rutas mock (para compatibilidad con frontend)
const bookingsRoutes = require('./routes/bookings');
const paymentsRoutes = require('./routes/payments');
const reportsRoutes = require('./routes/reports');
const statsRoutes = require('./routes/stats');
const auditLogsRoutes = require('./routes/audit-logs');
const reservationAgendaRoutes = require('./routes/reservation-agenda');
const visaAgendaRoutes = require('./routes/visa-agenda');
const flightAgendaRoutes = require('./routes/flight-agenda');

// Usar rutas
app.use('/api/clientes', clientesRoutes);
app.use('/api/contactos', contactosRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/usuarios', usuariosRoutes);

// Rutas mock (para evitar errores 404 en el frontend)
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/audit-logs', auditLogsRoutes);
app.use('/api/reservation-agenda', reservationAgendaRoutes);
app.use('/api/visa-agenda', visaAgendaRoutes);
app.use('/api/flight-agenda', flightAgendaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API CRM funcionando correctamente' });
});

// Servir el cliente de prueba
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-client.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Escuchar en todas las interfaces

const server = app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Accede a la API en http://localhost:${PORT}`);
  console.log(`Estado: ${server.listening ? '✅ Escuchando' : '❌ No escuchando'}`);
});

server.on('error', (error) => {
  console.error('❌ Error al iniciar el servidor:', error);
  process.exit(1);
});

server.on('listening', () => {
  const addr = server.address();
  console.log('✅ Socket abierto exitosamente');
  console.log(`   Dirección: ${addr.address}`);
  console.log(`   Puerto: ${addr.port}`);
  console.log(`   Familia: ${addr.family}`);
});
