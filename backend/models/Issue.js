const mongoose = require("mongoose")

const IssueSchema = new mongoose.Schema({

title:{
type:String,
required:true
},

description:{
type:String,
required:true
},

location:{
type:String,
required:true
},

category:{
type:String,
default:"General"
},

priority:{
type:String,
default:"Medium"
},

photo:{
type:String
},

status:{
type:String,
default:"open"
},

votes:{
type:Number,
default:0
},

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Issue", IssueSchema)