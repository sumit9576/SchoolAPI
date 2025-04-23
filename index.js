const express = require('express');
const bodyParser = require('body-parser');
const schoolRoutes = require('./routes/school');
require('dotenv').config();  

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


app.use('/', schoolRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
