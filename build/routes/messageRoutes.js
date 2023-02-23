"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controllers/messageController");
//express router
const router = (0, express_1.Router)();
//GET /api/messages - get all messages
router.get('/', messageController_1.getAllMessages);
//GET /api/messages/search/:searchParams - search users
router.get('/search/:searchParams', messageController_1.findMessages);
//POST /api/messages - create a new message
router.post('/', messageController_1.createMessage);
//GET /api/messages/:messageId - get all messages
router.get('/:messageId', messageController_1.getOneMessage);
//PUT /api/messages/:messageId - update a message
router.put('/:messageId', messageController_1.updateMessage);
//DELETE /api/messages/:messageId - update a message
router.delete('/:messageId', messageController_1.deleteMessage);
//router export
exports.default = router;
