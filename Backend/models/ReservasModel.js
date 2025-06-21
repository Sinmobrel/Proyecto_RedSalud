const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  box: { type: mongoose.Schema.Types.ObjectId, ref: 'Box', required: true },
  especialidad: { type: mongoose.Schema.Types.ObjectId, ref: 'Especialidad', required: true },
  especialista: { type: mongoose.Schema.Types.ObjectId, ref: 'Especialista', required: true },
  estado: { type: String, default: 'Ocupado' },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  // Puedes agregar más campos según tus necesidades, por ejemplo:
  // especialista: { type: mongoose.Schema.Types.ObjectId, ref: 'Especialista' },
  // paciente: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente' },
});

module.exports = mongoose.model('Reserva', reservaSchema);