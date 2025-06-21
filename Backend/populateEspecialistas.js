const mongoose = require('mongoose');
const Especialista = require('./models/EspecialistaModel');

mongoose.connect('mongodb://localhost:27017/miapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const especialistas = [
  {
    "nombre": "Gustavo Valderrama",
    "especialidad": new mongoose.Types.ObjectId("68509d04fa57d30465158300"),
    "rut": "12345678-9",
    "correo": "gvalderrama@redsalud.cl",
    "telefono": "912345678"
  },
  {
    "nombre": "Carla Montenegro",
    "especialidad": new mongoose.Types.ObjectId("68509d04fa57d30465158301"),
    "rut": "23456789-0",
    "correo": "cmontenegro@redsalud.cl",
    "telefono": "987654321"
  },
  {
    "nombre": "Ignacio Rojas",
    "especialidad": new mongoose.Types.ObjectId("68509d04fa57d30465158302"),
    "rut": "34567890-1",
    "correo": "irojas@redsalud.cl",
    "telefono": "976543210"
  },
  {
    "nombre": "Valentina Soto",
    "especialidad": new mongoose.Types.ObjectId("68509d04fa57d30465158303"),
    "rut": "45678901-2",
    "correo": "vsoto@redsalud.cl",
    "telefono": "965432109"
  },
  {
    "nombre": "Rodrigo Fuentes",
    "especialidad": new mongoose.Types.ObjectId("68509d04fa57d30465158304"),
    "rut": "56789012-3",
    "correo": "rfuentes@redsalud.cl",
    "telefono": "954321098"
  },
  {
    "nombre": "Paula Ramírez",
    "especialidad": new mongoose.Types.ObjectId("68509d04fa57d30465158305"),
    "rut": "67890123-4",
    "correo": "pramirez@redsalud.cl",
    "telefono": "943210987"
  },
  {
    "nombre": "Esteban Pino",
    "especialidad": new mongoose.Types.ObjectId("68509d04fa57d30465158306"),
    "rut": "78901234-5",
    "correo": "epino@redsalud.cl",
    "telefono": "932109876"
  },
  {
    "nombre": "Camila Herrera",
    "especialidad": new mongoose.Types.ObjectId("68509d04fa57d30465158307"),
    "rut": "89012345-6",
    "correo": "cherrera@redsalud.cl",
    "telefono": "921098765"
  }
];

async function populate() {
  try {
    await Especialista.deleteMany({});
    await Especialista.insertMany(especialistas);
    console.log('Especialistas insertados correctamente');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error al insertar especialistas:', err);
    mongoose.disconnect();
  }
}

populate();