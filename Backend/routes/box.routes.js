const express = require('express');
const router = express.Router();
const boxController = require('../controllers/BoxController');

router.get('/', boxController.getAllBoxes);
router.post('/', boxController.createBox);
router.put('/:id', boxController.updateBox);
router.put('/mantenimiento/:id', boxController.actualizarMantenimiento);
router.delete('/mantenimiento/:id', boxController.eliminarMantenimiento);
router.get('/ocupados', boxController.getBoxesOcupados);
router.get('/pisos', boxController.getPisos);
router.get('/mantenimiento', boxController.getBoxesMantenimiento);

router.patch('/:id', async (req, res) => {
  try {
    const box = await Box.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(box);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;