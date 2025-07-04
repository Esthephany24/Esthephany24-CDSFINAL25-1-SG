import API_BASE_URL from './apiBase';

const ProductoService = {
  // Obtener todos los productos
  obtenerTodos: async () => {
    const res = await fetch(`${API_BASE_URL}/productos`);
    if (!res.ok) throw new Error('Error al obtener productos');
    return await res.json();
  },

  // Obtener productos no disponibles
  obtenerNoDisponibles: async () => {
    const res = await fetch(`${API_BASE_URL}/productos/no-disponibles`);
    if (!res.ok) throw new Error('Error al obtener productos no disponibles');
    return await res.json();
  },

  // Verificar si un nombre de producto existe
  verificarNombre: async (nombre) => {
    const res = await fetch(`${API_BASE_URL}/productos/existe-nombre/${encodeURIComponent(nombre)}`);
    if (!res.ok) throw new Error('Error al verificar nombre');
    return await res.json();
  },

  // Verificar si un ID de producto existe
  verificarId: async (id) => {
    const res = await fetch(`${API_BASE_URL}/productos/existe-id/${id}`);
    if (!res.ok) throw new Error('Error al verificar ID');
    return await res.json();
  },

  // Obtener un producto por ID
  obtenerPorId: async (id) => {
    const res = await fetch(`${API_BASE_URL}/productos/${id}`);
    if (!res.ok) throw new Error('Error al obtener producto');
    return await res.json();
  },

  // Crear un nuevo producto
  crear: async (productoData) => {
    const descripcion = productoData.descripcion === '' ? null : productoData.descripcion;
    const dataToSend = { ...productoData, descripcion, estado: 'disponible' };
    const res = await fetch(`${API_BASE_URL}/productos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    });
    if (!res.ok) throw new Error('Error al crear producto');
    return await res.json();
  },

  // Actualizar un producto existente
  actualizar: async (id, productoData) => {
    const descripcion = productoData.descripcion === '' ? null : productoData.descripcion;
    const dataToSend = { ...productoData, descripcion, estado: 'disponible' };
    const res = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend)
    });
    if (!res.ok) throw new Error('Error al actualizar producto');
    return await res.json();
  }
};

export default ProductoService;
