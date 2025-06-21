const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
  rut: { type: mongoose.Schema.Types.ObjectId, refPath: 'tipoRef', required: true, unique: true },
  password: { type: String, required: true },
  tipo: { type: String, enum: ['coordinador', 'especialista', 'admin'], required: true },
  tipoRef: {
    type: String,
    required: true,
    enum: ['Coordinador', 'Especialista', 'Admin']
  }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
