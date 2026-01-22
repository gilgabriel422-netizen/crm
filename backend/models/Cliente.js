const db = require('../config/database');

class Cliente {
  // Obtener todos los clientes
  static async getAll() {
    const result = await db.query(`
      SELECT c.*, u.nombre as usuario_asignado_nombre 
      FROM clientes c 
      LEFT JOIN usuarios u ON c.usuario_asignado_id = u.id
      ORDER BY c.fecha_creacion DESC
    `);
    return result.rows;
  }

  // Obtener cliente por ID
  static async getById(id) {
    const result = await db.query(`
      SELECT c.*, u.nombre as usuario_asignado_nombre 
      FROM clientes c 
      LEFT JOIN usuarios u ON c.usuario_asignado_id = u.id
      WHERE c.id = $1
    `, [id]);
    return result.rows[0];
  }

  // Crear nuevo cliente
  static async create(clienteData) {
    const { 
      // Información personal
      first_name, 
      last_name, 
      email, 
      phone,
      document_number,
      
      // Información del contrato
      contract_number, 
      fecha_registro = new Date().toISOString().split('T')[0],
      status = 'activo',
      
      // Información de paquete
      total_nights = 0,
      remaining_nights = 0,
      años = 0,
      años_indefinido = false,
      international_bonus = 'No',
      
      // Información financiera
      total_amount = 0,
      iva = 0,
      neto = 0,
      payment_status = 'sin_pago',
      
      // Información de pago
      pago_mixto = 'No',
      cantidad_tarjetas = 1,
      tarjetas = null,
      datafast,
      tipo_tarjeta,
      forma_pago,
      tiempo_meses,
      
      // Información de pagaré
      pagare = 'No',
      fecha_pagare,
      monto_pagare,
      
      // Personal de ventas
      linner,
      closer,
      
      // Información adicional
      empresa, 
      telefono, 
      direccion, 
      ciudad = 'Quito', 
      pais = 'Ecuador', 
      usuario_asignado_id, 
      notas 
    } = clienteData;
    
    const result = await db.query(
      `INSERT INTO clientes (
        first_name, last_name, email, phone, document_number, contract_number, 
        fecha_registro, status, total_nights, remaining_nights, años, años_indefinido,
        international_bonus, total_amount, iva, neto, payment_status,
        pago_mixto, cantidad_tarjetas, tarjetas, datafast, tipo_tarjeta, forma_pago, tiempo_meses,
        pagare, fecha_pagare, monto_pagare, linner, closer,
        empresa, telefono, direccion, ciudad, pais, usuario_asignado_id, notas
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36) 
      RETURNING *`,
      [
        first_name, last_name, email, phone, document_number, contract_number,
        fecha_registro, status, total_nights, remaining_nights, años, años_indefinido,
        international_bonus, total_amount, iva, neto, payment_status,
        pago_mixto, cantidad_tarjetas, tarjetas ? JSON.stringify(tarjetas) : null, datafast, tipo_tarjeta, forma_pago, tiempo_meses,
        pagare, fecha_pagare, monto_pagare, linner, closer,
        empresa, telefono, direccion, ciudad, pais, usuario_asignado_id, notas
      ]
    );
    return result.rows[0];
  }

