const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Usuario {
  // Obtener todos los usuarios
  static async getAll() {
    const result = await db.query(
      'SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios ORDER BY nombre ASC'
    );
    return result.rows;
  }

  // Obtener usuario por ID
  static async getById(id) {
    const result = await db.query(
      'SELECT id, nombre, email, rol, activo, fecha_creacion FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Obtener usuario por email
  static async getByEmail(email) {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
  }

  // Crear nuevo usuario
  static async create(usuarioData) {
    const { nombre, email, password, rol } = usuarioData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id',
      [nombre, email, hashedPassword, rol || 'vendedor']
    );
    return result.rows[0].id;
  }

  // Actualizar usuario
  static async update(id, usuarioData) {
    const { nombre, email, rol, activo } = usuarioData;
    const result = await db.query(
      'UPDATE usuarios SET nombre = $1, email = $2, rol = $3, activo = $4 WHERE id = $5',
      [nombre, email, rol, activo, id]
    );
    return result.rowCount;
  }

  // Eliminar usuario
  static async delete(id) {
    const result = await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
    return result.rowCount;
  }

  // Validar password
  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = Usuario;
