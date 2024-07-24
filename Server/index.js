const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/Todo'); // Ensure this path is correct
const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb+srv://pyrakroth:azjYgg6PmxiYldK9@cluster0.6nrnl8w.mongodb.net/todo', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));

// Define the /update/:id route
app.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { task } = req.body;

    if (!task) {
        return res.status(400).json({ message: 'Task is required' });
    }

    TodoModel.findByIdAndUpdate(id, { task: task }, { new: true })
        .then(result => {
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        })
        .catch(err => {
            console.error('Error updating task:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});

// Define the /delete route
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    TodoModel.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                res.json({ message: 'Task deleted successfully' });
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        })
        .catch(err => {
            console.error('Error deleting task:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});

// Define the /get route
app.get('/get', (req, res) => {
    TodoModel.find()
        .then(result => res.json(result))
        .catch(err => {
            console.error('Error retrieving todos:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});

// Define the /add route
app.post('/add', (req, res) => {
    const task = req.body.task;
    if (!task) {
        return res.status(400).json({ message: 'Task is required' });
    }

    TodoModel.create({ task: task })
        .then(result => res.json(result))
        .catch(err => {
            console.error('Error adding task:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        });
});

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});