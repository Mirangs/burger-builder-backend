const express = require('express');
const router = express.Router();

const { getCountries, getCountryById } = require('../model/country');

router.get('/', async (req, res) => {
  const countries = await getCountries();
  res.json(countries);
});

router.get('/:id', async (req, res) => {
  const country = await getCountryById(req.params.id);
  res.json(country);
});

module.exports = router;
