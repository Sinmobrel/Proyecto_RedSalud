const mongoose = require('mongoose');

const EspecialistaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  especialidad: { type: mongoose.Schema.Types.ObjectId, ref: 'Especialidad', required: true },
  rut: { type: String, required: true, unique: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true }
});

module.exports = mongoose.model('Especialista', EspecialistaSchema);
