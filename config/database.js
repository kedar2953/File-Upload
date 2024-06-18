const mongoose=require('mongoose')
require('dotenv').config();
exports.connectDB=()=>{
    
        mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        }).then(()=>{
            console.log("Connection successful !")
        }).catch((err)=>{
            console.log("Error while connecting !");
            console.error(err);
            process.exit(1);
        })
            
    
}