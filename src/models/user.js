const mongoose = require('mongoose');
const validator = require('validator');
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

const userSchema=new mongoose.Schema({

    firstName:{
        type:String,
        required:true
        
    },
    lastName:{type:String,
        required:true
    },
    age:{type:Number},

    email:{type:String,

        required:true,
        unique:true,
    },
    
    gender:{type:String,
        validate(value){

            if(!['male','female'].includes(value)){
                throw new Error('gender must be either male or female')
            }
        }
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true,
});

userSchema.methods.getJWT= function(){
    const user=this;

    const token=jwt.sign({id:user._id},"devtinder")
    return token
}
userSchema.methods.verifyPassword=async function(enteredPassword){

    const user=this
    const isCorrect=await bcrypt.compare(enteredPassword,user.password)
    return isCorrect
}

module.exports=mongoose.model('User',userSchema);