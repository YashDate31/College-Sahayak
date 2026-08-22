require('dotenv').config();
const express = require('express');
const cors = require('cors');

const materialsRoutes = require('./routes/materials');
const usersRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');

const app = express();
app.set('trust proxy', 1); // Trust the first proxy (Render) to get the correct client IP for rate limiting

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/materials', materialsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

