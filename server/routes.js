const express = require("express");
const { GetUserByEmail, AddNewUser, GetUserById } = require("./dbfunctions");
const app = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("./middlewares/auth");

app.post("/register", async (req, res) => {
  try {
    //Checking if parameters are present or not
    if (!req.body.username || !req.body.email || !req.body.password)
      return res.send({
        status: false,
        message: "Invalid Input",
      });

    //Check if user exist
    const UserFound = await GetUserByEmail({ email: req.body.email });

    if (UserFound.length > 0)
      return res.send({
        status: false,
        message: "Email Already Exists",
      });

    //Password Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    const response = await AddNewUser({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    if (!response.status)
      return res.send({
        status: false,
        message: response.message,
      });

    return res.status(200).send({
      status: true,
      message: "Registration Successful",
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      status: false,
      message: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    //Checking if parameters are present or not
    if (!req.body.email || !req.body.password)
      return res.send({
        status: false,
        message: "Invalid Input",
      });

    //Check if User Exists Or Not
    const userFound = await GetUserByEmail({
      email: req.body.email,
    });

    if (userFound.length == 0)
      return res.send({
        status: false,
        message: "Wrong Email",
      });

    //Password Validation
    console.log(userFound[0].password);

    const validPassword = await bcrypt.compare(
      req.body.password,
      userFound[0].password
    );

    if (!validPassword)
      return res.send({
        status: false,
        message: "Wrong Password",
      });

    //Generate Token
    const token = jwt.sign({ id: userFound[0].id }, "jwtsecret", {
      // expiresIn: "1d",
    });

    res.status(200).send({
      status: true,
      message: "User Logged Successfully",
      token: token,
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      status: false,
      message: error.message,
    });
  }
});

app.get("/profile", auth, async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const decryptedToken = jwt.verify(token, "jwtsecret");
    const UserId = decryptedToken.id;
    const user = await GetUserById({
      id: UserId,
    });
    console.log(user[0]);
    res.send({
      status: true,
      message: "Profile Fetched Successfully",
      data: user[0],
    });
  } catch (error) {
    console.log(error.message);

    res.send({
      status: false,
      message: error.message,
    });
  }
});

module.exports = app;
