const Especialidad = require('../models/EspecialidadModel');

// Obtener todas las especialidades
exports.getAllEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.find();
    res.json(especialidades);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener especialidades' });
  }
};