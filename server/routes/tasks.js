const router = require('express').Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const filter = { user: req.userId };
    if (req.query.status === 'open') filter.done = false;
    if (req.query.status === 'done') filter.done = true;
    res.json(await Task.find(filter).sort({ done: 1, createdAt: -1 }));
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { title, notes, dueDate } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: 'A task needs a title.' });
    const task = await Task.create({ user: req.userId, title, notes, dueDate: dueDate || undefined });
    res.status(201).json(task);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { title, notes, dueDate, done } = req.body;
    const update = {};
    if (title !== undefined) update.title = title;
    if (notes !== undefined) update.notes = notes;
    if (dueDate !== undefined) update.dueDate = dueDate || null;
    if (done !== undefined) update.done = done;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      update,
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ id: task._id });
  } catch (e) { next(e); }
});

module.exports = router;
