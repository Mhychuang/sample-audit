/** Contain the logic of the backend of the application */

// Set of connections that users will start using as they make requests
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgres",
  database: "audit",
  port: "5432",
});

const getPollingPlaces = async (req, res) => {
    const response = await pool.query('SELECT id, name, hand_count, machine_count, count_date::timestamp::date FROM sample_audit ORDER BY id ASC');
    console.log(response.rows);
  try {
      const response = await pool.query("SELECT id, name, hand_count, machine_count, count_date::timestamp::date FROM sample_audit ORDER BY id ASC");
    res.status(200).json(response.rows);
  } catch (err) {
    res.json(err);
  }
};

const getPollingPlaceById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
      const response = await pool.query("SELECT * FROM sample_audit WHERE id = $1", [
      id,
    ]);
    res.json(response.rows);
  } catch (err) {
    res.json(err);
  }
};

const createPollingPlace = async (req, res) => {
    try {
        const { name, hand_count, machine_count, count_date } = req.body;
	const response = await pool.query(
	    "INSERT INTO sample_audit (name, hand_count, machine_count, count_date) VALUES ($1, $2, $3, $4)",
        [name, hand_count, machine_count, count_date]
    );
        console.log("INSERT INTO sample_audit (name, hand_count, machine_count, count_date) VALUES ($1, $2, $3, $4)",
            [name, hand_count, machine_count, count_date])
	res.json({
	    message: "A new polling places was created",
	    body: {
            pollingPlace: { name, hand_count, machine_count, count_date },
	    },
	});
    } catch (err) {
	res.json(err);
    }
};

const updatePollingPlace= async (req, res) => {
  try {
    const id = parseInt(req.params.id);
      const { hand_count, machine_count, count_date }= req.body;

    const response = await pool.query(
      "UPDATE sample_audit SET hand_count = $1, machine_count = $2, count_date = $3 WHERE id = $4",
        [ hand_count, machine_count, count_date, id]
    );
    console.log(response);
      res.json("polling places updated in the system");
  } catch (err) {
    res.json(err);
  }
};

const deletePollingPlace = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
      await pool.query("DELETE FROM sample_audit where id = $1", [id]);
      res.json(`polling places ${id} was deleted from the system`);
  } catch (err) {
    res.json(err);
  }
};

module.exports = {
    getPollingPlaces,
    getPollingPlaceById,
    createPollingPlace,
    updatePollingPlace,
    deletePollingPlace
};
