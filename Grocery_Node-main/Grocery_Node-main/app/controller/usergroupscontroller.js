const db=require("../../config/db")

exports.select_grpname_with_phone =async (req, res) => {
    try {
      const createdBy = req.query.phone; // Assuming you pass the phone number as a query parameter
      const result = await db.query('SELECT group_name FROM user_groups WHERE phone = $1', [createdBy]);
      res.send({ status: 'Success', result: result.rows.map(row => row.group_name) });
    } catch (error) {
      console.error('Error retrieving data from the database:', error);
      res.status(500).send({ status: 'Error', error: 'Internal Server Error' });
    }
  };

  exports.name_with_grpname = async (req, res) => {
    const { group_name } = req.query;
  
    try {
      // Query the user_groups table to get members based on the group_name
      const result = await db.query('SELECT name FROM user_groups WHERE group_name = $1', [group_name]);
  
      res.json({ status: 'Success', result: result.rows });
    } catch (error) {
      console.error('Error fetching group members:', error);
      res.status(500).json({ status: 'Error', error: 'Internal Server Error' });
    }
  };


  exports.get_name= async (req, res) => {
    try {
      const { name } = req.query;
  
      if (!name) {
        return res.status(400).send({ status: 'Error', error: 'Name not provided in the query' });
      }
  
      // Retrieve only the "name" column from the user_groups table
      const result = await db.query(`
        SELECT name
        FROM user_groups
        WHERE name = $1
      `, [name]);
  
      if (result.rows.length === 0) {
        return res.status(404).send({ status: 'Error', error: 'No user found in any groups' });
      }
  
      res.send({
        status: 'Success',
        result: result.rows.map(row => row.name),
      });
    } catch (error) {
      console.error('Error retrieving user names from the database:', error);
      res.status(500).send({ status: 'Error', error: error.message || 'Internal Server Error' });
    }
  };
  
  // ... (your existing code)
  
  exports.distinct_name = async (req, res) => {
    try {
      // Retrieve all unique names from the user_groups table
      const result = await db.query(`
        SELECT DISTINCT name
        FROM user_groups
      `);
  
      res.send({
        status: 'Success',
        result: result.rows.map(row => row.name),
      });
    } catch (error) {
      console.error('Error retrieving user group names from the database:', error);
      res.status(500).send({ status: 'Error', error: error.message || 'Internal Server Error' });
    }
  };

  
  exports.getname = async (req, res) => {
    try {
      const { phone } = req.query;
  
      if (!phone) {
        return res.status(400).send({ status: 'Error', error: 'Phone number not provided in the query' });
      }
  
      // Use parameterized query to prevent SQL injection
      const result = await db.query('SELECT name FROM user_groups WHERE phone = $1', [phone]);
  
      if (result.rows.length === 0) {
        return res.status(404).send({ status: 'Error', error: 'User not found' });
      }
  
      // Send the user name as a success response
      res.send({
        status: 'Success',
        result: result.rows[0].name,
      });
    } catch (error) {
      console.error('Error retrieving data from the database:', error);
      res.status(500).send({ status: 'Error', error: 'Internal Server Error' });
    }
  };

  exports.select_grpid = async (req, res) => {
    try {
      const { groupName } = req.params;
       console.log(groupName)
      // Query the database to get the group id based on the group name
      const result = await db.query('SELECT group_id FROM user_groups WHERE group_name = $1', [groupName]);
  
      if (result.rows.length > 0) {
        // Group found, send the group id in the response
        res.status(200).json({ groupId: result.rows[0].group_id });
      } else {
        // Group not found
        res.status(404).json({ message: 'Group not found' });
      }
    } catch (error) {
      console.error('Error retrieving group id:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  exports.insert_datas =async (req, res) => {
    const { user_id, group_id, name, phone, group_name } = req.body;
    console.log('Request Body:', req.body);
    try {
      // Insert into the user_groups table with user_id, group_id, name, phone, and group_name
      const result = await db.query(
        'INSERT INTO user_groups (user_id, group_id, name, phone, group_name, is_active, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW()) RETURNING *',
        [user_id, group_id, name, phone, group_name]
      );
  
      res.status(201).send({ status: 'Success', result: result.rows[0] });
    } catch (error) {
      console.error('Error inserting data into user_groups table:', error);
      res.status(500).send({ status: 'Error', error: error.message || 'Internal Server Error' });
    }
  };