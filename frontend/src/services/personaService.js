import api from './api';

const PersonaService = {
  // Obtener todas las personas
  obtenerTodas: async () => {
      const response = await api.get('/personas');
      return response.data;
    }
  };
  /*
  // Obtener una persona por DNI
  obtenerPorDni: async (dni) => {
    try {
      const response = await api.get(`/personas/${dni}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Crear una nueva persona
  crear: async (personaData) => {
    try {
      const response = await api.post('/personas', personaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar una persona existente
  actualizar: async (dni, personaData) => {
    try {
      const response = await api.put(`/personas/${dni}`, personaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar una persona
  eliminar: async (dni) => {
    try {
      const response = await api.delete(`/personas/${dni}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};*/

export default PersonaService;
