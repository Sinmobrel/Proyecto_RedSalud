const Reserva = require('../models/ReservasModel');

// Crear una reserva
exports.crearReserva = async (req, res) => {
    try {
        const { especialista, box, fechaInicio, fechaFin } = req.body;

        // Validar colisión de horario para el especialista
        const conflictoEspecialista = await Reserva.findOne({
            especialista,
            $or: [
                { fechaInicio: { $lt: fechaFin }, fechaFin: { $gt: fechaInicio } }
            ]
        });

        if (conflictoEspecialista) {
            return res.status(400).json({ error: 'El especialista ya tiene una reserva en ese horario.' });
        }

        // Validar colisión de horario para el box
        const conflictoBox = await Reserva.findOne({
            box,
            $or: [
                { fechaInicio: { $lt: fechaFin }, fechaFin: { $gt: fechaInicio } }
            ]
        });

        if (conflictoBox) {
            return res.status(400).json({ error: 'El box ya está asignado a otro especialista en ese horario.' });
        }

        // Si no hay conflictos, crear la reserva
        const reserva = new Reserva(req.body);
        await reserva.save();
        res.status(201).json(reserva);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Obtener todas las reservas
exports.obtenerReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find()
            .populate('box')
            .populate('especialidad')    // <-- Agrega esto
            .populate('especialista');   // <-- Y esto
        res.json(reservas);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.actualizarReserva = async (req, res) => {
    try {
        const id = req.params.id;
        const datos = req.body;

        // Normaliza los campos de referencia a ObjectId
        if (datos.box && typeof datos.box === 'object' && datos.box._id) {
            datos.box = datos.box._id;
        }
        if (datos.especialidad && typeof datos.especialidad === 'object' && datos.especialidad._id) {
            datos.especialidad = datos.especialidad._id;
        }
        if (datos.especialista && typeof datos.especialista === 'object' && datos.especialista._id) {
            datos.especialista = datos.especialista._id;
        }

        const reservaActualizada = await Reserva.findByIdAndUpdate(id, datos, { new: true });
        res.json(reservaActualizada);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar la reserva' });
    }
};

exports.eliminarReserva = async (req, res) => {
    try {
        const id = req.params.id;
        await Reserva.findByIdAndDelete(id);
        res.status(200).json({ message: 'Reserva eliminada' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar la reserva' });
    }
};
