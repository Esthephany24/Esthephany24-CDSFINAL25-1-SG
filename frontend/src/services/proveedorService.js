import API_BASE_URL from './apiBase';

const ProveedorService = {
  // Obtener todos los proveedores
  obtenerTodos: async () => {
    const res = await fetch(`${API_BASE_URL}/proveedores`);
    if (!res.ok) throw new Error('Error al obtener proveedores');
    return await res.json();
  },

  // Obtener un proveedor por RUC
  obtenerPorRUC: async (ruc) => {
    const res = await fetch(`${API_BASE_URL}/proveedores/${ruc}`);
    if (!res.ok) throw new Error('Error al obtener proveedor');
    return await res.json();
  },

  // Crear un nuevo proveedor
  crear: async (proveedorData) => {
    const res = await fetch(`${API_BASE_URL}/proveedores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proveedorData)
    });
    if (!res.ok) throw new Error('Error al crear proveedor');
    return await res.json();
  },

  // Actualizar un proveedor existente
  actualizar: async (ruc, datosActualizados) => {
    const res = await fetch(`${API_BASE_URL}/proveedores/${ruc}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosActualizados)
    });
    if (!res.ok) throw new Error('Error al actualizar proveedor');
    return await res.json();
  },

  // Verificar si existe un RUC
  verificarRUC: async (ruc) => {
    const res = await fetch(`${API_BASE_URL}/proveedores/verificar-ruc/${ruc}`);
    if (!res.ok) throw new Error('Error al verificar RUC');
    const data = await res.json();
    return data.existe;
  },

  // Verificar si existe un nombre de proveedor
  verificarNombre: async (nombre) => {
    const res = await fetch(`${API_BASE_URL}/proveedores/verificar-nombre/${encodeURIComponent(nombre)}`);
    if (!res.ok) throw new Error('Error al verificar nombre');
    const data = await res.json();
    return data.existe;
  }
};

export default ProveedorService;
