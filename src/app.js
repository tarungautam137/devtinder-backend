const express=require('express');
const app = express();


app.use("/hello",(req,res)=>{res.send("hello from the hello")});

app.use("/test",(req,res)=>{res.send("hello from the test")});
app.listen(2607,()=>{console.log('server is listening at port 2607');});