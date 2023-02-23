import { Router } from "express";
import { createUser, findUsers, getAllUsers, getUser, loginUser, updateUser } from "../controllers/userController";


//express router
const router = Router();

//GET /api/users - get all users
router.get('/', getAllUsers);

//GET /api/users/search/:searchParams - search users
router.get('/search/:searchParams', findUsers);

//POST /api/users - create a new user
router.post('/', createUser);

//POST /api/users/login - login a new user
router.post('/login', loginUser);

//GET /api/users/:userId - get single user
router.get('/:userId', getUser);

//PUT /api/users/:userId - update user
router.put('/:userId', updateUser);



//router export
export default router;