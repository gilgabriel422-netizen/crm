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
    const { nombre, empresa, email, telefono, direccion, ciudad, pais, estado, usuario_asignado_id, notas } = clienteData;
    const result = await db.query(
      `INSERT INTO clientes (nombre, empresa, email, telefono, direccion, ciudad, pais, estado, usuario_asignado_id, notas) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
      [nombre, empresa, email, telefono, direccion, ciudad, pais, estado || 'prospecto', usuario_asignado_id, notas]
    );
    return result.rows[0].id;
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
      nombre: clienteData.nombre !== undefined ? clienteData.nombre : clienteActual.nombre,
      empresa: clienteData.empresa !== undefined ? clienteData.empresa : clienteActual.empresa,
      email: clienteData.email !== undefined ? clienteData.email : clienteActual.email,
      telefono: clienteData.telefono !== undefined ? clienteData.telefono : clienteActual.telefono,
      direccion: clienteData.direccion !== undefined ? clienteData.direccion : clienteActual.direccion,
      ciudad: clienteData.ciudad !== undefined ? clienteData.ciudad : clienteActual.ciudad,
      pais: clienteData.pais !== undefined ? clienteData.pais : clienteActual.pais,
      estado: clienteData.estado !== undefined ? clienteData.estado : clienteActual.estado,
      usuario_asignado_id: clienteData.usuario_asignado_id !== undefined ? clienteData.usuario_asignado_id : clienteActual.usuario_asignado_id,
      notas: clienteData.notas !== undefined ? clienteData.notas : clienteActual.notas
    };

    const result = await db.query(
      `UPDATE clientes 
       SET nombre = $1, empresa = $2, email = $3, telefono = $4, direccion = $5, 
           ciudad = $6, pais = $7, estado = $8, usuario_asignado_id = $9, notas = $10,
           fecha_actualizacion = CURRENT_TIMESTAMP
       WHERE id = $11`,
      [datosActualizados.nombre, datosActualizados.empresa, datosActualizados.email, 
       datosActualizados.telefono, datosActualizados.direccion, datosActualizados.ciudad, 
       datosActualizados.pais, datosActualizados.estado, datosActualizados.usuario_asignado_id, 
       datosActualizados.notas, id]
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
      ORDER BY c.fecha_creacion DESC
    `, [`%${query}%`]);
    return result.rows;
  }
}

module.exports = Cliente;
