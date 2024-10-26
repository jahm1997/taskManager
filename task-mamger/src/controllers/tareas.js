const Tareas = require('../models/Tarea');

exports.getAllTareas = async (req, res) => {
  const tasks = await Tareas.find();
  res.status(200).json(tasks);
};

exports.getTareasById = async (req, res) => {
  const task = await Tasl.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Tarea no encontrado' });
  res.status(200).json(task);
};

exports.createTareas = async (req, res) => {
  const taskOp = new Tareas(req.body);
  const task = await taskOp.save();
  res.status(200).json(task);
};

exports.updateTareas = async (req, res) => {
  const task = await Tareas.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).json({ message: 'Tarea no encontrado' });
  res.status(200).json(task);
};

exports.deleteTareas = async (req, res) => {
  const task = await Tareas.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Tarea no encontrado' });
  res.status(200).json({ message: 'Tarea eliminado' });
};