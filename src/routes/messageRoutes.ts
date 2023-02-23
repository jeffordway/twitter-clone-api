import { Router } from "express";
import { createMessage, deleteMessage, findMessages, getAllMessages, getOneMessage, updateMessage } from "../controllers/messageController";

//express router
const router = Router();

//GET /api/messages - get all messages
router.get('/', getAllMessages);

//GET /api/messages/search/:searchParams - search users
router.get('/search/:searchParams', findMessages);

//POST /api/messages - create a new message
router.post('/', createMessage);

//GET /api/messages/:messageId - get all messages
router.get('/:messageId', getOneMessage);

//PUT /api/messages/:messageId - update a message
router.put('/:messageId', updateMessage);

//DELETE /api/messages/:messageId - update a message
router.delete('/:messageId', deleteMessage);

//router export
export default router;