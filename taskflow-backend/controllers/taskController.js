const Task = require('../models/Task');

// @desc    Get all tasks for the authenticated user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;

    // Build filter object — only tasks belonging to this user
    const filter = { user: req.user._id };

    if (status && status !== 'All') filter.status = status;
    if (priority && priority !== 'All') filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Get Tasks Error:', error);
    res.status(500).json({ message: 'Failed to retrieve tasks.' });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.json(task);
  } catch (error) {
    console.error('Get Task Error:', error);
    res.status(500).json({ message: 'Failed to retrieve task.' });
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, category, dueDate, progress } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status: status || 'Pending',
      priority: priority || 'Medium',
      category: category || '',
      dueDate: dueDate || null,
      progress: progress || 0,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create Task Error:', error);
    res.status(500).json({ message: 'Failed to create task.' });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const { title, description, status, priority, category, dueDate, progress } = req.body;

    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.status = status ?? task.status;
    task.priority = priority ?? task.priority;
    task.category = category ?? task.category;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;
    task.progress = progress !== undefined ? progress : task.progress;

    // Auto-set progress to 100 if completed
    if (task.status === 'Completed') task.progress = 100;
    if (task.status === 'Pending') task.progress = 0;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error('Update Task Error:', error);
    res.status(500).json({ message: 'Failed to update task.' });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.json({ message: 'Task deleted successfully.', id: req.params.id });
  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({ message: 'Failed to delete task.' });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask };
