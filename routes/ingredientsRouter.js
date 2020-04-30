const express = require('express');
const router = express.Router();

const { getIngredients } = require('../model/ingredient');

router.get('/', async (req, res) => {
  const ingredients = await getIngredients();
  res.json(ingredients);
});

module.exports = router;
