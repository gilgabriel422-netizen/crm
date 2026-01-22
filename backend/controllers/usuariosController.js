const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.getAll();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por ID
exports.getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.getById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Crear nuevo usuario
exports.createUsuario = async (req, res) => {
  try {
    const usuarioId = await Usuario.create(req.body);
    const nuevoUsuario = await Usuario.getById(usuarioId);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

// Actualizar usuario
exports.updateUsuario = async (req, res) => {
  try {
    const affectedRows = await Usuario.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const usuarioActualizado = await Usuario.getById(req.params.id);
    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
exports.deleteUsuario = async (req, res) => {
  try {
    const affectedRows = await Usuario.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};

// Obtener perfil del usuario autenticado
exports.getMe = async (req, res) => {
  try {
    // req.user viene del middleware de autenticación
    const usuario = await Usuario.getById(req.user.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    // No enviar la contraseña
    delete usuario.password;
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    console.log('🔑 Intento de login recibido');
    console.log('📧 Email:', req.body.email);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('❌ Faltan credenciales');
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    const usuario = await Usuario.getByEmail(email);
    
    if (!usuario) {
      console.log('❌ Usuario no encontrado:', email);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('✅ Usuario encontrado:', usuario.email);
    console.log('🔐 Hash almacenado:', usuario.password);
    
    const isValid = await Usuario.validatePassword(password, usuario.password);
    
    console.log('🔍 Validación de contraseña:', isValid);
    
    if (!isValid) {
      console.log('❌ Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error al hacer login:', error);
    res.status(500).json({ error: 'Error al hacer login' });
  }
};
