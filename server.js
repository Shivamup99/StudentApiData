
const express = require('express')
const cors = require('cors')
const app = express();
 app.use(cors());
 const error = require("./middleware/error")
const multer = require('multer')
const path=require('path')


require('./models/db')
require("express-async-errors")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const port = process.env.PORT || 8080
const user = require("./controller/register")
const record = require("./controller/user")
const course = require("./controller/course")

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())

app.use(cookieParser())
app.use('/api/user',user)
app.use('/api/user/data',record)
app.use('/api/user/course',course)
//app.use(express.static('public'))
//app.use(error)
//app.use('/uploads', express.static('public'));
app.use(express.static(__dirname + '/public'));
//app.use('/profile', express.static('upload/images'));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
 
//  app.get('/*', (req, res) => {
//      res.sendFile(path.join(__dirname + '/public/uploads'));
//  });

// function errHandler(err, req, res, next) {
//     if (err instanceof multer.MulterError) {
//         res.json({
        //     success: 0,
       //      message: err.message
     //    })
   //  }
 //}
 //app.use(errHandler)

 if(process.env.NODE_ENV=="production"){
     app.use(express.static("client/build"))
      app.get("*",(req,res)=>{
          res.sendFile(path.resolve(__dirname ,'client','build','index.html'))
      })
 }



app.listen(port ,()=>{
    console.log(`Server is running on ${port} number`)
})

