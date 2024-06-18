const File = require("../Models/File");
const cloudinary=require("cloudinary").v2;

//localfileupload -> handler function
exports.localFileUpload = async (req, res) => {
    try {

        //fetch file from request
        const file = req.files.file;
        //when hitting req -> in body->form-data-> create field 'file' 
        console.log("We got the file -> ",file);


        //create path where file need to be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        // when we print 'file' -> it has 'name' attribute in that e.g ebdcni_1.jpg -> we split this with '.' and get 1st ind that is extension of file 

        console.log("PATH -> ", path)

        //add path to the move fucntion
        // path here is ,path to server where we want to upload file 
        file.mv(path , (err) => {
            console.log(err);
        });
                                                            
        //create a successful response
        res.json({
            success:true,
            message:'Local File Uploaded Successfully',
        });

    }
    catch(error) {
        console.log("Not able to upload the file on server");
        console.log(error);
    }
}



// <----------------------Cloudinary upload-------------------------------> //
function isFileTypeSupported(type, supportedTypes) {
    return supportedTypes.includes(type);
}

//fetch data from req
//do validation 
//upload to cloudinary
//save in db
//return response

async function uploadFileToCloudinary(file, folder,quality) {
    const options = {folder};
    //whenever we are uploading to cloudinary , on server temp folder is created before putting it on media server
    //once it is put on media server , temp folder is deleted
    console.log("temp file path", file.tempFilePath );

    if(quality) {
        options.quality = quality;
    }
    //quality is number denoting quality of image
    options.resource_type = "auto"; //automatically detecting the resource file type
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}


//image upload  handler
exports.imageUpload = async (req, res) => {
    try{
        //data fetch
        const { name, tags, email} = req.body;
        console.log("name is ",name);

        const file = req.files.imageFile;
        console.log(file);

        //Validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type:", fileType);

        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success:false,
                message:'File format not supported',
            })
        }

        
        console.log("Uploading to Codehelp");
        const response = await uploadFileToCloudinary(file, "Codehelp");
        console.log(response);

        //db entry is saved
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Image Successfully Uploaded',
        })
    }
    catch(error) {
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        });

    }
}
exports.videoUpload=async(req,res)=>{
    try{
        const {name,email,desc}=req.body;
        const video=req.files.videoFile;
        const fileType=video.name.split('.')[1].toLowerCase();
        console.log("File type is ",fileType);
        const supportedTypes=["mp4","mov"];
        
        //adding upper limit of 5mb on video upload     
        if(!isFileTypeSupported(fileType,supportedTypes))
        {
            return res.status(400).json({
                success:false,
                message:"File format not supported"
            })
        }
        console.log("Uploading to cloudinary ");
        const response=await uploadFileToCloudinary(video,"Codehelp");
        console.log(response);

        //db entry is saved
        const fileData = await File.create({
            name,
            desc,
            email,
            videoUrl:response.secure_url,
        });

        res.json({
            success:true,
            videoUrl:response.secure_url,
            message:'video Successfully Uploaded',
        })
        

    }
    catch(err){
        console.error(err);
        console.log("erorrrr");
    }
}

//compress the file before uploading to cloudinary
exports.imageReducerUpload=async(req,res)=>{
    try{
        //data fetch
        const { name, tags, email} = req.body;
        console.log(name,tags,email);

        const file = req.files.imageFile;
        console.log(file);

        //Validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type:", fileType);

        if(!isFileTypeSupported(fileType, supportedTypes)) {
            return res.status(400).json({
                success:false,
                message:'File format not supported',
            })
        }

        
        console.log("Uploading to Codehelp");
        const response = await uploadFileToCloudinary(file, "Codehelp",10);
        console.log(response);

        //db entry is saved
        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        });

        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:'Image Successfully Uploaded',
        })
    }
    catch(error) {
        console.error(error);
        res.status(400).json({
            success:false,
            message:'Something went wrong',
        });

    }
}

//pre-middleware -> doing work just before saving data in db
//post-middleware -> doing work just after saving data in db


//create post-middleware -> created on schema (model files)
//define middleware before creating model from schema
    //import nodemailer
    //create transporter
    //use its .sendMail() method of transporter
    