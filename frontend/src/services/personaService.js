import API_BASE_URL from './apiBase';

const PersonaService = {
  // Obtener todas las personas
  obtenerTodas: async () => {
    const res = await fetch(`${API_BASE_URL}/personas`);
    if (!res.ok) throw new Error('Error al obtener personas');
    return await res.json();
  },

  // Obtener una persona por DNI
  obtenerPorDni: async (dni) => {
    const res = await fetch(`${API_BASE_URL}/personas/${dni}`);
    if (!res.ok) throw new Error('Error al obtener persona');
    return await res.json();
  },

  // Crear una nueva persona
  crear: async (personaData) => {
    const res = await fetch(`${API_BASE_URL}/personas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personaData)
    });
    if (!res.ok) throw new Error('Error al crear persona');
    return await res.json();
  },

  // Actualizar una persona existente
  actualizar: async (dni, personaData) => {
    const res = await fetch(`${API_BASE_URL}/personas/${dni}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personaData)
    });
    if (!res.ok) throw new Error('Error al actualizar persona');
    return await res.json();
  },

  // Eliminar una persona
  eliminar: async (dni) => {
    const res = await fetch(`${API_BASE_URL}/personas/${dni}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar persona');
    return await res.json();
  }
};

export default PersonaService;
