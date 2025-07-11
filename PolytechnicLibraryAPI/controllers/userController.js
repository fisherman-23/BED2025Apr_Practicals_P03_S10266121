const bcrypt    = require('bcryptjs');
const userModel = require('../models/userModel');
const jwt       = require('jsonwebtoken');

async function registerUser(req, res) {
  const { username, password, role } = req.body;

  try {
    const existingUser = await userModel.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.createUser({
      username,
      passwordHash: hashedPassword,
      role
    });

    return res.json({
      user_id:  newUser.user_id,
      username: newUser.username,
      role:     newUser.role
    });
  } catch (err) {
    console.error('Controller error in registerUser:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;
  try {
    const user = await userModel.getUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
    const payload = {
      user_id: user.user_id,
      username: user.username,
      role: user.role
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });
    return res.status(200).json({ token });
  } catch (err) {
    console.error('Controller error in loginUser:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
module.exports = { registerUser, loginUser };
