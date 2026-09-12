const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/devops-db';

app.use(cors());
app.use(express.json());

let isDbConnected = false;

// Fallback in-memory store if MongoDB is not connected
let fallbackTodos = [
  { _id: '1', title: 'Setup Docker Container', completed: true },
  { _id: '2', title: 'Configure Kubernetes Deployment', completed: false },
  { _id: '3', title: 'Connect Frontend & Backend Service', completed: false }
];

// Todo Mongoose Schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Todo = mongoose.model('Todo', todoSchema);

// MongoDB connection logic with robust fallback mechanism
async function connectDB() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 3000
    });
    isDbConnected = true;
    console.log(`[Backend] Connected to MongoDB at ${MONGO_URI}`);
  } catch (err) {
    isDbConnected = false;
    console.warn(`[Backend] MongoDB connection failed (${err.message}). Using in-memory fallback storage.`);
  }
}

mongoose.connection.on('disconnected', () => {
  isDbConnected = false;
  console.warn('[Backend] MongoDB disconnected! Switching to fallback array.');
});

mongoose.connection.on('connected', () => {
  isDbConnected = true;
  console.log('[Backend] MongoDB connected!');
});

// Initial Connection Attempt
connectDB();

// API Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'backend-api',
    database: isDbConnected ? 'connected' : 'disconnected (fallback active)',
    mongoUri: isDbConnected ? MONGO_URI : undefined
  });
});

// GET /api/todos - Fetch all todos
app.get('/api/todos', async (req, res) => {
  try {
    if (isDbConnected) {
      const todos = await Todo.find().sort({ createdAt: -1 });
      return res.json(todos);
    }
  } catch (err) {
    console.error('[Backend] Error fetching todos from DB:', err.message);
  }
  
  // Return fallback array if DB is not connected or query fails
  res.json(fallbackTodos);
});

// POST /api/todos - Add a new todo
app.post('/api/todos', async (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'Todo title is required' });
  }

  try {
    if (isDbConnected) {
      const newTodo = await Todo.create({ title: title.trim(), completed: false });
      return res.status(201).json(newTodo);
    }
  } catch (err) {
    console.error('[Backend] Error saving todo to DB:', err.message);
  }

  // Fallback array storage
  const newFallbackTodo = {
    _id: Date.now().toString(),
    title: title.trim(),
    completed: false,
    createdAt: new Date()
  };
  fallbackTodos.unshift(newFallbackTodo);
  res.status(201).json(newFallbackTodo);
});

// DELETE /api/todos/:id - Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    if (isDbConnected) {
      await Todo.findByIdAndDelete(id);
      return res.json({ message: 'Todo deleted successfully' });
    }
  } catch (err) {
    console.error('[Backend] Error deleting todo from DB:', err.message);
  }

  fallbackTodos = fallbackTodos.filter(t => t._id !== id);
  res.json({ message: 'Todo deleted from fallback array' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Backend] Express server running on port ${PORT}`);
});
