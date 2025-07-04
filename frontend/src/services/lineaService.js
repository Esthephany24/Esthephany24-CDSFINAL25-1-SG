import API_BASE_URL from './apiBase';

const LineaService = {
  // Obtener todas las líneas
  obtenerTodas: async () => {
    const res = await fetch(`${API_BASE_URL}/lineas`);
    if (!res.ok) throw new Error('Error al obtener líneas');
    return await res.json();
  },

  // Obtener una línea por ID
  obtenerPorId: async (id) => {
    const res = await fetch(`${API_BASE_URL}/lineas/${id}`);
    if (!res.ok) throw new Error('Error al obtener línea');
    return await res.json();
  },

  // Crear una nueva línea
  crear: async (lineaData) => {
    const res = await fetch(`${API_BASE_URL}/lineas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lineaData)
    });
    if (!res.ok) throw new Error('Error al crear línea');
    return await res.json();
  },

  // Actualizar una línea existente
  actualizar: async (id, lineaData) => {
    const res = await fetch(`${API_BASE_URL}/lineas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lineaData)
    });
    if (!res.ok) throw new Error('Error al actualizar línea');
    return await res.json();
  },

  // Verificar si un nombre de línea existe
  verificarNombre: async (nombre) => {
    const res = await fetch(`${API_BASE_URL}/lineas/existe-nombre/${encodeURIComponent(nombre)}`);
    if (!res.ok) throw new Error('Error al verificar nombre');
    return await res.json();
  },

  // Verificar si un ID de línea existe
  verificarId: async (id) => {
    const res = await fetch(`${API_BASE_URL}/lineas/verificar-id/${id}`);
    if (!res.ok) throw new Error('Error al verificar ID');
    return await res.json();
  }
};

export default LineaService;
