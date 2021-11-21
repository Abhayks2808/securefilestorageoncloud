require("dotenv").config();
const express=require("express");
const mullter=require("multer");
const ejs=require("ejs");
const multer = require("multer");
const fs=require("fs");
const crypto=require("crypto");
const path=require("path");
const cloudinary=require("cloudinary");
//set storage engine

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/Uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now().toString())
    }
  })
  
  var upload = multer({ storage: storage })
  

const encrypt = (buffer) => {
  // More info: https://nodejs.org/api/crypto.html
  const algorithm = 'aes-256-ctr';
  const iv = crypto.randomBytes(16);
  const key = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'

  const cipher = crypto.createCipheriv(algorithm, key, iv)
  return Buffer.concat([cipher.update(buffer), cipher.final()])
}

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.API_KEY,
  api_secret:process.env.API_SECRET
})

// Init app
const app=express();

//EJS
app.set('view engine','ejs');

//public 
app.use(express.static('./public'));

app.get("/",(req,res) =>{
    res.render("index");
});
app.post('/upload', upload.single('myfile'), async({file}, res, next) => {
  try{
    const result=await cloudinary.v2.uploader.upload(file.path,{ resource_type: 'auto' });
    const post_details={
      file:result.public_id
    }
    res.status(200).json({post_details});
  }
  catch(err){
    console.log(err);
  }
   })

const port=3000;

app.listen(port,() => {
    console.log(`server is started on port ${port}`)
})