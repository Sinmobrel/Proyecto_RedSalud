const mongoose = require('mongoose');

const EspecialidadSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String }
}, { collection: 'especialidades' });

module.exports = mongoose.model('Especialidad', EspecialidadSchema);