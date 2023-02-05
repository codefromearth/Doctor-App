const mongoose=require('mongoose')
const colors=require('colors')
mongoose.set('strictQuery', true)

const connectDB=async()=>{
    try{
await mongoose.connect(process.env.DB_URL)
console.log(`MongoDb Connected ${mongoose.connection.host}`.bgGreen.white)
    }
    catch(error){
          
    }
}
module.exports=connectDB;