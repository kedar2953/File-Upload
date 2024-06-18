const mongoose = require("mongoose");
const nodemailer=require('nodemailer');
const transporter=require('../config/transporter');
const fileSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    }
});

//post-middleware -> works just after saving instance in db
// should be created on schema and before creating model 
fileSchema.post(
    //just after the "save" action this post middleware is activated
    "save", 
    async function (doc){
        try{
            //doc -> entry that is created in db -> also has objectId
            console.log("Doc",doc);

            //transporter using nodemailer - created in config
            //create hostname , mail user , mail pass in env 
            
            //send mail
            let info=await transporter.sendMail({
                from:`kdwce2022@gmail.com`,
                to:doc.email,
                subject:"New file uploaded to cloudinary ",
                html:`<h1>Hello friend </h1> <p>File is uploaded to cloudinary !
                <a href="${doc.imageUrl}">View here ${doc.imageUrl}:</a> </p>`
            })
            console.log(info);
            

        }   
        catch(err){
            console.error(err);
        }
    }
)
 
const File = mongoose.model("File", fileSchema);
module.exports = File;