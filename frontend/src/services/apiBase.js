const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://TU_DOMINIO_BACKEND/api'; // Cambia TU_DOMINIO_BACKEND por tu dominio real

export default API_BASE_URL;