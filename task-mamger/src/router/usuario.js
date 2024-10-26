
const { createUsers,deleteUsers,getAllUsers,getUsersById,updateUsers } = require("../controllers/usuarios");

function usuarioRouter(router) {
    router.get('/usuario', getAllUsers);
    router.get('/usuario/:id', getUsersById);
    router.post('/usuario', createUsers);
    router.put('/usuario/:id', updateUsers);
    router.delete('/usuario/:id', deleteUsers);
	return router
}

module.exports = usuarioRouter



