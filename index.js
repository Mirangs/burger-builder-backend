const path = require('path');

const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.static(path.resolve(__dirname, 'client', 'build')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.json({ info: 'Burger Builder API server, v1.0.0' });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const {
  app: { PORT },
} = require('./config');
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
