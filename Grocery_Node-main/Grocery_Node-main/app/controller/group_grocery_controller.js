const db=require("../../config/db")

exports.insert_grpid_name = async (req, res) => {
    try {
      const { groupId, items } = req.body;
      console.log('Request Body:', req.body);
  
      // Validate that 'items' is an array
      if (!Array.isArray(items)) {
        return res.status(400).json({ message: 'Invalid data format' });
      }
  
      // Process the array of item names
      // For simplicity, this example just logs the items
      console.log('Received items:', items, groupId);
  
      // Start a transaction
      await db.query('BEGIN');
  
      try {
        // Attempt to insert items into the database with a conflict resolution
        for (const itemName of items) {
          try {
            const result = await db.query('INSERT INTO group_groceries (group_id, name) VALUES ($1, $2) ON CONFLICT (group_id, name) DO NOTHING', [groupId, itemName]);
  
            console.log('Database Query Result:', result);
          } catch (dbError) {
            console.error('Error inserting item into the database:', dbError);
            // Log the error, but continue processing the rest of the items
          }
        }
  
        // Commit the transaction
        await db.query('COMMIT');
  
        res.status(200).json({ message: 'Items inserted successfully' });
      } catch (error) {
        // Rollback the transaction on error
        await db.query('ROLLBACK');
        console.error('Error processing items:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } catch (error) {
      console.error('Error processing items:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.select_name = async (req, res) => {
    try {
      const groupId = req.query.groupId;
  
      if (!groupId || isNaN(groupId)) {
        return res.status(400).json({ error: 'Invalid groupId parameter' });
      }
  
      // Convert the groupId to an integer
      const groupIdInt = parseInt(groupId, 10);
  
      // Query the database to get the names based on the groupId
      const result = await db.query('SELECT name FROM group_groceries WHERE group_id = $1', [groupIdInt]);
  
      const names = result.rows.map((row) => row.name);
      res.json({ result: names });
    } catch (error) {
      console.error('Error fetching items:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };