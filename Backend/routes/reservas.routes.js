const express = require('express');
const router = express.Router();
const Box = require('../models/BoxModel');
const Reserva = require('../models/ReservasModel');
const reservasController = require('../controllers/ReservasController');

// GET /boxes?fecha=YYYY-MM-DD&horaInicio=HH:mm&horaFin=HH:mm
router.get('/', async (req, res) => {
  try {
    const { fecha, horaInicio, horaFin, piso, especialidad } = req.query;

    // Arma el rango de fechas si se provee
    let fechaInicio, fechaFin;
    if (fecha && horaInicio && horaFin) {
      fechaInicio = new Date(`${fecha}T${horaInicio}`);
      fechaFin = new Date(`${fecha}T${horaFin}`);
    } else if (fecha) {
      fechaInicio = new Date(`${fecha}T00:00:00`);
      fechaFin = new Date(`${fecha}T23:59:59`);
    }

    // Filtro base para boxes
    const boxFilter = {};
    if (piso) boxFilter.piso = Number(piso);

    const boxes = await Box.find(boxFilter).lean();

    // Si hay rango de fechas, consulta reservas en ese rango
    let reservas = [];
    if (fechaInicio && fechaFin) {
      reservas = await Reserva.find({
        fechaInicio: { $lt: fechaFin },
        fechaFin: { $gt: fechaInicio },
        ...(especialidad ? { especialidad } : {})
      }).lean();
    }

    // Marca el estado de cada box según reservas
    const boxesConEstado = boxes.map(box => {
      const reserva = reservas.find(r => r.box.toString() === box._id.toString());
      return {
        ...box,
        estado: reserva ? reserva.estado : 'Disponible',
        especialidad: reserva ? reserva.especialidad : null,
        especialista: reserva ? reserva.especialista : null,
        reservaId: reserva ? reserva._id : null
      };
    });

    res.json(boxesConEstado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', reservasController.crearReserva);
router.delete('/reservas/:id', reservasController.eliminarReserva);
router.put('/reservas/:id', reservasController.actualizarReserva);

// Nueva ruta para obtener todas las reservas reales
router.get('/all', reservasController.obtenerReservas);

module.exports = router;