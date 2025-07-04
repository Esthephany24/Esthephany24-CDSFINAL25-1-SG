import API_BASE_URL from './apiBase';

const CategoriaService = {
  // Obtener todas las categorías
  obtenerTodas: async () => {
    const res = await fetch(`${API_BASE_URL}/categorias`);
    if (!res.ok) throw new Error('Error al obtener categorías');
    return await res.json();
  },

  // Obtener una categoría por ID
  obtenerPorId: async (id) => {
    const res = await fetch(`${API_BASE_URL}/categorias/${id}`);
    if (!res.ok) throw new Error('Error al obtener categoría');
    return await res.json();
  },

  // Crear una nueva categoría
  crear: async (categoriaData) => {
    const res = await fetch(`${API_BASE_URL}/categorias`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoriaData)
    });
    if (!res.ok) throw new Error('Error al crear categoría');
    return await res.json();
  },

  // Actualizar una categoría existente
  actualizar: async (id, categoriaData) => {
    const res = await fetch(`${API_BASE_URL}/categorias/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoriaData)
    });
    if (!res.ok) throw new Error('Error al actualizar categoría');
    return await res.json();
  },

  // Verificar si un nombre de categoría existe
  verificarNombre: async (nombre) => {
    const res = await fetch(`${API_BASE_URL}/categorias/existe-nombre/${encodeURIComponent(nombre)}`);
    if (!res.ok) throw new Error('Error al verificar nombre');
    const data = await res.json();
    return {
      existe: data.resultado,
      mensaje: data.mensaje
    };
  },

  // Verificar si un ID de categoría existe
  verificarId: async (id) => {
    const res = await fetch(`${API_BASE_URL}/categorias/existe-id/${id}`);
    if (!res.ok) throw new Error('Error al verificar ID');
    return await res.json();
  }
};

export default CategoriaService;
