const mongoose = require('mongoose');


const connectDB= async ()=>{
    await mongoose.connect("mongodb+srv://TarunGautam:Tarungautam1%40@namastenode.zxuao.mongodb.net/DevTinder")
}

module.exports=connectDB;