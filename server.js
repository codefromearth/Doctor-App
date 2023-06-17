const express=require('express')
const colors=require('colors')
const morgan=require('morgan')
const dotenv=require('dotenv')
const connectDB = require('./config/db')
const path=require('path')
dotenv.config()
const app=express()
var cors = require('cors')


const userRoutes=require('./routes/userRoutes')
//mongodb connection
connectDB()
//middleware
app.use(express.json())
app.use(morgan("dev"))
app.use(cors())

//routes
app.get('/',(req,res)=>{
    res.send("welcome")
})

app.use('/api/v1/user',userRoutes)
app.use('/api/v1/admin',require('./routes/adminRoute'))
app.use('/api/v1/doctor',require("./routes/doctorRoute"))



app.use(express.static(path.join(__dirname,'./client/build')))

app.get("*", function(req,res){
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
})


const port=process.env.PORT || 8080
app.listen(port,()=>{

})
