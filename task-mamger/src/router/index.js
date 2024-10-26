const express = require('express')
let router = express.Router()
const taskRouter = require('./tarea.js');
const usuarioRouter = require('./usuario.js');
const authRouter = require('./auth.js');
const actividRouter = require('./actividad.js');

function getRouter() {
	taskRouter(router);
	usuarioRouter(router);
	authRouter(router);
	actividRouter(router);
	return router
}

module.exports = getRouter