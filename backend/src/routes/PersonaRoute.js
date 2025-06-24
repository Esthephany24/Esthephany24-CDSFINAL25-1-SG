const express = require('express');
const PersonaController = require('../controllers/PersonaController');
const router = express.Router();

router.get('/', PersonaController.ObtenerTodasLasPersonas);
router.get('/:dni', PersonaController.ObtenerPersonaPorDni);
router.post('/', PersonaController.AgregarPersona);
router.put('/:dni', PersonaController.ActualizarPersona);
router.delete('/:dni', PersonaController.EliminarPersona);

module.exports = router;