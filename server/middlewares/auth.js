const jwt = require("jsonwebtoken");
const { GetUserById } = require("../dbfunctions");
// require("dotenv").config();
module.exports = async (req, res, next) => {
  try {
    if (!req.header("Authorization"))
      return res.send({
        success: false,
        message: "Authorization Header missing ...Auth failed",
      });
    //get token from header
    const token = req.header("Authorization").split(" ")[1];
    const decryptedToken = jwt.verify(token, "jwtsecret");
    const UserId = decryptedToken.id;
    const user = await GetUserById({
      id: UserId,
    });
    if (user.length == 0)
      return res.send({
        status: false,
        message: "Invalid JWT Token",
      });
    next();
  } catch (error) {
    res.send({
      status: false,
      message: error.message,
    });
  }
};
