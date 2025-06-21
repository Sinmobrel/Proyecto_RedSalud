const express = require('express');
const router = express.Router();
const service = require('../services/EspecialistaService');

// POST /especialistas
router.post('/', async (req, res) => {
  const especialista = await service.crearEspecialista(req.body);
  res.status(201).json(especialista);
});

// GET /especialistas
router.get('/', async (req, res) => {
  const lista = await service.obtenerEspecialistas();
  res.json(lista);
});

// GET /especialistas/:id
router.get('/:id', async (req, res) => {
  const especialista = await service.obtenerEspecialista(req.params.id);
  res.json(especialista);
});

// PUT /especialistas/:id
router.put('/:id', async (req, res) => {
  const actualizado = await service.actualizarEspecialista(req.params.id, req.body);
  res.json(actualizado);
});

// DELETE /especialistas/:id
router.delete('/:id', async (req, res) => {
  await service.eliminarEspecialista(req.params.id);
  res.json({ eliminado: true });
});

module.exports = router;
