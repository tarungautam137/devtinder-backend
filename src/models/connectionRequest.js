const mongoose= require('mongoose');
const ConnectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User" // reference to the user collection
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    status:{
        type:String,
        enum:{
            values:["interested", "ignored", "accepted","rejected"],
            message:`{VALUE} value is not supprted `
        },
        required:true,
    },
},{timestamps:true});

ConnectionRequestSchema.index({fromUserId:1,toUserId:1});
ConnectionRequestSchema.pre("save",function(next){
    const connectionRequestInstance=this
    if(connectionRequestInstance.fromUserId.equals(connectionRequestInstance.toUserId)){
        throw new Error("You cannot send connection request to yourself")
    }
    next();
})

module.exports=mongoose.model('connectionRequest',ConnectionRequestSchema);