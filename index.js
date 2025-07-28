const express=require("express");
const connectToDb = require("./config/ConnectToDb");
const app=express();
require("dotenv").config();
const port=process.env.PORT;
app.use(express.json());
connectToDb();
const userRouter=require("./routes/authRouter");
app.use(userRouter);
const eventRouter=require("./routes/eventRouter");
app.use(eventRouter);





app.listen(port,()=>{console.log(`Server is listening on port ${port}`)});