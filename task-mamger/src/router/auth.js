const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

function authRouter(router) {

    router.post('/login', async (req, res) => {
        const { username, password } = req.body;
        
        try {
            const user = await Usuario.findOne({ usuario: username });
            
            if (!user) {
                return res.status(401).send('Usuario no encontrado');
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return res.status(401).send('Contraseña incorrecta');
            }

            req.session.user = { id: user._id, username: user.usuario, rol: user.rol };

            res.status(201).json(user);
        } catch (error) {
            res.status(500).send('Error en el servidor');
        }
    });

    router.post('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).send('Error al cerrar sesión');
            } else {
                res.send('Cerró sesión correctamente');
            }
        });
    });

    return router;
}

module.exports = authRouter;
