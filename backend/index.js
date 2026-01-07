const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URL || 'mongodb://mongodb:27017/todo_db');

const TaskSchema = new mongoose.Schema({
    text: String,
    completed: { type: Boolean, default: false }
});
const Task = mongoose.model('Task', TaskSchema);

// Routes
app.get('/tasks', async (req, res) => res.json(await Task.find()));

app.post('/tasks', async (req, res) => {
    const task = new Task({ text: req.body.text });
    await task.save();
    res.json(task);
});

app.patch('/tasks/:id', async (req, res) => {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
});

app.delete('/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

app.listen(3000);