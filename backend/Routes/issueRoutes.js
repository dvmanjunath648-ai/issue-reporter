const express = require("express")
const router = express.Router()

const Issue = require("../models/Issue")

const multer = require("multer")


/* =========================
   MULTER CONFIG
========================= */

const storage = multer.diskStorage({

destination:"uploads/",

filename:(req,file,cb)=>{
cb(null, Date.now() + "-" + file.originalname)
}

})

const upload = multer({storage})


/* =========================
   CREATE ISSUE
========================= */

router.post("/", upload.single("photo"), async(req,res)=>{

try{

const {title,description,location,category,priority} = req.body

const issue = new Issue({

title,
description,
location,
category,
priority,
photo: req.file ? req.file.filename : null,
status:"open",
votes:0

})

await issue.save()

res.json({message:"Issue reported successfully"})

}catch(err){

res.status(500).json({message:"Issue creation failed"})

}

})


/* =========================
   GET ALL ISSUES
========================= */

router.get("/", async(req,res)=>{

try{

const issues = await Issue.find().sort({createdAt:-1})

res.json(issues)

}catch(err){

res.status(500).json({message:"Failed to fetch issues"})

}

})


/* =========================
   ISSUE STATS
========================= */


router.get("/stats/summary", async(req,res)=>{

const total = await Issue.countDocuments()
const open = await Issue.countDocuments({status:"open"})
const resolved = await Issue.countDocuments({status:"resolved"})

res.json({
total,
open,
resolved
})

})
/* =========================
   VOTE ISSUE
========================= */

router.put("/vote/:id", async(req,res)=>{

try{

const issue = await Issue.findById(req.params.id)

issue.votes += 1

await issue.save()

res.json(issue)

}catch(err){

res.status(500).json({message:"Vote failed"})

}

})


/* =========================
   UPDATE ISSUE
========================= */

router.put("/:id", async(req,res)=>{

try{

await Issue.findByIdAndUpdate(req.params.id, req.body)

res.json({message:"Issue updated"})

}catch(err){

res.status(500).json({message:"Update failed"})

}

})
router.put("/:id",async(req,res)=>{

const issue = await Issue.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
)

req.app.get("io").emit("issueUpdated",issue)

res.json(issue)

})


/* =========================
   DELETE ISSUE
========================= */

router.delete("/:id", async(req,res)=>{

try{

await Issue.findByIdAndDelete(req.params.id)

res.json({message:"Issue deleted"})

}catch(err){

res.status(500).json({message:"Delete failed"})

}

})


module.exports = router