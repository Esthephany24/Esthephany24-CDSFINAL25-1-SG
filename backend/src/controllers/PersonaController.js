const Persona = require('../models/Persona');

class PersonaController {
  static async ObtenerTodasLasPersonas(req, res) {
    const personas = await Persona.ObtenerTodasLasPersonas();
    res.json(personas);
  }

  static async ObtenerPersonaPorDni(req, res) {
    const persona = await Persona.ObtenerPersonaPorDni(req.params.dni);
    if (persona) res.json(persona);
    else res.status(404).json({ error: 'No encontrada' });
  }

  static async AgregarPersona(req, res) {
    try {
      await Persona.AgregarPersona(req.body);
      res.status(201).json({ message: 'Persona creada' });
    } catch (e) {
      console.error(e); // <-- Esto muestra el error real en la consola
      res.status(400).json({ error: 'Error al crear persona' });
    }
  }

  static async ActualizarPersona(req, res) {
    try {
      await Persona.ActualizarPersona(req.params.dni, req.body);
      res.json({ message: 'Persona actualizada' });
    } catch (e) {
      res.status(400).json({ error: 'Error al actualizar persona' });
    }
  }

  static async EliminarPersona(req, res) {
    try {
      await Persona.EliminarPersona(req.params.dni);
      res.json({ message: 'Persona eliminada' });
    } catch (e) {
      res.status(400).json({ error: 'Error al eliminar persona' });
    }
  }
}

module.exports = PersonaController;