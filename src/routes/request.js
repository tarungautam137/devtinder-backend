const { userAuth } = require('../middlewares/userauth');
const connectionRequestModel=require('../models/connectionRequest');
const express = require('express');
const requestRouter=express.Router();
const userModel=require('../models/user');
const sendmail=require('../utils/sendmail');

requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req,res) => {

    try{
        const fromUserId=req.user._id,toUserId=req.params.toUserId,status=req.params.status;

        // STATUS CHECK
        const allowedValues=["ignored", "interested"]
        if(!allowedValues.includes(status)) throw new Error("Invalid status value. Allowed values are ignored or interested");

        //CHECH IF USER IS PRESENT OR NOT
        const toUser=await userModel.findById(toUserId);
        if(!toUser) throw new Error("user not found");

        //CHECK IF THERE ALREADY EXISTS A CONNECTION REQUEST
        const existingRequest=await connectionRequestModel.findOne({
            $or:[{fromUserId:fromUserId,toUserId:toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })
        if(existingRequest) throw new Error("connection request already exists");

        // FINALLY SAVE THE CONNECTION REQUEST
        const cr=new connectionRequestModel({fromUserId,toUserId,status});
        const data=await cr.save();

        res.json({
            message:"connection request sent successfully",data
        })
    }
    catch(err){res.status(400).send(err.message)}
})
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        // CHECK  STATUS
        const status=req.params.status;
        const allowedValues=["accepted","rejected"]
        if(!allowedValues.includes(status)) throw new Error("this status is not allowed")
        
        //FIND CONNECTION REQUEST
        const cr=await connectionRequestModel.findOne({
            _id:req.params.requestId,
            toUserId:req.user._id,
            status:"interested"
        })

        if(!cr) throw new Error("connection request not found")
        cr.status=status

        //SAVE AND SEND RESPONSE
        const data=await cr.save()
        res.json({message:"connection request "+status,data});
    }
    catch(err){
        res.status(400).send(err.message)
    }
})
module.exports=requestRouter;