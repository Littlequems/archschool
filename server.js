const express = require('express');
const cors = require('cors');
const app = express();
const formidable = require('express-formidable')
app.use(formidable())
// app.set('domain','192.168.0.182')
require('./src/routes/index')(app); // <--- basta adicionar essa linha
app.use(cors());
app.use(express.json());
app.listen(3333);