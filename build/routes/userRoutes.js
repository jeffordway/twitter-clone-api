"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
//express router
const router = (0, express_1.Router)();
//GET /api/users - get all users
router.get('/', userController_1.getAllUsers);
//GET /api/users/search/:searchParams - search users
router.get('/search/:searchParams', userController_1.findUsers);
//POST /api/users - create a new user
router.post('/', userController_1.createUser);
//POST /api/users/login - login a new user
router.post('/login', userController_1.loginUser);
//GET /api/users/:userId - get single user
router.get('/:userId', userController_1.getUser);
//PUT /api/users/:userId - update user
router.put('/:userId', userController_1.updateUser);
//router export
exports.default = router;
