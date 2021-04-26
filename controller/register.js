const express = require("express")
const path = require('path')
const User = require("../models/userSchema")
const valid = require("../middleware/validId")
const auth = require("../middleware/auth")
const admin = require("../middleware/admin")
const {body,validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const multer = require('multer')
const {nodemailer} = require('../helper/index')
const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        console.log(file);
        cb(null,  file.originalname);
    }
})
 const fileFilter = (req, file, cb) => {
     if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
         cb(null, true);
     } else {
         cb(null, false);
     }
 }

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*5
    },
   // fileFilter:fileFilter
})

const validator=(req,res,next)=>{
    body("name").isString().isLength({min:4,max:50}),
    body("email").isEmail().isLength({min:11,max:50}).isLowercase(),
    body("password").isString().isLength({min:6,max:20}),
    body("cpassword").isString().isLength({min:6,max:20}),
    body("department").isString().isLength({min:4,max:20}),
    body("phone").isNumeric().isMobilePhone(),
    body("roles").isAlpha()
    next()
}

 router.post("/register",upload.single('photo'),validator, async(req,res)=>{
    // if(Object.keys(req.body).length!==7)
    // return res.status(500).json('Failed')
 
    const error = validationResult(req)
    if(!error.isEmpty())
    return res.status(422).json({message:error.message})
   
    let user = await User.findOne({email:req.body.email})
    if(user){
    res.status(400).json('Access denied')
    } else{
        try {
                const photo = req.file.path
                console.log(req.file)
                const password=req.body.password
                const cpassword= req.body.cpassword
                const roles = req.body.roles
                if(password===cpassword){
                let user = new User({
                    name:req.body.name,
                    email:req.body.email,
                    photo:photo,
                    password:password,
                    cpassword:cpassword,
                    phone:req.body.phone,
                    department:req.body.department,
                    roles:roles
                }) 
            const salt = await bcrypt.genSalt(15)
            user.password = await bcrypt.hash(user.password,salt)
            user.cpassword = await bcrypt.hash(user.cpassword,salt)
            await user.save()
            
             let token = await jwt.sign({_id:user._id,roles:user.roles},process.env.accessTokenKey)
             res.header("x-api-key",token)
            .header("access-control-expose-headers","x-api-key")
            .status(201).json(user)
            }
              else{
            res.status(400).json('Access denied')
        }
       
        } catch (error) {
            res.status(422).json({message:error.message})
        }
    }

})

router.put("/update/:_id",upload.single('photo'), validator, [valid], async(req,res)=>{
    const error = validationResult(req)
    if(!error.isEmpty()){
     res.status(422).json({message:error.message})
    } else{
        try {
            if(req.file){
                const user = await User.findByIdAndUpdate(req.params._id,{
                    name:req.body.name,
                    email:req.body.email,
                    phone:req.body.phone,
                    photo:req.file.path,
                    department:req.body.department,
                },{new:true})
                await user.save()
                res.status(200).json(user) 
            } else{
                const user = await User.findByIdAndUpdate(req.params._id,{
                    name:req.body.name,
                    email:req.body.email,
                    phone:req.body.phone,
                    department:req.body.department,
                },{new:true})
                await user.save()
                res.status(200).json(user) 
            }
         
        } catch (error) {
            res.status(422).json({message:error.message})
        }
    }
       
})

router.post("/login",[
    body("email").isEmail().isLength({min:11,max:50}).isLowercase(),
    body("password").isString().isLength({min:6,max:20}),
], async(req,res)=>{
    if(Object.keys(req.body).length!==2)
    return res.status(500).json('Failed')
    const error = validationResult(req)
    if(!error.isEmpty())
    return res.status(422).json({message:error.message})

    let user = await User.findOne({email:req.body.email})
    if(!user){
    res.status(400).json('Access denied')
    } else{
        try {
          const isMatch = await bcrypt.compare(req.body.password,user.password)
          if(!isMatch) return res.status(401).json('Unauthorized')
          let token = await jwt.sign({_id:user._id,roles:user.roles},process.env.accessTokenKey)
         res.status(201).json({_id:user._id,roles:user.roles,token})
        } catch (error) {
            res.status(422).json({message:error.message})
        }
    }

})

router.delete("/remove/:_id",[valid,auth,admin],async(req,res)=>{
 try {
    let user = await User.findByIdAndDelete({_id:req.params._id})
    if(user){
        res.status(200).json('user deleted !')
    } else{
        res.status(400).json('user not found')
    }
 } catch (error) {
     res.json({message:error.message})
 }
})

router.put("/forgot",async(req,res)=>{
    try {
    const {email} = req.body
    const user = await User.findOne({email:email})
    if(!user){
        return res.status(400).json({
            message:'Email is wrong'
        })
    }
    const token = await jwt.sign({_id:user._id,roles:user.roles},process.env.accessTokenKey,{expiresIn: '1d'})
    await user.updateOne({resetPasswordLink : token})

    const templateEmail ={
        from:'shivam190445@gmail.com',
        to:email,
        subject:'link reset password',
        html:`<p> click link </p> <p>${process.env.CLINT_URL}/resetpassword/${token}</p> `
    }
    nodemailer(templateEmail)
    return res.status(200).json({message:req.body.email})
    } catch (error) {
        res.status.json({message:error.message})
    } 
})

router.put('/resetpassword',async(req,res)=>{
    try {
        const {token,password} = req.body
        const user =  await User.findOne({resetPasswordLink:token})
        console.log(user)
        if(user){
            const hashPassword = await bcrypt.hash(password,15)
            user.password = hashPassword
            await user.save()
            return res.status(200).json(user)
        }
    } catch (error) {
        res.status(422).json({message:error.message})
    }
})

router.get("/users",auth,async(req,res)=>{
    try {
        const user = await User.find({}).select('-password -cpassword  -__v -created_at')
        res.status(200).json(user)
    } catch (error) {
        res.status(422).json({message:error.message})
    }
  
})


router.get("/users/:_id" ,auth,async(req,res)=>{
    try {
        const user = await User.findById({_id:req.params._id}).select('-password -cpassword -__v -created_at -record')
        res.status(200).json(user)
    } catch (error) {
        res.status(422).json({message:error.message})
    }
  
})

router.get("/search",async(req,res)=>{
    try {
        let searchName=req.query.name
        let searchEmail = req.query.email
        let searchDept = req.query.department
        let search = await User.find({'$or':[
            {name:{$regex:`${searchName}`,$option:'i'}},
            {email:{$regex:`${searchEmail}`,$option:'i'}},
            {department:{$regex:`${searchDept}`,$option:'i'}}
        ]}) 
        res.status(200).json(search)
    } catch (error) {
        res.status(422).json({message:error.message})
    }
})


module.exports = router