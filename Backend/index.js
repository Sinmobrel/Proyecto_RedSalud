const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// IMPORTACIÓN DE RUTAS
const authRoutes = require('./controllers/AuthController');
const especialistaRoutes = require('./controllers/EspecialistaController');
const boxRoutes = require('./routes/box.routes');
const especialidadRoutes = require('./routes/especialidad.routes');
const reservaRoutes = require('./routes/reservas.routes');
const boxMantenimientoRoutes = require('./routes/boxmantenimiento.routes');


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/miapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

// RUTA BASE DE PRUEBA
app.get('/', (req, res) => res.send('API funcionando en backend'));

// RUTAS DE LA API
app.use('/especialidades', especialidadRoutes);
app.use('/especialistas', especialistaRoutes);
app.use('/login', authRoutes);
app.use('/boxes', boxRoutes);
app.use('/reservas', reservaRoutes);
app.use('/', reservaRoutes);
app.use('/boxmantenimientos', boxMantenimientoRoutes);

app.listen(3000, () => console.log('Servidor backend en puerto 3000'));
