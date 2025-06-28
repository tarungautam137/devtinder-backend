const express=require('express');
const app = express();
const cookieParser=require('cookie-parser');
const connectDB=require("./config/database")
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/request");
const userRouter=require("./routes/user");
const chatRouter=require("./routes/chat");
const cors=require('cors');
 const initialiseSocket=require('./utils/socket'); 

require('dotenv').config();
require("./utils/cronjob"); // Importing cron job to run it

//app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(cors({origin:"https://devtinder-frontend-wine.vercel.app",credentials:true}))
app.use(express.json());
app.use(cookieParser());


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",chatRouter);

const http=require('http');
const server=http.createServer(app);

initialiseSocket(server); // Initializing socket.io with the server

connectDB().then(()=>{

    console.log("Database connection established")
    server.listen(process.env.PORT,()=>{console.log('server is listening at port 2607');});
}).catch(
    (err)=>{console.error("not connected")}
)

