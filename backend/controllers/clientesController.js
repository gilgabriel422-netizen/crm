const Cliente = require('../models/Cliente');

// Obtener todos los clientes
exports.getAllClientes = async (req, res) => {
  try {
    console.log('📋 Solicitando lista de clientes...');
    const clientes = await Cliente.getAll();
    console.log(`✅ Se encontraron ${clientes.length} clientes`);
    
    // Enviar en el formato que espera el frontend
    res.json({
      clients: clientes,
      pagination: {
        page: 1,
        limit: clientes.length,
        total: clientes.length,
        totalPages: 1
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
};

// Obtener cliente por ID
exports.getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.getById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
};

// Crear nuevo cliente
exports.createCliente = async (req, res) => {
  try {
    console.log('📥 Datos recibidos para crear cliente:', req.body);
    
    // Mapear campos del frontend al backend (city/country → ciudad/pais)
    const clientData = {
      ...req.body,
      ciudad: req.body.city || req.body.ciudad,
      pais: req.body.country || req.body.pais
    };
    
    // Eliminar campos duplicados
    delete clientData.city;
    delete clientData.country;
    
    // Validar campos requeridos
    const { first_name, last_name, email, contract_number } = clientData;
    
    if (!first_name || !last_name) {
      return res.status(400).json({ 
        error: 'Los campos first_name y last_name son obligatorios',
        received: { first_name, last_name }
      });
    }
    
    if (!email) {
      return res.status(400).json({ 
        error: 'El campo email es obligatorio',
        received: { email }
      });
    }
    
    if (!contract_number) {
      return res.status(400).json({ 
        error: 'El campo contract_number es obligatorio',
        received: { contract_number }
      });
    }
    
    const nuevoCliente = await Cliente.create(clientData);
    console.log('✅ Cliente creado exitosamente:', nuevoCliente.id);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    console.error('❌ Error al crear cliente:', error);
    
    // Manejar errores de duplicado
    if (error.code === '23505') { // Código de error de PostgreSQL para violación de constraint unique
      if (error.constraint === 'clientes_email_key') {
        return res.status(400).json({ error: 'Ya existe un cliente con ese email' });
      }
      if (error.constraint === 'clientes_contract_number_key') {
        return res.status(400).json({ 
          error: 'Ya existe un cliente con ese número de contrato',
          detail: 'Por favor cambia el sufijo o número del contrato'
        });
      }
    }
    
    res.status(500).json({ 
      error: 'Error al crear cliente',
      details: error.message 
    });
  }
};

// Actualizar cliente
exports.updateCliente = async (req, res) => {
  try {
    const affectedRows = await Cliente.update(req.params.id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    const clienteActualizado = await Cliente.getById(req.params.id);
    res.json(clienteActualizado);
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
};

// Eliminar cliente
exports.deleteCliente = async (req, res) => {
  try {
    const affectedRows = await Cliente.delete(req.params.id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
};

// Buscar clientes
exports.searchClientes = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Se requiere parámetro de búsqueda "q"' });
    }
    const clientes = await Cliente.search(q);
    res.json(clientes);
  } catch (error) {
    console.error('Error al buscar clientes:', error);
    res.status(500).json({ error: 'Error al buscar clientes' });
  }
};
