const express = require("express")
const cors = require("cors")
const path = require("path")

const connectDB = require("./db")

const userRoutes = require("./routes/userRoutes")
const issueRoutes = require("./routes/issueRoutes")

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

/* SHOW UPLOADED IMAGES */
app.use("/uploads", express.static(path.join(__dirname,"uploads")))

app.use("/users", userRoutes)
app.use("/issues", issueRoutes)

app.listen(5001, () => {

console.log("Server running on port 5001")

})