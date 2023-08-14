import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const router = express.Router();

//Defining MongoDB schemas
const userSchema = mongoose.Schema({
  username: String,
  password: String,
});

//Defining MongoDB models
const User = new mongoose.model("User", userSchema);

//Secret Key
const secret = "se3ret";

router.get("/", (req, res) => {
  res.send("Hello From Users");
});

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).send({ message: "User Already Exists!" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign(username, secret);
    res.status(200).send({
      message: "Account Created Successfully",
      token: token,
    });
    console.log("Account Created Success");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res
      .status(401)
      .send({ message: "Username or password is incorrect" });
  }

  if (user.password !== password) {
    return res
      .status(401)
      .send({ message: "Username or password is incorrect" });
  }

  const token = jwt.sign({ username }, secret);

  return res.status(200).send({ message: "Logged in successfully", token });
});

export default router;
