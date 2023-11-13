const express = require('express');
const { registerController, loginController, updateUserController, requireSingIn } = require('../controllers/userController');

//ROUTER OBJECT
const router = express.Router();

//ROUTES
//REGISTER || POST
router.post('/register', registerController);

//LOGIN || POST
router.post('/login', loginController);

//LOGIN || POST
router.put('/update-user', requireSingIn, updateUserController);

module.exports = router;