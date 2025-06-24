const express = require('express');
const EmpleadoController = require('../controllers/EmpleadoController');
const router = express.Router();

router.get('/', EmpleadoController.ObtenerTodosLosEmpleados);
router.get('/:id', EmpleadoController.ObtenerEmpleadoPorId);
router.post('/', EmpleadoController.AgregarEmpleado);
router.put('/:id', EmpleadoController.ActualizarEmpleado);
router.delete('/:id', EmpleadoController.EliminarEmpleado);

module.exports = router;