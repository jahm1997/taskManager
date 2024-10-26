const { getAllactivities, getActivityById, createACtivity, deleteActivity, updateActivity } = require("../controllers/actividad");

function actividRouter(router) {
    router.get('/actividad', getAllactivities);
    router.get('/actividad/:id', getActivityById);
    router.post('/actividad', createACtivity);
    router.put('/actividad/:id', updateActivity);
    router.delete('/actividad/:id', deleteActivity);
	return router
}

module.exports = actividRouter

