const mongoose=require("mongoose");
const messageSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        
    },chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"chat"
    },message:{
        type:String,
        required:true
    },role:{
        type:String,
        enum:["user","ai","system"],
        default:"user"
    }
},{timestamps:true})
const messageModel=mongoose.model("Message",messageSchema);
module.exports=messageModel;