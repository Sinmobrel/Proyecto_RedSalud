const BoxMantenimiento = require('../models/BoxMantenimientoModel');

exports.agregarMantenimiento = async (req, res) => {
  try {
    const { boxId, motivo, fechaInicio, fechaFin } = req.body;
    const mantenimiento = new BoxMantenimiento({ boxId, motivo, fechaInicio, fechaFin });
    await mantenimiento.save();
    res.status(201).json(mantenimiento);
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar mantenimiento' });
  }
};

exports.quitarMantenimiento = async (req, res) => {
  try {
    const { boxId } = req.params;
    await BoxMantenimiento.deleteOne({ boxId });
    res.json({ message: 'Mantenimiento quitado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al quitar mantenimiento' });
  }

};