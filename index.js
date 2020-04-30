const path = require('path');

const express = require('express');
const app = express();
const cors = require('cors');

require('./model/db').connect((err, client) => {
  console.log('Database: ', {
    user: client.user,
    database: client.database,
    port: client.port,
    host: client.host,
  });
});

app.use(cors());
app.use(express.static(path.resolve(__dirname, 'client', 'build')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.json({ info: 'Burger Builder API server, v1.0.0' });
});

app.use('/api/user', require('./routes/usersRouter'));
app.use('/api/country', require('./routes/countriesRouter'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

const {
  app: { PORT },
} = require('./config');
app.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
