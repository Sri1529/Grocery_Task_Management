const db = require("../../config/db")
exports.namephone = async (req, res) => {
    try {
      const { phone } = req.query;
  
      if (!phone) {
        // If phone number is not provided in the query, return an error response
        return res.status(400).send({ status: 'Error', error: 'Phone number not provided in the query' });
      }
  
      // Use parameterized query to prevent SQL injection
      const result = await db.query('SELECT name, phone FROM users WHERE phone = $1', [phone]);
  
      if (result.rows.length === 0) {
        // If no user is found with the provided phone number, return a not found response
        return res.status(404).send({ status: 'Error', error: 'User not found' });
      }
  
      // Send the user details as a success response
      res.send({
        status: 'Success',
        result: result.rows.map(row => ({ name: row.name, phone: row.phone })),
      });
    } catch (error) {
      console.error('Error retrieving data from the database:', error);
      res.status(500).send({ status: 'Error', error: 'Internal Server Error' });
    }
  };
  
  
  exports.selectid = async (req, res) => {
    try {
      const { phone } = req.query;
  
      if (!phone) {
        return res.status(400).send({ status: 'Error', error: 'Phone number not provided in the query' });
      }
  
      const result = await db.query('SELECT id FROM users WHERE phone = $1', [phone]);
  
      if (result.rows.length === 0) {
        return res.status(404).send({ status: 'Error', error: 'User not found' });
      }
  
      res.send({ status: 'Success', result: result.rows[0].id });
    } catch (error) {
      console.error('Error retrieving user ID from the database:', error);
      res.status(500).send({ status: 'Error', error: 'Internal Server Error' });
    }
  };


  exports.get_select_id_name = async (req, res) => {
    try {
      const { phone } = req.query;
  
      if (!phone) {
        return res.status(400).send({ status: 'Error', error: 'Phone number not provided in the query' });
      }
  
      const result = await db.query('SELECT id, name FROM users WHERE phone = $1', [phone]);
  
      if (result.rows.length === 0) {
        return res.status(404).send({ status: 'Error', error: 'User not found' });
      }
  
      res.send({
        status: 'Success',
        result: result.rows[0],
      });
    } catch (error) {
      console.error('Error retrieving user details from the database:', error);
      res.status(500).send({ status: 'Error', error: 'Internal Server Error' });
    }
  };


  exports.select_phone = async (req, res) => {
    try {
      const { name } = req.query;
  
      if (!name) {
        return res.status(400).json({ status: 'Error', error: 'Name not provided in the query' });
      }
  
      // Use parameterized query to prevent SQL injection
      const result = await db.query('SELECT phone FROM users WHERE name = $1', [name]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ status: 'Error', error: 'User not found' });
      }
  
      // Send the user phone number as a success response
      res.json({ status: 'Success', result: result.rows[0].phone });
    } catch (error) {
      console.error('Error retrieving phone number from the database:', error);
      res.status(500).json({ status: 'Error', error: 'Internal Server Error' });
    }
  };

  exports.get_name_with_phone = async (req, res) => {
    try {
      const { phone } = req.query;
  
      // Fetch the name from the users table based on the phone number
      const result = await db.query('SELECT name FROM users WHERE phone = $1', [phone]);
  
      // Check if the result has any rows
      if (result.rows.length > 0) {
        const userName = result.rows[0].name;
        res.json({ result: userName });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };