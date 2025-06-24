const Cliente = require('../models/Cliente');

class ClienteController {
  static async ObtenerTodosLosClientes(req, res) {
    const clientes = await Cliente.ObtenerTodosLosClientes();
    res.json(clientes);
  }

  static async ObtenerClientePorDni(req, res) {
    const cliente = await Cliente.ObtenerClientePorDni(req.params.dni);
    if (cliente) res.json(cliente);
    else res.status(404).json({ error: 'No encontrado' });
  }

  static async AgregarCliente(req, res) {
    try {
      await Cliente.AgregarCliente(req.body);
      res.status(201).json({ message: 'Cliente creado' });
    } catch (e) {
      res.status(400).json({ error: 'Error al crear cliente' });
    }
  }

  static async ActualizarCliente(req, res) {
    try {
      await Cliente.ActualizarCliente(req.params.dni, req.body);
      res.json({ message: 'Cliente actualizado' });
    } catch (e) {
      res.status(400).json({ error: 'Error al actualizar cliente' });
    }
  }

  static async EliminarCliente(req, res) {
    try {
      console.log('Eliminando cliente con dni:', req.params.dni);
      await Cliente.EliminarCliente(req.params.dni);
      res.json({ message: 'Cliente eliminado' });
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: 'Error al eliminar cliente', detalle: e.message });
    }
  }
}

module.exports = ClienteController;