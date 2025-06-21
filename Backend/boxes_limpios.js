const mongoose = require('mongoose');
const Box = require('./models/BoxModel');
const Reserva = require('./models/ReservasModel');

// Cambia la URL por la de tu base de datos
mongoose.connect('mongodb://localhost:27017/miapp', { useNewUrlParser: true, useUnifiedTopology: true });

async function migrar() {
  const boxes = await Box.find();

  for (const box of boxes) {
    // Si el box tiene especialidad y especialista asignados y no están vacíos o "Sin asignar", crea una reserva
    if (
      box.especialidad && box.especialista &&
      box.especialidad !== 'Sin asignar' && box.especialista !== 'Sin asignar'
    ) {
      const ahora = new Date();
      const unaHoraDespues = new Date(ahora.getTime() + 60 * 60 * 1000);

      await Reserva.create({
        box: box._id,
        especialidad: box.especialidad,
        especialista: box.especialista,
        fechaInicio: ahora,
        fechaFin: unaHoraDespues
      });
    }

    // Elimina completamente los campos del documento, sin importar su valor
    box.set('especialidad', undefined, { strict: false });
    box.set('especialista', undefined, { strict: false });
    box.set('estado', undefined, { strict: false });
    await box.save();
  }

  console.log('Migración completada');
  mongoose.disconnect();
}

migrar();