const express = require('express');
const mongoose = require('mongoose');
const CalorieLog = require('./models/CalorieLog');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();
const User = require('./models/User');

const app = express();
app.use(cors());

// Yeh middleware JSON data ko samajhne mein madad karta hai
app.use(express.json());

// MongoDB se connect karna
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Hello! My backend is working');
});

app.get('/about', (req, res) => {
  res.send('This is my fitness website backend, built by Fatima Ijaz!');
});

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check karein user pehle se to nahi bana hua
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Password ko hash (secure) karna
    const hashedPassword = await bcrypt.hash(password, 10);

    // Naya user banana
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});
// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check karein user exist karta hai ya nahi
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Password compare karna (hashed password se)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful!', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});
// Calorie add karne ka route
app.post('/api/calories', async (req, res) => {
  try {
    const { userId, foodName, calories } = req.body;

    const newLog = new CalorieLog({
      userId,
      foodName,
      calories
    });

    await newLog.save();

    res.status(201).json({ message: 'Calorie entry added!', log: newLog });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

// Ek user ki saari calorie entries dekhne ka route
app.get('/api/calories/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const logs = await CalorieLog.find({ userId }).sort({ date: -1 });

    res.status(200).json({ logs });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});