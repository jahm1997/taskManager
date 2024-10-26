const Actividad = require('../models/Actividad');

exports.getAllactivities = async (req, res) => {
    const actividad = await Actividad.find({ administrador: req.params.id });
    res.status(201).json(actividad);
};

exports.getActivityById = async (req, res) => {
    const Actividad = await Tasl.findById(req.params.id);
    if (!Actividad) return res.status(404).json({ message: 'Actividad no encontrado' });
    res.status(201).json(Actividad);
};

exports.createACtivity = async (req, res) => {
    const taskOp = new Actividad(req.body);
    const Actividad = await taskOp.save();
    res.status(201).json(Actividad);
};

exports.updateActivity = async (req, res) => {
    const Actividad = await Actividad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!Actividad) return res.status(404).json({ message: 'Actividad no encontrado' });
    res.status(200).json(Actividad);
};

exports.deleteActivity = async (req, res) => {
    const Actividad = await Actividad.findByIdAndDelete(req.params.id);
    if (!Actividad) return res.status(404).json({ message: 'Actividad no encontrado' });
    res.status(200).json({ message: 'Actividad eliminado' });
};
