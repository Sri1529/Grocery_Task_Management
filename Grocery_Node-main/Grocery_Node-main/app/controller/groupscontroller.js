const db=require("../../config/db")

exports.insert_grp_datas = async (req, res) => {
    const { createdBy, groupStatus, icon, isActive, name } = req.body;
  
    try {
      // Get the current maximum id value
      const resultMaxId = await db.query('SELECT MAX(id) FROM groups');
      const maxId = resultMaxId.rows[0].max || 0;
  
      
      const result = await db.query(
        'INSERT INTO groups (id, created_by, group_status, icon, is_active, name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [maxId + 1, createdBy, groupStatus, icon, isActive, name]
      );
  
      res.status(201).send({ status: 'Success', result: result.rows[0] });
    } catch (error) {
      console.error('Error inserting data into the database:', error);
      res.status(500).send({ status: 'Error', error: 'Internal Server Error' });
    }
  };

 exports.get_gro_id= async (req, res) => {
    const groupName = req.query.groupName;
  console.log("group name",groupName)
    try {
      const result = await db.query('SELECT id FROM groups WHERE name = $1', [groupName]);
  
      if (result.rows.length > 0) {
        const groupId = result.rows[0].id;
        res.json({ group_id: groupId });
      } else {
        res.status(404).json({ error: 'Group not found' });
      }
    } catch (error) {
      console.error('Error executing query', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };