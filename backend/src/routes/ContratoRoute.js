const express = require('express');
const ContratoController = require('../controllers/ContratoController');
const router = express.Router();

router.get('/', ContratoController.obtenerTodos);
router.get('/:cod_contrato', ContratoController.obtenerPorId);
router.post('/', ContratoController.crear);
router.put('/:cod_contrato', ContratoController.actualizar);
router.delete('/:cod_contrato', ContratoController.eliminar);


module.exports = router;