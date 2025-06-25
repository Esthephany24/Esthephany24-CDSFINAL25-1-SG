const ContratoModel = require('../models/ContratoModel');

const ContratoController = {
  async obtenerTodos(req, res) {
    try {
      const contratos = await ContratoModel.obtenerTodosConNombre();
      res.json(contratos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async obtenerPorId(req, res) {
    try {
      const contrato = await ContratoModel.obtenerPorId(req.params.cod_contrato);
      if (!contrato) return res.status(404).json({ error: 'Contrato no encontrado' });
      res.json(contrato);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async crear(req, res) {
    try {
      const result = await ContratoModel.crear(req.body);
      res.status(201).json({ cod_contrato: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async actualizar(req, res) {
    try {
      await ContratoModel.actualizar(req.params.cod_contrato, req.body);
      res.json({ message: 'Contrato actualizado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async eliminar(req, res) {
    try {
      await ContratoModel.eliminar(req.params.cod_contrato);
      res.json({ message: 'Contrato eliminado' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = ContratoController;