const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 6003;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

app.options('/users', (req, res) => {
  res.status(204).send({ status: 'success', result: result.rows });
});

 require("./app/routes/routes")(app)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
