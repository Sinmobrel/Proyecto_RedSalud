const Especialista = require('../models/EspecialistaModel');

const crearEspecialista = (data) => new Especialista(data).save();

const obtenerEspecialistas = () => Especialista.find();

const obtenerEspecialista = (id) => Especialista.findById(id);

const actualizarEspecialista = (id, data) => 
  Especialista.findByIdAndUpdate(id, data, { new: true });

const eliminarEspecialista = (id) => Especialista.findByIdAndDelete(id);

module.exports = {
  crearEspecialista,
  obtenerEspecialistas,
  obtenerEspecialista,
  actualizarEspecialista,
  eliminarEspecialista
};
