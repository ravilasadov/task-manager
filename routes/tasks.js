const express = require('express');
const router = express.Router();
const Task = require('../models/Task');


// GET /tasks - Fetch all tasks from MongoDB
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /tasks - Create a new task in MongoDB
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string' });
    }

    const newTask = new Task({ title });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /tasks/:id - Update a task's completed status
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  // Log the raw body to see what's being received
  console.log('DEBUG PUT BODY:', req.body);

  const { completed } = req.body;

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /tasks/:id - Delete a task from MongoDB
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// PUT /tasks/:id/edit - Fully update task (title + completed)
router.put('/:id/edit', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  if (typeof title !== 'string' || typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid data. "title" must be string, "completed" must be boolean.' });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fully update task' });
  }
});

// PATCH /tasks/:id - Partially update task (title or completed or both)
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = {};

  if (typeof req.body.title === 'string') {
    updates.title = req.body.title;
  }

  if (typeof req.body.completed === 'boolean') {
    updates.completed = req.body.completed;
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid fields to update' });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to partially update task' });
  }
});


module.exports = router;
