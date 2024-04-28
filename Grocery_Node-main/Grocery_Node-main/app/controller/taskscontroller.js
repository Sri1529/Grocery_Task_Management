const db=require("../../config/db")

exports.insert_task = async (req, res) => {
    try {
      const {
        group_id,
        assigned_by,
        assigned_to,
        due_date,
        isActive,
        cretaed_at,
        updated_at,
        name,
        unit,
        quantity,
        count,
      } = req.body;
  
      // Log the received data
      console.log('Received Data:', req.body);
  
      const result = await db.query(
        'INSERT INTO tasks (group_id, assigned_by, assigned_to, due_date, is_active, cretaed_at, updated_at, name, unit, quantity, count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
        [group_id, assigned_by, assigned_to, due_date, isActive, cretaed_at, updated_at, name, unit, quantity, count]
      );
  
      res.json({ success: true, task: result.rows[0] });
    } catch (error) {
      console.error('Error inserting task:', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };


  exports.display_task = async (req, res) => {
    try {
      const { groupId, phone } = req.params;
  
      // Fetch specific columns from the tasks table based on the group ID, phone, and completed_on condition
      const tasks = await db.query(
        'SELECT id,name, quantity, unit, count, assigned_by, due_date FROM tasks WHERE group_id = $1 AND assigned_to = $2 AND completed_on IS NULL',
        [groupId, phone]
      );
  
      // console.log('Tasks:', tasks.rows);
  
      // Send the tasks as a JSON response
      res.json({ tasks: tasks.rows });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  
  exports.update_completed_on = async (req, res) => {
    try {
      const { completedTasks } = req.body;
      console.log("Received completed tasks:", completedTasks);
  
      if (!Array.isArray(completedTasks)) {
        return res.status(400).json({ error: 'Invalid data format. Expecting an array.' });
      }
  
      for (const taskDetail of completedTasks) {
        const { id } = taskDetail;
  
        if (!id) {
          console.error('Incomplete task details for:', taskDetail);
          return res.status(400).json({ error: 'Incomplete task details.' });
        }
  
        // Log the SQL query before executing it
        const sqlQuery = `
          UPDATE tasks
          SET completed_on = NOW()
          WHERE
            id = $1
            AND completed_on IS NULL
        `;
        const sqlParams = [id];
        console.log('SQL Query:', sqlQuery, sqlParams);
  
        // Update the completed_on column for tasks matching the ID
        try {
          const updateResult = await db.query(sqlQuery, sqlParams);
          console.log('Update Result:', updateResult);
  
          if (updateResult.rowCount === 0) {
            console.log(`No matching task with NULL completed_on found for ID: ${id}`);
            return res.status(404).json({ error: `No matching task with NULL completed_on found for ID: ${id}` });
          }
  
          console.log(`Updated task with ID: ${id}`);
        } catch (updateError) {
          console.error('Error updating task:', updateError);
          return res.status(500).json({ error: 'Error updating task.' });
        }
      }
  
      // Commit the transaction after all updates
      await db.query('COMMIT');
  
      res.json({ success: true });
    } catch (error) {
      console.error('Error processing update request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  

  
  // app.get('/check', async (req, res) => {
  //   try {
  //     const sqlQuery = `
  //     SELECT *
  // FROM tasks
  // WHERE completed_on IS NULL  AND assigned_by =01;
  // `;
  
  
  //     const result = await db.query(sqlQuery);
  
  //     res.json({ tasks: result.rows });
  //   } catch (error) {
  //     console.error('Error fetching tasks:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // });

