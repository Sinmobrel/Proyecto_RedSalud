const mongoose = require('mongoose');

const BoxMantenimientoSchema = new mongoose.Schema({
  boxId: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true },
  motivo: String,
  fechaInicio: Date,
  fechaFin: Date
});

module.exports = mongoose.model('BoxMantenimiento', BoxMantenimientoSchema);