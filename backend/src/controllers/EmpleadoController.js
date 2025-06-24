const Empleado = require('../models/Empleado');

class EmpleadoController {
  static async ObtenerTodosLosEmpleados(req, res) {
    const empleados = await Empleado.ObtenerTodosLosEmpleados();
    res.json(empleados);
  }

  static async ObtenerEmpleadoPorId(req, res) {
    const empleado = await Empleado.ObtenerEmpleadoPorId(req.params.id);
    if (empleado) res.json(empleado);
    else res.status(404).json({ error: 'No encontrado' });
  }

  static async AgregarEmpleado(req, res) {
    try {
      await Empleado.AgregarEmpleado(req.body);
      res.status(201).json({ message: 'Empleado creado' });
    } catch (e) {
      res.status(400).json({ error: 'Error al crear empleado' });
    }
  }

  static async ActualizarEmpleado(req, res) {
    try {
      await Empleado.ActualizarEmpleado(req.params.id, req.body);
      res.json({ message: 'Empleado actualizado' });
    } catch (e) {
      res.status(400).json({ error: 'Error al actualizar empleado' });
    }
  }

  static async EliminarEmpleado(req, res) {
    try {
      await Empleado.EliminarEmpleado(req.params.id);
      res.json({ message: 'Empleado eliminado' });
    } catch (e) {
      res.status(400).json({ error: 'Error al eliminar empleado' });
    }
  }
}

module.exports = EmpleadoController;