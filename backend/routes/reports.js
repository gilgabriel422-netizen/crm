const express = require('express');
const router = express.Router();

// Endpoints mock para reports (reportes)
// TODO: Implementar funcionalidad completa cuando se necesite

router.get('/dashboard', (req, res) => {
  // Devolver datos vacíos por defecto con estructura completa
  res.json({
    total_clients: 0,
    total_revenue: 0,
    unpaid_clients: 0,
    new_clients_30_days: 0,
    paid_clients: 0,
    totalPayments: 0,
    collected: 0,
    pending: 0,
    collectionRate: 0,
    sales: 0,
    bookings: 0,
    requirements: 0
  });
});

router.get('/last-month-summary', (req, res) => {
  // Devolver resumen vacío
  res.json({
    totalPayments: 0,
    collected: 0,
    pending: 0,
    collectionRate: 0,
    period: req.query.period || 'this_month'
  });
});

module.exports = router;
