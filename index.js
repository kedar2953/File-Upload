const express=require('express')
const app=express();
require('dotenv').config();
const PORT=process.env.PORT || 5000;

app.use(express.json());
const fileupload=require('express-fileupload') //express middlewrare to upload file
app.use(fileupload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

//cloudinary - to upload files on cloundinary
//express-fileupload - to upload on local sever 

require('./config/database').connectDB();
require('./config/cloudinary').cloudinaryConnect();

const Upload=require('./Routes/FileUpload')
app.use('/api/v1/upload',Upload);

app.listen(PORT,()=>{
    console.log(`Server is listening on ${PORT}`);
})

