import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const router = express.Router();

//Defining MongoDB Schemas
const chatSchema = new mongoose.Schema({
  username: String,
  message: String,
});

//Defining MongoDB models

const Chats = new mongoose.model("Chats", chatSchema);

//Secret Key
const secret = "se3ret";

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(401);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.post("/", authenticateJWT, async (req, res) => {
  const { message } = req.body;
  const newChat = new Chats({ username: req.user.username, message: message });
  await newChat.save();
  res.status(200).send({ message: "Chat posted successfully" });
});

router.get("/messages", authenticateJWT, async (req, res) => {
  const messages = await Chats.find({});
  if (messages) {
    res.status(200).send(messages);
  }else{
    res.send("No messages available");
  }
});

router.get("/username", authenticateJWT, (req, res) => {
  res.status(200).send(req.user)
})

export default router;
