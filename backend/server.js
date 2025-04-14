const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(
    cors({
      origin: 'https://finzarc-front.vercel.app',
      methods: ['POST', 'GET', 'PUT', 'DELETE'], 
      credentials: true, 
    })
  );
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb+srv://infusionpvtltd:vcLkKLKcKZgez7ur@cluster0.ta8g3.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Connection Error:', err));

// Import Routes
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 