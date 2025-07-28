const mongoose=require("mongoose");
const UserShema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        trim:true,
    },
    email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/, 'Please fill a valid email address']
  },
  password:{
    type:String,
    required:[true,"Password is required"],
    min:6,
  },
  role:{
    type:String,
    enum:["admin","user"],
    default:"user",
  },

});
const User=mongoose.model("User",UserShema);
module.exports=User