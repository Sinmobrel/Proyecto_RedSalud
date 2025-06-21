const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/AdminModel');
const Usuario = require('./models/UsuarioModel');

mongoose.connect('mongodb://localhost:27017/miapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function crearUsuariosAdmins() {
  try {
    const admins = await Admin.find();
    for (const admin of admins) {
      // Verifica si ya existe un usuario para este admin
      const existe = await Usuario.findOne({ rut: admin._id });
      if (existe) {
        console.log(`Ya existe usuario para: ${admin.nombre}`);
        continue;
      }
      const hashedPassword = await bcrypt.hash('admin', 10); // Contraseña por defecto
      await Usuario.create({
        rut: admin._id,
        password: hashedPassword,
        tipo: 'admin',
        tipoRef: 'Admin'
      });
      console.log(`Usuario creado para: ${admin.nombre}`);
    }
  } catch (err) {
    console.error('Error al crear usuarios:', err.message);
  } finally {
    mongoose.disconnect();
  }
}

crearUsuariosAdmins();