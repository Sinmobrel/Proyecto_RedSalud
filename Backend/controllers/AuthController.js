const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Usuario = require('../models/UsuarioModel'); // Usa tu modelo real

// Ruta de login
router.post('/', async (req, res) => {
  const { rut, password } = req.body;

  try {
    // Busca el usuario referenciado por rut string en los modelos Admin, Coordinador, Especialista
    // Primero busca en cada modelo por rut string
    const Admin = require('../models/AdminModel');
    const Coordinador = require('../models/CoordinadorModel');
    const Especialista = require('../models/EspecialistaModel');

    let refUser = await Admin.findOne({ rut });
    let tipoRef = 'Admin';
    if (!refUser) {
      refUser = await Coordinador.findOne({ rut });
      tipoRef = 'Coordinador';
    }
    if (!refUser) {
      refUser = await Especialista.findOne({ rut });
      tipoRef = 'Especialista';
    }
    if (!refUser) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    // Busca el usuario en la colección Usuario por el _id del documento referenciado
    const usuario = await Usuario.findOne({ rut: refUser._id, tipoRef }).populate('rut');
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    // Valida la contraseña hasheada
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Devuelve tipo y datos completos del usuario referenciado
    res.status(200).json({
      mensaje: 'Login exitoso',
      usuario: {
        tipo: usuario.tipo,
        datos: usuario.rut // datos completos del admin, coordinador o especialista
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

module.exports = router;