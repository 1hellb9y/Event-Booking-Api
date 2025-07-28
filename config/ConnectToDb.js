const mongoose=require("mongoose");
const connectToDb=async()=>{
    await mongoose.connect("mongodb://localhost:27017/event-booking").then(()=>{console.log("Connectd")}).catch((err)=>{console.log("Error")});
    console.log("/");
};

module.exports=connectToDb;