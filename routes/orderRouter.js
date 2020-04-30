const express = require('express');
const router = express.Router();

const { getOrdersByUserId, addOrder } = require('../model/order');

router.get('/:id', async (req, res) => {
  const orders = await getOrdersByUserId(req.params.id);
  return res.json(await orders);
});

router.post('/:id', async (req, res) => {
  const ingredients = req.body.ingredients.filter(
    (ingredient) => ingredient.amount !== 0
  );

  const insert = await addOrder({
    price: req.body.price,
    id: req.body.id,
    ingredients,
  });

  if (insert.message) {
    return res.status(500).json({ err: insert.message });
  }

  return res.json(insert);
});

module.exports = router;
