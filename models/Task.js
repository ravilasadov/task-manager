const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true }); // ✅ this adds createdAt + updatedAt


const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
