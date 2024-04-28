const { Pool } = require('pg');

const db = new Pool({
  user: 'postgres',
  host: '127.0.0.1',
  password: 'Srihari@123',
  port: 5432,
  database: 'Grocery',
});
module.exports=db