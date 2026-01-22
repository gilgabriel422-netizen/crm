const express = require('express');
const router = express.Router();

// Endpoint mock para estadísticas de clientes
// TODO: Implementar funcionalidad completa cuando se necesite

router.get('/', (req, res) => {
  // Devolver estadísticas vacías con estructura completa
  res.json({
    stats: {
      total_clients: 0,
      total_revenue: 0,
      unpaid_clients: 0,
      new_clients_30_days: 0,
      paid_clients: 0
    }
  });
});

module.exports = router;
