const express = require('express');
const router = express.Router();

const {
  getOrdersByUserId,
  addOrder,
  getOrdersByRestaurant,
  getOrderStatuses,
  updateOrder,
  getOrdersForCourier,
} = require('../model/order');

router.get('/statuses', async (req, res) => {
  const statuses = await getOrderStatuses();
  return res.json(statuses);
});

router.get('/courier', async (req, res) => {
  const orders = await getOrdersForCourier();
  return res.json(orders);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { limit, offset, orderBy } = req.query;
  const orders = await getOrdersByUserId({
    id,
    limit,
    offset,
    orderBy,
  });
  return res.json(orders);
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

  return res.status(201).json(insert);
});

router.patch('/:id', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: 'Please provide body' });
  }

  const updated = await updateOrder(req.body);
  return res.status(202).json(updated);
});

router.get('/by-restaurant/:id', async (req, res) => {
  const { id } = req.params;
  const orders = await getOrdersByRestaurant(id);
  return res.json(orders);
});

module.exports = router;
