const pool = require("./mysql_config");

const GetUserByEmail = async (data) => {
  try {
    connection = await pool.getConnection();
    const [results, fields] = await connection.query(
      "SELECT * FROM `users` WHERE `email` = ?",
      [data.email]
    );
    return results;
  } catch (err) {
    console.log(err);
  }
};

const GetUserById = async (data) => {
  try {
    connection = await pool.getConnection();
    const [results, fields] = await connection.query(
      "SELECT * FROM `users` WHERE `id` = ?",
      [data.id]
    );
    return results;
  } catch (err) {
    console.log(err);
  }
};

const AddNewUser = async (data) => {
  try {
    connection = await pool.getConnection();
    const [results, fields] = await connection.query(
      "INSERT INTO `users` (`username`, `email`, `password`) VALUES(?,?,?)",
      [data.username, data.email, data.password]
    );

    console.log(`User Added Successfully`, results); // results contains rows returned by server
    return {
      status: true,
      message: "New User Created Successfully",
    };
  } catch (err) {
    console.log(err);
  }
};
module.exports = { GetUserByEmail, AddNewUser, GetUserById };
