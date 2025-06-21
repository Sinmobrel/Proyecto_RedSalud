const mongoose = require('mongoose');
const Box = require('./models/BoxModel');

mongoose.connect('mongodb://localhost:27017/miapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const pisos = [
  { piso: 4, max: 8 },
  { piso: 5, max: 11 },
  { piso: 6, max: 14 },
  { piso: 7, max: 4 },
  // Piso 8 se omite porque tiene 0 boxes
  { piso: 9, max: 20 },
  { piso: 12, max: 16 },
  { piso: 13, max: 20 }
];

const boxesData = [];

for (const { piso, max } of pisos) {
  for (let numero = 1; numero <= max; numero++) {
    boxesData.push({
      piso,
      box: numero,
      especialidad: 'Sin asignar',
      estado: 'Disponible',
      fecha: 'Sin asignar'
    });
  }
}

async function populate() {
  try {
    await Box.deleteMany({});
    await Box.insertMany(boxesData);
    console.log('Boxes insertados correctamente');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error al insertar boxes:', err);
    mongoose.disconnect();
  }
}

populate();