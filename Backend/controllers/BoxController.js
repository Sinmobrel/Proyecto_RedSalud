const Box = require('../models/BoxModel');
const Reserva = require('../models/ReservasModel');
const BoxMantenimiento = require('../models/BoxMantenimientoModel');


exports.getAllBoxes = async (req, res) => {
  try {
    const { piso, especialidad, fecha, horaInicio, horaFin } = req.query;
    const query = {};
    if (piso) query.piso = Number(piso);
    if (especialidad) query.especialidad = especialidad;

    // 1. Obtén todos los boxes según el filtro
    const boxes = await Box.find(query).lean();

    // 2. Obtén los boxes en mantenimiento
    let mantenimientos = await BoxMantenimiento.find();
    const now = new Date();

    // 2.1. Elimina mantenimientos vencidos
    const vencidos = mantenimientos.filter(m => m.fechaFin && new Date(m.fechaFin) <= now);
    if (vencidos.length > 0) {
      const vencidosIds = vencidos.map(m => m._id);
      await BoxMantenimiento.deleteMany({ _id: { $in: vencidosIds } });
      // Vuelve a cargar los mantenimientos activos
      mantenimientos = await BoxMantenimiento.find();
    }

    const boxesEnMantenimiento = mantenimientos.map(m => m.boxId.toString());

    // 3. Busca reservas activas si hay filtros de fecha y hora
    let boxesOcupados = [];
    if (fecha && horaInicio && horaFin) {
      const fechaInicio = new Date(`${fecha}T${horaInicio}`);
      const fechaFin = new Date(`${fecha}T${horaFin}`);
      const reservaQuery = {
        fechaInicio: { $lt: fechaFin },
        fechaFin: { $gt: fechaInicio }
      };
      if (especialidad) reservaQuery.especialidad = especialidad;
      const reservas = await Reserva.find(reservaQuery).lean();
      boxesOcupados = reservas.map(r => r.box.toString());
    }

    // 4. Marca el estado de cada box
    const boxesConEstado = boxes.map(box => {
      const boxIdStr = box._id.toString();
      if (boxesEnMantenimiento.includes(boxIdStr)) {
        return { ...box, estado: 'Mantenimiento' };
      }
      if (boxesOcupados.includes(boxIdStr)) {
        return { ...box, estado: 'Ocupado' };
      }
      return { ...box, estado: 'Disponible' };
    });

    res.json(boxesConEstado);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener boxes' });
  }
};

exports.getBoxesOcupados = async (req, res) => {
  try {
    const { piso, especialidad, fecha } = req.query;
    const boxQuery = {};
    if (piso) boxQuery.piso = Number(piso);
    if (especialidad) boxQuery.especialidad = especialidad;

    // 1. Busca reservas activas en TODO el día si hay fecha
    let reservas = [];
    let boxesOcupados = [];
    if (fecha) {
      const fechaInicio = new Date(fecha + 'T00:00:00');
      const fechaFin = new Date(fecha + 'T23:59:59');
      const reservaQuery = {
        fechaInicio: { $lt: fechaFin },
        fechaFin: { $gt: fechaInicio }
      };
      if (especialidad) reservaQuery.especialidad = especialidad;
      reservas = await Reserva.find(reservaQuery)
        .populate('especialidad')
        .populate('especialista')
        .lean();
      boxesOcupados = reservas.map(r => r.box.toString());
    }

    // 2. Busca boxes en mantenimiento
    const mantenimientos = await BoxMantenimiento.find();
    const boxesEnMantenimiento = mantenimientos.map(m => m.boxId.toString());

    // 3. Busca todos los boxes filtrados
    const boxes = await Box.find(boxQuery).lean();

    // 4. Filtra solo los ocupados o en mantenimiento y agrega especialidad/especialista de la reserva
    const boxesFiltrados = boxes.filter(box =>
      boxesOcupados.includes(box._id.toString())
    ).map(box => {
      let estado = 'Disponible';
      let especialidadObj = null;
      let especialistaNombre = 'Sin asignar';
      let reservaId = null; // <-- agrega esto

      if (boxesEnMantenimiento.includes(box._id.toString())) {
        estado = 'Mantenimiento';
      } else if (boxesOcupados.includes(box._id.toString())) {
        estado = 'Ocupado';
        // Busca la reserva activa para este box
        const reserva = reservas.find(r => r.box.toString() === box._id.toString());
        if (reserva) {
          especialidadObj = reserva.especialidad || null;
          especialistaNombre = reserva.especialista?.nombre || 'Sin asignar';
          reservaId = reserva._id; // <-- agrega esto
        }
      }
      return { ...box, estado, especialidad: especialidadObj, especialista: especialistaNombre, reservaId }; // <-- agrega reservaId aquí
    });

    res.json(boxesFiltrados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener boxes ocupados' });
  }
};

exports.getBoxesMantenimiento = async (req, res) => {
  try {
    const mantenimientos = await BoxMantenimiento.find().populate('boxId');
    const resultado = mantenimientos.map(m => ({
      _id: m._id,
      piso: m.boxId.piso,
      box: m.boxId.box,
      mantenimientoFechaInicio: m.fechaInicio,
      mantenimientoFechaFin: m.fechaFin,
      motivo: m.motivo
    }));
    res.json(resultado);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener boxes en mantenimiento' });
  }
};

// Crear un nuevo box
exports.createBox = async (req, res) => {
  try {
    const { piso, box } = req.body;
    const nuevoBox = new Box({ piso, box });
    await nuevoBox.save();
    res.status(201).json(nuevoBox);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear box' });
  }
};

exports.updateBox = async (req, res) => {
  try {
    const box = await Box.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(box);
  } catch (err) {
    res.status(400).json({ error: 'Error al actualizar box' });
  }
};

// Agrega esto en BoxController.js
exports.getPisos = async (req, res) => {
  try {
    const pisos = await Box.distinct('piso');
    res.json(pisos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pisos' });
  }
};

exports.actualizarMantenimiento = async (req, res) => {
  try {
    const id = req.params.id;
    const { motivo, mantenimientoFechaInicio, mantenimientoFechaFin } = req.body;
    const update = {
      motivo,
      fechaInicio: mantenimientoFechaInicio,
      fechaFin: mantenimientoFechaFin
    };
    const mantenimiento = await BoxMantenimiento.findByIdAndUpdate(id, update, { new: true });
    if (!mantenimiento) {
      return res.status(404).json({ error: 'Mantenimiento no encontrado' });
    }
    res.json(mantenimiento);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar mantenimiento' });
  }
};

exports.eliminarMantenimiento = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await BoxMantenimiento.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ error: 'Mantenimiento no encontrado' });
    }
    res.json({ message: 'Mantenimiento eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar mantenimiento' });
  }
};