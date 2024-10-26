const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

exports.getAllUsers = async (req, res) => {
    const usuarios = await Usuario.find({ lider: req.params.id});
    res.json(usuarios);
};

exports.getUsersById = async (req, res) => {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
};

exports.getUsersByUsername = async (req, res) => {
    const usuario = await Usuario.findOne({ usuario: req.params.username });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
};

exports.createUsers = async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = new Usuario({ ...rest, password: hashedPassword });
        const usuario = await nuevoUsuario.save();
        res.status(201).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear usuario', error });
    }
};

exports.updateUsers = async (req, res) => {
    try {
        const { password, ...rest } = req.body;
        let updatedData = { ...rest };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        const usuario = await Usuario.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error });
    }
};

exports.deleteUsers = async (req, res) => {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
};
