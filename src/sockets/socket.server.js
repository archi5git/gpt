const { Server } = require("socket.io");
//const('./../../node_modules/@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_data/models/Vector.d');
const cookie=require("cookie")
const jwt=require("jsonwebtoken");
const userModel=require("../models/user.model");
const messageModel=require("../models/message.model");
const aiService=require("../services/ai.service")
const { createMemory, queryMemory } = require("../services/vectordb.service");
function initSocketServer(httpServer) {
    const io = new Server(httpServer, {});
    io.use(async(socket,next)=>{
        const cookies=cookie.parse(socket.handshake.headers?.cookie ||'');
        if(!cookies.token){
            next(new Error('Authentication error:No token provided'));
        }
        try{
            const decoded=jwt.verify(cookies.token,process.env.JWT_SECRET);
            const user= await userModel.findById(decoded.id);
            socket.user=user
            next();

        }catch(err){
            next(new Error("Authentication error:Invalid token"));
        }
    })

    io.on("connection", (socket) => {
        socket.on("ai-message", async (messagePayload) => {
            /*
            messagePayload should contain:
            messagepayload={
            message:message from user,
            chat:chatId
             console.log(messagePayload);*/ 
            await messageModel.create({
                
                chat:messagePayload.chat,
                message:messagePayload.message,
                role:"user"
            })
            const Vector=await aiService.generateVector(messagePayload.message);
            console.log("Generated vector:", Vector);
            const chatHistory=await messageModel.find({
                chat:messagePayload.chat});
                console.log(chatHistory.map(item=>{
                    return {role:item.role,
                        parts:[{
                            text:item.message
                        }
                    ]
                    }
                }));
                
            const response=await aiService.generateResponse(messagePayload.message);
            await messageModel.create({
                
                chat:messagePayload.chat,
                message:response,
                role:"ai"
            })
            socket.emit("ai-response", {
                message:response,
                chat:messagePayload.chat
            });
        }); 
    });
}

module.exports = initSocketServer;
