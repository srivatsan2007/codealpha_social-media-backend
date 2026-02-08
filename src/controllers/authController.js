const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "InstasphereSuperSecretKey123456";

// -------- REGISTER --------
exports.register = async (req, res) => {
  try {
    const { profilename, password } = req.body;

    const existing = await User.findOne({ profilename });
    if (existing)
      return res.status(400).json({ message: "Profile name already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      profilename,
      password: hashedPassword
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------- LOGIN --------
exports.login = async (req, res) => {
  try {
    const { profilename, password } = req.body;

    const user = await User.findOne({ profilename });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        profilename: user.profilename
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
