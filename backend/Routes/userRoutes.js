const express = require("express")
const router = express.Router()

const User = require("../models/User")


/* =========================
   REGISTER USER
========================= */

router.post("/register", async (req,res)=>{

try{

const {name,email,password} = req.body

const existingUser = await User.findOne({email})

if(existingUser){
return res.json({message:"User already exists"})
}

const user = new User({
name,
email,
password
})

await user.save()

res.json({
message:"Registration successful",
user
})

}catch(err){

res.status(500).json({message:"Registration failed"})

}

})


/* =========================
   LOGIN USER
========================= */

router.post("/login", async (req,res)=>{

try{

const {email,password} = req.body

const user = await User.findOne({email,password})

if(!user){
return res.json({message:"Invalid credentials"})
}

res.json({
message:"Login successful",
user
})

}catch(err){

res.status(500).json({message:"Login failed"})

}

})


module.exports = router