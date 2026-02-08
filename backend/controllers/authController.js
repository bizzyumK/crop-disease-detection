const User = require("../models/User");
const jwt = require("jsonwebtoken");

//generate JWT token

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//registration
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //check if user already exists

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User is already registered!" });
    }

    //else create from model

    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration Failed" });
  }
};

//login

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email!" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password!" });
    }

    res.status(200).json({
      id: user._id,
      username: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Login Failed! " });
  }
};
