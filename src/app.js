const express=require('express');
const app = express();
const cookieParser=require('cookie-parser');
const connectDB=require("./config/database")
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter=require("./routes/user");
const cors=require('cors');
require('dotenv').config();

app.use(cors({origin:"https://devtinder-frontend-wine.vercel.app",credentials:true}))
app.use(express.json());
app.use(cookieParser());


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);

connectDB().then(()=>{

    console.log("Database connection established")
    app.listen(process.env.PORT,()=>{console.log('server is listening at port 2607');});
}).catch(
    (err)=>{console.error("not connected")}
)
