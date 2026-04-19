const mongoose = require("mongoose")
const dns=require("dns")
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])
function connectDB(){
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("connect to db");
        
    })

}
module.exports=connectDB