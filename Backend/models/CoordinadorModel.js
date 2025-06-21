const mongoose = require('mongoose');

const CoordinadorSchema = new mongoose.Schema({
  rut: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true }
});

module.exports = mongoose.model('Coordinador', CoordinadorSchema);