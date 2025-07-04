import axios from 'axios';
import API_BASE_URL from './apiBase'; // <--- Importa la base URL

// Crear una instancia de axios con configuración mejorada
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  withCredentials: true,
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Resuelve solo si el código de estado es menor que 500
  }
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    // Elimina el log de cada request exitosa
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un estado fuera del rango 2xx
      console.error('Error en la respuesta:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
        method: error.config.method
      });
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', {
        url: error.config.url,
        method: error.config.method,
        message: error.message
      });
    } else {
      // Algo sucedió en la configuración de la solicitud
      console.error('Error en la configuración de la solicitud:', error.message);
    }
    return Promise.reject(error);
  }
);

// Función para probar la conexión con el backend usando fetch
export const testConnection = async () => {
  try {
    console.log('Probando conexión con el backend...');
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('No se pudo conectar con el backend');
    const data = await res.json();
    console.log('Respuesta del backend:', data);
    return data;
  } catch (error) {
    console.error('Error al conectar con el backend:', error);
    throw error;
  }
};

export default api;
