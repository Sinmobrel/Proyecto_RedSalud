// routes/boxMantenimiento.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/BoxMantenimientoController');

router.post('/', controller.agregarMantenimiento);
router.delete('/:boxId', controller.quitarMantenimiento);

module.exports = router;