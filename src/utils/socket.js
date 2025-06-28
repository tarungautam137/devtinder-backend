const socket=require('socket.io')
const chatModel=require("../models/chat")

const initialiseSocket=(server)=>{

    const io=socket(server,{
        cors:{
            origin:"https://devtinder-frontend-wine.vercel.app",
            credentials:true
        }
    });
    io.on("connection",(socket)=>{

        socket.on("joinChat",({loggedInUserId,targetUserId,firstName})=>{

            const roomId = [loggedInUserId, targetUserId].sort().join("_");
            
            socket.join(roomId);

            console.log(firstName ,"joined room :", roomId)
        })

        socket.on("sendMessage",async ({firstName,lastName,loggedInUserId,targetUserId,text})=>{

            try{

                const roomId = [loggedInUserId, targetUserId].sort().join("_");

                io.to(roomId).emit("receiveMessage",{firstName,lastName,text});

                let chat=await chatModel.findOne({

                    participants:{$all:[loggedInUserId,targetUserId]}
                })

                if(!chat) {

                    chat=new chatModel({
                        participants:[loggedInUserId,targetUserId],
                        messages:[]
                    })
                }

                chat.messages.push({
                    senderId:loggedInUserId,
                    text
                })

                await chat.save()
            }
            catch(err){ console.log(err)}
        })

        socket.on("disconnect",()=>{})
    });
}
module.exports=initialiseSocket;
