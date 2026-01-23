import axios from 'axios';

// Configuración base de la API
// Vite requiere que las variables de entorno comiencen con VITE_
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Modo sin backend: usa respuestas simuladas en el frontend
// Para desactivarlo, define VITE_OFFLINE_MODE=false
const OFFLINE_MODE = (import.meta.env.VITE_OFFLINE_MODE ?? 'true') === 'true';

const base64UrlEncode = (obj) => {
  try {
    return btoa(JSON.stringify(obj))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  } catch (error) {
    return '';
  }
};

const createMockToken = (user) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
  const payload = {
    id: user?.id || 1,
    email: user?.email || 'admin',
    rol: user?.rol || 'admin',
    exp
  };
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.offline`;
};

const getOfflineUser = () => {
  try {
    const stored = localStorage.getItem('user');
    if (stored) return JSON.parse(stored);
  } catch (error) {
    // ignore parse errors
  }
  return { id: 1, nombre: 'Administrador', email: 'admin', rol: 'admin' };
};

const getOfflineResponse = (config) => {
  const method = (config.method || 'get').toLowerCase();
  const url = (config.url || '').split('?')[0];
  let data = config.data;
  try {
    if (typeof data === 'string') data = JSON.parse(data);
  } catch (error) {
    // ignore parse errors
  }

  // Auth
  if (url === '/usuarios/login' && method === 'post') {
    const email = (data?.email || '').toString().trim().toLowerCase();
    const password = (data?.password || '').toString();
    if ((email === 'admin' || email === 'admin@crm.com') && password === 'innovetion') {
      const usuario = { id: 1, nombre: 'Administrador', email: data.email, rol: 'admin' };
      return { status: 200, data: { token: createMockToken(usuario), usuario } };
    }
    if (email === 'cliente' && password === 'innovetion') {
      const usuario = { id: 2, nombre: 'Cliente', email: data.email, rol: 'cliente' };
      return { status: 200, data: { token: createMockToken(usuario), usuario } };
    }
    return { status: 401, data: { error: 'Credenciales inválidas' } };
  }

  if (url === '/usuarios/me' && method === 'get') {
    return { status: 200, data: getOfflineUser() };
  }

  // Clientes
  if (url === '/clientes' && method === 'get') {
    return { status: 200, data: { clients: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } } };
  }
  if (url.startsWith('/clientes/search') && method === 'get') {
    return { status: 200, data: { clients: [] } };
  }
  if (url.startsWith('/clientes/') && method === 'get') {
    return { status: 200, data: {} };
  }
  if (url === '/clientes' && method === 'post') {
    return { status: 200, data: { success: true } };
  }
  if (url.startsWith('/clientes/') && (method === 'put' || method === 'delete')) {
    return { status: 200, data: { success: true } };
  }
  if (url === '/clientes/stats/overview' && method === 'get') {
    return {
      status: 200,
      data: {
        stats: {
          total_clients: 0,
          total_revenue: 0,
          unpaid_clients: 0,
          new_clients_30_days: 0,
          paid_clients: 0
        }
      }
    };
  }

  // Reservas
  if (url === '/bookings' && method === 'get') {
    return { status: 200, data: { bookings: [] } };
  }
  if (url.startsWith('/bookings/') && method === 'get') {
    return { status: 200, data: {} };
  }
  if (url === '/bookings' && method === 'post') {
    return { status: 200, data: { success: true } };
  }
  if (url.startsWith('/bookings/') && (method === 'put' || method === 'patch' || method === 'delete')) {
    return { status: 200, data: { success: true } };
  }
  if (url === '/bookings/stats/overview' && method === 'get') {
    return { status: 200, data: { stats: {} } };
  }
  if (url.startsWith('/bookings/validate-contract/') && method === 'get') {
    return { status: 200, data: { valid: false } };
  }
  if (url.startsWith('/bookings/search-contracts/') && method === 'get') {
    return { status: 200, data: { contracts: [] } };
  }
  if (url.startsWith('/bookings/client/') && method === 'get') {
    return { status: 200, data: { bookings: [] } };
  }

  // Requerimientos
  if (url === '/reports/requirements' && method === 'get') {
    return { status: 200, data: { requirements: [] } };
  }
  if (url.startsWith('/reports/requirements/') && method === 'get') {
    return { status: 200, data: {} };
  }
  if (url === '/reports/requirements' && method === 'post') {
    return { status: 200, data: { success: true } };
  }
  if (url.startsWith('/reports/requirements/') && (method === 'patch' || method === 'delete')) {
    return { status: 200, data: { success: true } };
  }
  if (url === '/requirements/stats/overview' && method === 'get') {
    return { status: 200, data: { stats: {} } };
  }
  if (url.startsWith('/requirements/search-contract/') && method === 'get') {
    return { status: 200, data: { clients: [] } };
  }
  if (url.startsWith('/requirements/client/') && method === 'get') {
    return { status: 200, data: { requirements: [] } };
  }

  // Pagos y convenios
  if (url === '/payments' && method === 'get') {
    return { status: 200, data: { payments: [] } };
  }
  if (url.startsWith('/payments/') && method === 'get') {
    return { status: 200, data: {} };
  }
  if (url === '/payments' && method === 'post') {
    return { status: 200, data: { success: true } };
  }
  if (url.startsWith('/payments/') && (method === 'delete' || method === 'patch')) {
    return { status: 200, data: { success: true } };
  }
  if (url === '/payments/stats/overview' && method === 'get') {
    return { status: 200, data: { stats: {} } };
  }
  if (url.startsWith('/payments/client/') && method === 'get') {
    return { status: 200, data: { payments: [] } };
  }

  if (url === '/payment-agreements' && method === 'get') {
    return { status: 200, data: { agreements: [] } };
  }
  if (url.startsWith('/payment-agreements/') && method === 'get') {
    return { status: 200, data: {} };
  }
  if (url === '/payment-agreements' && method === 'post') {
    return { status: 200, data: { success: true } };
  }
  if (url.startsWith('/payment-agreements/') && (method === 'patch' || method === 'delete')) {
    return { status: 200, data: { success: true } };
  }
  if (url === '/payment-agreements/stats/overview' && method === 'get') {
    return { status: 200, data: { stats: {} } };
  }
  if (url.startsWith('/payment-agreements/client/') && method === 'get') {
    return { status: 200, data: { agreements: [] } };
  }

  // Gestión de clientes
  if (url === '/client-managements' && method === 'get') {
    return { status: 200, data: { managements: [] } };
  }
  if (url.startsWith('/client-managements/') && method === 'get') {
    return { status: 200, data: {} };
  }
  if (url === '/client-managements' && method === 'post') {
    return { status: 200, data: { success: true } };
  }
  if (url.startsWith('/client-managements/') && (method === 'patch' || method === 'delete')) {
    return { status: 200, data: { success: true } };
  }
  if (url.startsWith('/client-managements/client/') && method === 'get') {
    return { status: 200, data: { managements: [] } };
  }

  if (url.startsWith('/client-collections-comments') && method === 'get') {
    return { status: 200, data: { comments: [] } };
  }
  if (url.startsWith('/client-collections-comments') && (method === 'post' || method === 'patch' || method === 'delete')) {
    return { status: 200, data: { success: true } };
  }

  // Agendas
  if (url === '/reservation-agenda' && method === 'get') {
    return { status: 200, data: { agendas: [] } };
  }
  if (url.startsWith('/reservation-agenda/') && method === 'get') {
    return { status: 200, data: {} };
  }
  if (url.startsWith('/reservation-agenda') && (method === 'post' || method === 'put' || method === 'delete')) {
    return { status: 200, data: { success: true } };
  }
  if (url === '/visa-agenda' && method === 'get') {
    return { status: 200, data: { agendas: [] } };
  }
  if (url.startsWith('/visa-agenda/') && method === 'get') {
    return { status: 200, data: {} };
  }
  if (url.startsWith('/visa-agenda') && (method === 'post' || method === 'put' || method === 'delete')) {
    return { status: 200, data: { success: true } };
  }
  if (url === '/flight-agenda' && method === 'get') {
    return { status: 200, data: { agendas: [] } };
  }
  if (url.startsWith('/flight-agenda/') && method === 'get') {
    return { status: 200, data: {} };
  }
  if (url.startsWith('/flight-agenda') && (method === 'post' || method === 'put' || method === 'delete')) {
    return { status: 200, data: { success: true } };
  }

  // Usuarios
  if (url === '/users' && method === 'get') {
    return { status: 200, data: { users: [] } };
  }
  if (url.startsWith('/users/') && method === 'get') {
    return { status: 200, data: {} };
  }
  if (url.startsWith('/users') && (method === 'post' || method === 'put' || method === 'patch')) {
    return { status: 200, data: { success: true } };
  }
  if (url === '/users/stats/overview' && method === 'get') {
    return { status: 200, data: { stats: {} } };
  }

  // Documentos
  if (url.startsWith('/documents/') && method === 'get') {
    return { status: 200, data: new Blob() };
  }
  if (url.startsWith('/documents/') && method === 'post') {
    return { status: 200, data: { success: true } };
  }

  // Reportes
  if (url.startsWith('/reports/dashboard') && method === 'get') {
    return {
      status: 200,
      data: {
        period: 'month',
        dateRange: {
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString()
        },
        metrics: {
          total_clientes: '0',
          total_reservas: '0',
          total_requerimientos: '0',
          total_cobranzas: '0',
          total_ventas: '0',
          total_reservas_monto: null,
          reservas_activas: '0',
          reservas_canceladas: '0'
        },
        trends: []
      }
    };
  }
  if (url.startsWith('/reports/last-month-summary') && method === 'get') {
    return {
      status: 200,
      data: {
        sales: { total_ventas: 0, total_monto: 0, ventas_pagadas: 0, monto_pagado: 0 },
        collections: { total_cobranzas: 0, total_monto: 0, cobranzas_pagadas: 0, monto_pagado: 0 },
        requirements: { total_requerimientos: 0, completados: 0, pendientes: 0 },
        bookings: { total_reservas: 0, total_monto: 0, confirmadas: 0, canceladas: 0 }
      }
    };
  }
  if (url.startsWith('/reports/employee-dashboard') && method === 'get') {
    return {
      status: 200,
      data: {
        periodSummary: {
          sales: { total_ventas: 0, total_monto: 0, ventas_pagadas: 0, monto_pagado: 0 },
          bookings: { total_reservas: 0, total_monto: 0, confirmadas: 0, canceladas: 0 },
          requirements: { total_requerimientos: 0, completados: 0, pendientes: 0 }
        }
      }
    };
  }
  if (url.startsWith('/reports/cobranzas-dashboard') && method === 'get') {
    return { status: 200, data: { data: {} } };
  }
  if (url.startsWith('/reports/collections-history') && method === 'get') {
    return { status: 200, data: { history: [] } };
  }
  if (url.startsWith('/reports/collections-detailed') && method === 'get') {
    return { status: 200, data: { collections: [] } };
  }
  if (url.startsWith('/reports/collections-full-report') && method === 'get') {
    return { status: 200, data: { collections: [] } };
  }
  if (url.startsWith('/reports/') && method === 'get') {
    return { status: 200, data: { data: [] } };
  }

  // Auditoría
  if (url.startsWith('/audit-logs') && method === 'get') {
    return { status: 200, data: { logs: [], stats: {} } };
  }
  if (url.startsWith('/audit-logs') && method === 'post') {
    return { status: 200, data: { success: true } };
  }

  return { status: 200, data: {} };
};

// Debug: Verificar la URL de la API
console.log('🔍 API Base URL:', API_BASE_URL);
console.log('🔍 VITE_API_URL env:', import.meta.env.VITE_API_URL);

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (OFFLINE_MODE) {
  console.log('🧩 Modo sin backend activo: usando respuestas simuladas');
  api.defaults.adapter = async (config) => {
    const result = getOfflineResponse(config);
    const response = {
      data: result.data,
      status: result.status,
      statusText: result.status === 200 ? 'OK' : 'ERROR',
      headers: {},
      config
    };
    if (result.status >= 200 && result.status < 300) {
      return response;
    }
    const error = new Error('Request failed');
    error.config = config;
    error.response = response;
    throw error;
  };
}

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      const errorData = error.response?.data;
      
      // Check if token is expired
      if (errorData?.code === 'TOKEN_EXPIRED') {
        console.log('🔐 Token expirado detectado:', errorData.message);
        
        // Clear token and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Show user-friendly message
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        
        // Redirect to login page
        window.location.href = '/';
        return Promise.reject(error);
      }
      
      // Check if token is invalid
      if (errorData?.code === 'INVALID_TOKEN') {
        console.log('🔐 Token inválido detectado:', errorData.message);
        
        // Clear token and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Show user-friendly message
        alert('Token de autenticación inválido. Por favor, inicia sesión nuevamente.');
        
        // Redirect to login page
        window.location.href = '/';
        return Promise.reject(error);
      }
      
      // Other authentication errors
      console.log('🔐 Error de autenticación detectado:', error.response?.status, errorData);
    }
    return Promise.reject(error);
  }
);

// Función para verificar si el token está próximo a expirar o ya expiró
// Retorna: 'expired' | 'warning' | 'valid' | null (si no hay token)
export const checkTokenExpiration = (showAlerts = false) => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  try {
    // Decodificar el token JWT (sin verificar la firma)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;
    
    // Si el token ya expiró
    if (timeUntilExpiry <= 0) {
      if (showAlerts) {
        alert('Tu sesión ha expirado. Serás redirigido al login.');
      }
      return 'expired';
    }
    
    // Si el token expira en menos de 5 minutos, mostrar advertencia (solo si showAlerts es true)
    if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
      if (showAlerts) {
        const minutesLeft = Math.floor(timeUntilExpiry / 60);
        const secondsLeft = timeUntilExpiry % 60;
        alert(`⚠️ Tu sesión expirará en ${minutesLeft} minutos y ${secondsLeft} segundos.\n\nPor favor, guarda tu trabajo y prepárate para iniciar sesión nuevamente.`);
      }
      return 'warning';
    }
    
    return 'valid';
  } catch (error) {
    console.error('Error verificando expiración del token:', error);
    return null;
  }
};

// Función para obtener el tiempo restante del token
export const getTokenTimeRemaining = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = payload.exp - currentTime;
    
    if (timeUntilExpiry <= 0) return 0;
    
    return timeUntilExpiry;
  } catch (error) {
    console.error('Error obteniendo tiempo restante del token:', error);
    return null;
  }
};

// Servicios de autenticación (adaptado para backend CRM)
export const authService = {
  login: async (email, password) => {
    console.log('🔍 Intentando login con:', { email, baseURL: api.defaults.baseURL });
    console.log('🔍 URL completa será:', `${api.defaults.baseURL}/usuarios/login`);
    try {
      const response = await api.post('/usuarios/login', { email, password });
      console.log('✅ Login exitoso:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      console.error('❌ URL intentada:', error.config?.url);
      console.error('❌ Base URL:', error.config?.baseURL);
      throw error;
    }
  },

  logout: async () => {
    // El backend CRM no tiene endpoint de logout, solo limpiamos el token localmente
    return { success: true };
  },

  getProfile: async () => {
    const response = await api.get('/usuarios/me');
    return response.data;
  },

  verifyToken: async () => {
    // Verificamos el token obteniendo el perfil
    // El backend CRM devuelve directamente el usuario, no un objeto {valid, user}
    try {
      const response = await api.get('/usuarios/me');
      return { valid: true, user: response.data };
    } catch (error) {
      return { valid: false, user: null };
    }
  },
};

// Servicios de clientes (adaptado para backend CRM)
export const clientService = {
  getClients: async (params = {}) => {
    // El backend CRM tiene búsqueda con query parameter 'q'
    if (params.search) {
      const response = await api.get(`/clientes/search?q=${params.search}`);
      return response.data;
    }
    const response = await api.get('/clientes', { params });
    return response.data;
  },

  getClient: async (id) => {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  createClient: async (clientData) => {
    const response = await api.post('/clientes', clientData);
    return response.data;
  },

  updateClient: async (id, clientData) => {
    const response = await api.put(`/clientes/${id}`, clientData);
    return response.data;
  },

  deleteClient: async (id) => {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  },

  getClientStats: async () => {
    // El backend CRM no tiene este endpoint, retornamos datos básicos con estructura esperada
    try {
      const clients = await api.get('/clientes');
      const clientsList = Array.isArray(clients.data) ? clients.data : [];
      return {
        stats: {
          total_clients: clientsList.length || 0,
          total_revenue: 0,
          unpaid_clients: 0,
          new_clients_30_days: 0,
          paid_clients: 0
        }
      };
    } catch (error) {
      // Si falla, devolver estructura vacía
      return {
        stats: {
          total_clients: 0,
          total_revenue: 0,
          unpaid_clients: 0,
          new_clients_30_days: 0,
          paid_clients: 0
        }
      };
    }
  },
};

// Servicios de reservas
export const bookingService = {
  getBookings: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  getBooking: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  updateBookingStatus: async (id, statusData) => {
    const response = await api.patch(`/bookings/${id}/status`, statusData);
    return response.data;
  },

  getBookingEditInfo: async (id) => {
    const response = await api.get(`/bookings/${id}/edit-info`);
    return response.data;
  },

  updateBooking: async (id, bookingData) => {
    const response = await api.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  deleteBooking: async (id, data) => {
    const response = await api.delete(`/bookings/${id}`, { data });
    return response.data;
  },

  getBookingStats: async () => {
    const response = await api.get('/bookings/stats/overview');
    return response.data;
  },

  getClientBookings: async (clientId, params = {}) => {
    const response = await api.get(`/bookings/client/${clientId}`, { params });
    return response.data;
  },

  validateContract: async (contractNumber) => {
    const response = await api.get(`/bookings/validate-contract/${contractNumber}`);
    return response.data;
  },

  searchContracts: async (lastDigits) => {
    const response = await api.get(`/bookings/search-contracts/${lastDigits}`);
    return response.data;
  },
};

// Servicios de requerimientos
export const requirementService = {
  getRequirements: async (params = {}) => {
    const response = await api.get('/reports/requirements', { params });
    return response.data;
  },

  getRequirement: async (id) => {
    const response = await api.get(`/reports/requirements/${id}`);
    return response.data;
  },

  createRequirement: async (requirementData) => {
    const response = await api.post('/reports/requirements', requirementData);
    return response.data;
  },

  updateRequirementStatus: async (id, statusData) => {
    const response = await api.patch(`/reports/requirements/${id}/status`, statusData);
    return response.data;
  },

  deleteRequirement: async (id) => {
    const response = await api.delete(`/reports/requirements/${id}`);
    return response.data;
  },

  getRequirementStats: async () => {
    const response = await api.get('/requirements/stats/overview');
    return response.data;
  },

  searchContract: async (contractNumber) => {
    const response = await api.get(`/requirements/search-contract/${contractNumber}`);
    return response.data;
  },

  getRequirementsByClient: async (clientId) => {
    const response = await api.get(`/requirements/client/${clientId}`);
    return response.data;
  },
};

// Servicios de pagos
export const paymentService = {
  getPayments: async (params = {}) => {
    const response = await api.get('/payments', { params });
    return response.data;
  },

  getPayment: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  getPaymentsByClient: async (clientId) => {
    const response = await api.get(`/payments/client/${clientId}`);
    return response.data;
  },

  deletePayment: async (id, data) => {
    const response = await api.delete(`/payments/${id}`, { data });
    return response.data;
  },

  getPaymentStats: async () => {
    const response = await api.get('/payments/stats/overview');
    return response.data;
  },
};

// Servicios de convenios de pago
export const paymentAgreementService = {
  getPaymentAgreements: async (params = {}) => {
    const response = await api.get('/payment-agreements', { params });
    return response.data;
  },

  getPaymentAgreement: async (id) => {
    const response = await api.get(`/payment-agreements/${id}`);
    return response.data;
  },

  createPaymentAgreement: async (agreementData) => {
    const response = await api.post('/payment-agreements', agreementData);
    return response.data;
  },

  updatePaymentAgreementStatus: async (id, statusData) => {
    const response = await api.patch(`/payment-agreements/${id}/status`, statusData);
    return response.data;
  },

  updatePaymentAgreementDueDate: async (id, data) => {
    const response = await api.patch(`/payment-agreements/${id}/due-date`, data);
    return response.data;
  },

  getPaymentAgreementsByClient: async (clientId) => {
    const response = await api.get(`/payment-agreements/client/${clientId}`);
    return response.data;
  },

  deletePaymentAgreement: async (id, data) => {
    const response = await api.delete(`/payment-agreements/${id}`, { data });
    return response.data;
  },

  deleteAllPaymentAgreements: async (data) => {
    const response = await api.delete('/payment-agreements', { data });
    return response.data;
  },

  getPaymentAgreementStats: async () => {
    const response = await api.get('/payment-agreements/stats/overview');
    return response.data;
  },
};

// Servicios de gestiones de clientes
export const clientManagementService = {
  getClientManagements: async (params = {}) => {
    const response = await api.get('/client-managements', { params });
    return response.data;
  },

  getClientManagement: async (id) => {
    const response = await api.get(`/client-managements/${id}`);
    return response.data;
  },

  getClientManagementsByClient: async (clientId) => {
    const response = await api.get(`/client-managements/client/${clientId}`);
    return response.data;
  },

  createClientManagement: async (data) => {
    const response = await api.post('/client-managements', data);
    return response.data;
  },

  updateClientManagement: async (id, data) => {
    const response = await api.patch(`/client-managements/${id}`, data);
    return response.data;
  },

  deleteClientManagement: async (id) => {
    const response = await api.delete(`/client-managements/${id}`);
    return response.data;
  },
};

export const clientCollectionsCommentsService = {
  getClientComments: async (clientId) => {
    const response = await api.get(`/client-collections-comments/client/${clientId}`);
    return response.data;
  },

  createClientComment: async (data) => {
    const response = await api.post('/client-collections-comments', data);
    return response.data;
  },

  updateClientComment: async (id, data) => {
    const response = await api.patch(`/client-collections-comments/${id}`, data);
    return response.data;
  },

  deleteClientComment: async (id) => {
    const response = await api.delete(`/client-collections-comments/${id}`);
    return response.data;
  },
};

// Servicios de agenda de reservas
export const reservationAgendaService = {
  getReservationAgendas: async (params = {}) => {
    const response = await api.get('/reservation-agenda', { params });
    return response.data;
  },

  getReservationAgenda: async (id) => {
    const response = await api.get(`/reservation-agenda/${id}`);
    return response.data;
  },

  createReservationAgenda: async (data) => {
    const response = await api.post('/reservation-agenda', data);
    return response.data;
  },

  updateReservationAgenda: async (id, data) => {
    const response = await api.put(`/reservation-agenda/${id}`, data);
    return response.data;
  },

  deleteReservationAgenda: async (id) => {
    const response = await api.delete(`/reservation-agenda/${id}`);
    return response.data;
  },
};

// Servicios de agenda de visados
export const visaAgendaService = {
  getVisaAgendas: async (params = {}) => {
    const response = await api.get('/visa-agenda', { params });
    return response.data;
  },

  getVisaAgenda: async (id) => {
    const response = await api.get(`/visa-agenda/${id}`);
    return response.data;
  },

  createVisaAgenda: async (data) => {
    const response = await api.post('/visa-agenda', data);
    return response.data;
  },

  updateVisaAgenda: async (id, data) => {
    const response = await api.put(`/visa-agenda/${id}`, data);
    return response.data;
  },

  deleteVisaAgenda: async (id) => {
    const response = await api.delete(`/visa-agenda/${id}`);
    return response.data;
  },
};

// Servicios de agenda de vuelos
export const flightAgendaService = {
  getFlightAgendas: async (params = {}) => {
    const response = await api.get('/flight-agenda', { params });
    return response.data;
  },

  getFlightAgenda: async (id) => {
    const response = await api.get(`/flight-agenda/${id}`);
    return response.data;
  },

  createFlightAgenda: async (data) => {
    const response = await api.post('/flight-agenda', data);
    return response.data;
  },

  updateFlightAgenda: async (id, data) => {
    const response = await api.put(`/flight-agenda/${id}`, data);
    return response.data;
  },

  deleteFlightAgenda: async (id) => {
    const response = await api.delete(`/flight-agenda/${id}`);
    return response.data;
  },
};

// Servicios de usuarios
export const userService = {
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  changePassword: async (id, passwordData) => {
    const response = await api.patch(`/users/${id}/password`, passwordData);
    return response.data;
  },

  deactivateUser: async (id) => {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/users/stats/overview');
    return response.data;
  },
};

// Servicio de paquetes (para el frontend público)
export const packageService = {
  getPackages: async () => {
    // Por ahora retornamos datos estáticos, pero se puede conectar con la API
    return {
      packages: [
        {
          id: '1',
          name: 'Galápagos Aventura',
          description: 'Descubre las Islas Galápagos con esta aventura única de 5 días.',
          destination: 'Islas Galápagos, Ecuador',
          duration_days: 5,
          price: 1200.00,
          currency: 'USD',
          highlights: ['Fauna única', 'Aguas cristalinas', 'Guías expertos'],
          difficulty_level: 'medium',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        },
        {
          id: '2',
          name: 'Amazonía Ecuatoriana',
          description: 'Sumérgete en la selva amazónica con esta experiencia de 4 días en lodges de lujo.',
          destination: 'Amazonía, Ecuador',
          duration_days: 4,
          price: 800.00,
          currency: 'USD',
          highlights: ['Biodiversidad', 'Lodges de lujo', 'Cultura local'],
          difficulty_level: 'easy',
          image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80'
        },
        {
          id: '3',
          name: 'Quito Colonial',
          description: 'Explora la historia y arquitectura del Quito Colonial en este tour de 2 días.',
          destination: 'Quito, Ecuador',
          duration_days: 2,
          price: 300.00,
          currency: 'USD',
          highlights: ['Historia', 'Arquitectura', 'Gastronomía'],
          difficulty_level: 'easy',
          image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
        }
      ]
    };
  }
};

// Servicios de documentos
export const documentService = {
  generateReservationDocument: async (bookingId) => {
    const response = await api.post(`/documents/generate-reservation/${bookingId}`);
    return response.data;
  },

  sendWhatsAppDocument: async (bookingId) => {
    const response = await api.post(`/documents/send-whatsapp/${bookingId}`);
    return response.data;
  },

  generateAndSendDocument: async (bookingId) => {
    const response = await api.post(`/documents/generate-and-send/${bookingId}`);
    return response.data;
  },

  downloadDocument: async (fileName) => {
    const response = await api.get(`/documents/download/${fileName}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  downloadPdf: async (bookingId) => {
    const response = await api.get(`/documents/download-pdf/${bookingId}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};

// Servicios de reportes
export const reportService = {
  getSalesReport: async (period = 'month') => {
    const response = await api.get(`/reports/sales?period=${period}`);
    return response.data;
  },

  getCollectionsReport: async (period = 'month') => {
    const response = await api.get(`/reports/collections?period=${period}`);
    return response.data;
  },

  getRequirementsReport: async (period = 'month') => {
    const response = await api.get(`/reports/requirements?period=${period}`);
    return response.data;
  },

  getBookingsReport: async (period = 'month') => {
    const response = await api.get(`/reports/bookings?period=${period}`);
    return response.data;
  },

  getDashboardReport: async (period = 'month') => {
    const response = await api.get(`/reports/dashboard?period=${period}`);
    return response.data;
  }
};

export default api;
export { api };








