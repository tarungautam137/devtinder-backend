const jwt=require("jsonwebtoken")
const User = require("../models/user")

const userAuth= async (req,res,next) => {
    try{
        const {bourbon}=req.cookies
        if(!bourbon) throw new Error("User not logged in")

        const decoded=jwt.verify(bourbon,"devtinder")
        const {id}=decoded

        const user=await User.findById(id)
        if(!user) throw new Error("User not found")

        req.user = user
        next();
    }
    catch(err){
        res.status(401).send(" "+err.message)
    }
}
module.exports={userAuth}