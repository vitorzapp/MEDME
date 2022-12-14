import "dotenv/config";
import { serverHttp, app } from "./WebSocket/socket.js";
import "./WebSocket/events.js"

import express from 'express'
//endpoints
import userController from "./Controller/userController.js"
import medicController from "./Controller/medicController.js"
import conversationController from "./Controller/conversationController.js"
import messagesController from "./Controller/messagesController.js"

app.use(express.json())
//usando os endpoints
app.use(userController);
app.use(medicController);
app.use(messagesController);
app.use(conversationController);

//subindo o servidor
serverHttp.listen(process.env.PORT, () => console.log(`API running on PORT: ${process.env.PORT}`));
