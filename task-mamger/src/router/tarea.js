
const { getAllTareas, getTareasById, createTareas, updateTareas, deleteTareas } = require("../controllers/tareas");

function tareaRouter(router) {
    router.get('/task', getAllTareas);
    router.get('/task/:id', getTareasById);
    router.post('/task', createTareas);
    router.put('/task/:id', updateTareas);
    router.delete('/task/:id', deleteTareas);
	return router
}

module.exports = tareaRouter