  // Actualizar cliente
  static async update(id, clienteData) {
    // Primero obtenemos el cliente actual
    const clienteActual = await this.getById(id);
    if (!clienteActual) {
      return 0;
    }

    // Mezclamos los datos actuales con los nuevos
    const datosActualizados = {
      first_name: clienteData.first_name !== undefined ? clienteData.first_name : clienteActual.first_name,
      last_name: clienteData.last_name !== undefined ? clienteData.last_name : clienteActual.last_name,
      email: clienteData.email !== undefined ? clienteData.email : clienteActual.email,
      phone: clienteData.phone !== undefined ? clienteData.phone : clienteActual.phone,
      document_number: clienteData.document_number !== undefined ? clienteData.document_number : clienteActual.document_number,
      contract_number: clienteData.contract_number !== undefined ? clienteData.contract_number : clienteActual.contract_number,
      fecha_registro: clienteData.fecha_registro !== undefined ? clienteData.fecha_registro : clienteActual.fecha_registro,
      status: clienteData.status !== undefined ? clienteData.status : clienteActual.status,
      total_nights: clienteData.total_nights !== undefined ? clienteData.total_nights : clienteActual.total_nights,
      remaining_nights: clienteData.remaining_nights !== undefined ? clienteData.remaining_nights : clienteActual.remaining_nights,
      años: clienteData.años !== undefined ? clienteData.años : clienteActual.años,
      años_indefinido: clienteData.años_indefinido !== undefined ? clienteData.años_indefinido : clienteActual.años_indefinido,
      international_bonus: clienteData.international_bonus !== undefined ? clienteData.international_bonus : clienteActual.international_bonus,
      total_amount: clienteData.total_amount !== undefined ? clienteData.total_amount : clienteActual.total_amount,
      iva: clienteData.iva !== undefined ? clienteData.iva : clienteActual.iva,
      neto: clienteData.neto !== undefined ? clienteData.neto : clienteActual.neto,
      payment_status: clienteData.payment_status !== undefined ? clienteData.payment_status : clienteActual.payment_status,
      pago_mixto: clienteData.pago_mixto !== undefined ? clienteData.pago_mixto : clienteActual.pago_mixto,
      cantidad_tarjetas: clienteData.cantidad_tarjetas !== undefined ? clienteData.cantidad_tarjetas : clienteActual.cantidad_tarjetas,
      tarjetas: clienteData.tarjetas !== undefined ? clienteData.tarjetas : clienteActual.tarjetas,
      datafast: clienteData.datafast !== undefined ? clienteData.datafast : clienteActual.datafast,
      tipo_tarjeta: clienteData.tipo_tarjeta !== undefined ? clienteData.tipo_tarjeta : clienteActual.tipo_tarjeta,
      forma_pago: clienteData.forma_pago !== undefined ? clienteData.forma_pago : clienteActual.forma_pago,
      tiempo_meses: clienteData.tiempo_meses !== undefined ? clienteData.tiempo_meses : clienteActual.tiempo_meses,
      pagare: clienteData.pagare !== undefined ? clienteData.pagare : clienteActual.pagare,
      fecha_pagare: clienteData.fecha_pagare !== undefined ? clienteData.fecha_pagare : clienteActual.fecha_pagare,
      monto_pagare: clienteData.monto_pagare !== undefined ? clienteData.monto_pagare : clienteActual.monto_pagare,
      linner: clienteData.linner !== undefined ? clienteData.linner : clienteActual.linner,
      closer: clienteData.closer !== undefined ? clienteData.closer : clienteActual.closer,
      empresa: clienteData.empresa !== undefined ? clienteData.empresa : clienteActual.empresa,
      telefono: clienteData.telefono !== undefined ? clienteData.telefono : clienteActual.telefono,
      direccion: clienteData.direccion !== undefined ? clienteData.direccion : clienteActual.direccion,
      ciudad: clienteData.ciudad !== undefined ? clienteData.ciudad : clienteActual.ciudad,
      pais: clienteData.pais !== undefined ? clienteData.pais : clienteActual.pais,
      usuario_asignado_id: clienteData.usuario_asignado_id !== undefined ? clienteData.usuario_asignado_id : clienteActual.usuario_asignado_id,
      notas: clienteData.notas !== undefined ? clienteData.notas : clienteActual.notas
    };

    const result = await db.query(
      `UPDATE clientes 
       SET first_name = $1, last_name = $2, email = $3, phone = $4, document_number = $5,
           contract_number = $6, fecha_registro = $7, status = $8, total_nights = $9, remaining_nights = $10,
           años = $11, años_indefinido = $12, international_bonus = $13, total_amount = $14, iva = $15,
           neto = $16, payment_status = $17, pago_mixto = $18, cantidad_tarjetas = $19, tarjetas = $20,
           datafast = $21, tipo_tarjeta = $22, forma_pago = $23, tiempo_meses = $24, pagare = $25,
           fecha_pagare = $26, monto_pagare = $27, linner = $28, closer = $29, empresa = $30,
           telefono = $31, direccion = $32, ciudad = $33, pais = $34, usuario_asignado_id = $35,
           notas = $36, fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = $37`,
      [
        datosActualizados.first_name, datosActualizados.last_name, datosActualizados.email, 
        datosActualizados.phone, datosActualizados.document_number, datosActualizados.contract_number,
        datosActualizados.fecha_registro, datosActualizados.status, datosActualizados.total_nights,
        datosActualizados.remaining_nights, datosActualizados.años, datosActualizados.años_indefinido,
        datosActualizados.international_bonus, datosActualizados.total_amount, datosActualizados.iva,
        datosActualizados.neto, datosActualizados.payment_status, datosActualizados.pago_mixto,
        datosActualizados.cantidad_tarjetas, datosActualizados.tarjetas ? JSON.stringify(datosActualizados.tarjetas) : null,
        datosActualizados.datafast, datosActualizados.tipo_tarjeta, datosActualizados.forma_pago,
        datosActualizados.tiempo_meses, datosActualizados.pagare, datosActualizados.fecha_pagare,
        datosActualizados.monto_pagare, datosActualizados.linner, datosActualizados.closer,
        datosActualizados.empresa, datosActualizados.telefono, datosActualizados.direccion,
        datosActualizados.ciudad, datosActualizados.pais, datosActualizados.usuario_asignado_id,
        datosActualizados.notas, id
      ]
    );
    return result.rowCount;
  }

  // Eliminar cliente
  static async delete(id) {
    const result = await db.query('DELETE FROM clientes WHERE id = $1', [id]);
    return result.rowCount;
  }

  // Buscar clientes
  static async search(query) {
    const result = await db.query(`
      SELECT c.*, u.nombre as usuario_asignado_nombre 
      FROM clientes c 
      LEFT JOIN usuarios u ON c.usuario_asignado_id = u.id
      WHERE c.nombre ILIKE $1 OR c.email ILIKE $1 OR c.empresa ILIKE $1 
         OR c.contract_number ILIKE $1 OR c.document_number ILIKE $1
      ORDER BY c.fecha_creacion DESC
    `, [`%${query}%`]);
    return result.rows;
  }
}

module.exports = Cliente;
