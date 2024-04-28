const db=require("../../config/db")

exports.select_name = async (req, res) => {
    try {
      const result = await db.query('SELECT name FROM master_grocery');
      res.send({ status: 'Success', result: result.rows.map(row => row.name) });
    } catch (error) {
      console.error('Error retrieving data from the database:', error);
      res.status(500).send({ status: 'Error', error: error.message || 'Internal Server Error' });
    }
  };