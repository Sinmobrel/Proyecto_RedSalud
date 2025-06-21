const express = require('express');
const router = express.Router();
const especialidadController = require('../controllers/EspecialidadController');
const Especialidad = require('../models/EspecialidadModel');

router.get('/', especialidadController.getAllEspecialidades);

router.get('/:id', async (req, res) => {
    try {
        const especialidad = await Especialidad.findById(req.params.id);
        if (!especialidad) {
            return res.status(404).json({ mensaje: 'Especialidad no encontrada' });
        }
        res.json(especialidad);
    } catch (err) {
        //console.error(err);
        res.status(500).json({ mensaje: 'Error del servidor' });
    }
});

module.exports = router;