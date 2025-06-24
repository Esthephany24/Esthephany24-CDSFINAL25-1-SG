const express = require('express');
const ClienteController = require('../controllers/ClienteController');
const router = express.Router();

router.get('/', ClienteController.ObtenerTodosLosClientes);
router.get('/:dni', ClienteController.ObtenerClientePorDni);
router.post('/', ClienteController.AgregarCliente);
router.put('/:dni', ClienteController.ActualizarCliente);
router.delete('/:dni', ClienteController.EliminarCliente);

module.exports = router;