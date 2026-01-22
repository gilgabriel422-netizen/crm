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

router.get('/sales', (req, res) => {
  res.json({
    data: [],
    summary: {
      total_sales: 0,
      total_amount: 0,
      paid_sales: 0,
      period: req.query.period || 'month'
    }
  });
});

router.get('/collections', (req, res) => {
  res.json({
    data: [],
    summary: {
      total_collections: 0,
      total_amount: 0,
      collected: 0,
      pending: 0,
      period: req.query.period || 'month'
    }
  });
});

router.get('/requirements', (req, res) => {
  res.json({
    data: [],
    summary: {
      total_requirements: 0,
      completed: 0,
      pending: 0,
      period: req.query.period || 'month'
    }
  });
});

router.get('/bookings', (req, res) => {
  res.json({
    data: [],
    summary: {
      total_bookings: 0,
      confirmed: 0,
      canceled: 0,
      period: req.query.period || 'month'
    }
  });
});

router.get('/employee-dashboard', (req, res) => {
  res.json({
    data: {
      periodSummary: {
        sales: { total_ventas: 0, total_monto: 0, ventas_pagadas: 0, monto_pagado: 0 },
        bookings: { total_reservas: 0, total_monto: 0, confirmadas: 0, canceladas: 0 },
        requirements: { total_requerimientos: 0, completados: 0, pendientes: 0 }
      }
    }
  });
});

router.get('/cobranzas-dashboard', (req, res) => {
  res.json({
    data: {
      total_clients: 0,
      total_amount: 0,
      collected: 0,
      pending: 0,
      collection_rate: 0,
      period: req.query.period || 'this_month'
    }
  });
});

router.get('/collections-detailed', (req, res) => {
  res.json({
    data: [],
    summary: {
      total: 0,
      total_amount: 0
    }
  });
});

router.get('/collections-full-report', (req, res) => {
  res.json({
    data: []
  });
});

router.get('/collections-history/:clientId', (req, res) => {
  res.json({
    data: []
  });
});

module.exports = router;
