import API_BASE_URL from './apiBase';

const API_URL = `${API_BASE_URL}/clientes`;

const ClienteService = {
  async obtenerTodos() {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Error al obtener clientes');
    return await res.json();
  },
  async crear(cliente) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
    if (!res.ok) throw new Error('Error al crear cliente');
    return await res.json();
  },
  async actualizar(dni, cliente) {
    const res = await fetch(`${API_URL}/${dni}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cliente)
    });
    if (!res.ok) throw new Error('Error al actualizar cliente');
    return await res.json();
  },
  async eliminar(dni) {
    const res = await fetch(`${API_URL}/${dni}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Error al eliminar cliente');
    return await res.json();
  }
};

export default ClienteService;