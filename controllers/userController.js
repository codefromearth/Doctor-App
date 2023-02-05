const userModel=require('../models/userModel')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const doctorModel = require('../models/doctorModel');
const appointmentModel = require('../models/appointmentModel');
const moment =require('moment')
const registerController=async(req,res)=>{
     try{
            const exisitingUser =await userModel.findOne({email:req.body.email})
            if(exisitingUser)
            {
               return res.status(200).send({message:'User Already Exist',success:false}) 
            }
            const password=req.body.password
            const salt=await bcrypt.genSalt(10)
            const hashedPassword=await bcrypt.hash(password,salt)
            req.body.password=hashedPassword
            const newUser=new userModel(req.body)
            await newUser.save()
            res.status(201).send({message:'register Successfully',success:true})


     }
     catch(error){
        
        res.status(500).send({success:false,message:`Register Controoler ${error.message}`})
     }

}
// login callback
const loginController=async(req,res)=>{
    try{
            const user=await userModel.findOne({email:req.body.email})
            if(!user)
            {
                return res.status(200).send({message:'user not found', success:false})
            }
            const isMatch=await bcrypt.compare(req.body.password,user.password)
            if(!isMatch)
            {
                return res.status(200).send({message:'Invalid Email or Password',success:false})
            }
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.status(200).send({message:'Login Success',success:true, token})
    }  
    catch(error){
        
        res.status(500).send({message:`error in login ${error.message} `})
    }

}

const authController= async(req,res)=>{
     try{
          const user=await userModel.findById({_id:req.body.userId})
          user.password=undefined
          if(!user){
            return res.status(200).send({
                message:'user not found',
                success:false
            })
          }
          else{
            res.status(200).send({
                success:true,
                data:user
            })
          }
     }
     catch(error){
         
         res.status(500).send({
            message:'auth error',
            success:false,
            error
         })
     }
}

const applyDocterController = async (req,res)=>{
  try{
      const newDoctor = await doctorModel({...req.body,status:'pending'})
      await newDoctor.save()
      const adminUser=await userModel.findOne({isAdmin:true})
      const notification= adminUser.notification
      notification.push({
        type:'apply-doctor-request',
        message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for doctor Account`,
        data:{
             doctorId: newDoctor._id,
             name: newDoctor.firstName +" "+ newDoctor.lastName,
             onClickPath:'/admin/doctors'
        }
      })
         await userModel.findByIdAndUpdate(adminUser._id,{notification})
         res.status(201).send({
            success:true,
            message:'Doctor Account Applied Successfully'
         })
  }catch(error){
    
    res.status(500).send({
        success:false,
        error,
        message:'Error While Applying For Docter'
    })

  }

};

//notification ctrl
const getAllNotificationController=async(req,res)=>{
try{
  const user=await userModel.findOne({_id:req.body.userId})
  
  const seennotification=user.seennotification
  const notification=user.notification
  seennotification.push(...notification)
  user.notification=[]
  user.seennotification=notification
  const updateduser=await user.save()
  res.status(200).send({
    success:true,
    message:`All notification marked as read`,
    data:updateduser,
  })

}catch(error)
{
  
  res.status(500).send({
    message:"Error in Notification",
    success:false,
    error
  })
}
}

const deleteAllNotificationController=async(req,res)=>{
 try{
       const user = await userModel.findOne({_id:req.body.userId})
       user.notification=[];
       user.seennotification=[];
       const updateduser=await user.save();
       updateduser.password=undefined;
       res.status(200).send({
        success:true,
        message:"notification deleted Successfully",
        data:updateduser
       })
 }catch{
  
  res.status(500).send({
    success:false,
    message:'unable to delete all notification',
    error
  })
 }
}

const getAllDoctorController=async(req,res)=>{
try{
  const doctors =await doctorModel.find({status:'approved'})
  res.status(200).send({
    success:true,
    message:'doctor list fetched Successfully',
    data:doctors
  })

}catch(error){
  
  res.status(500).send({
    success:false,
    error,
    message:'error while fetching data'
  })
}
}
//bbok appointment
const bookAppontmentController=async(req,res)=>{
  try{
    req.body.status='pending'
    req.body.date=moment(req.body.date,'DD-MM-YY').toISOString()
    req.body.time=moment(req.body.time,'HH:mm').toISOString()
    const newAppointment=new appointmentModel(req.body)
    await newAppointment.save()
    const user =await userModel.findOne({_id:req.body.doctorInfo.userId})
    user.notification.push({
      type:'new-appointment-request',
      message:`A new Appointment Request from ${req.body.userInfo.name}`,
      onClickPath:'/user/appointments'
    })
    await user.save();
    res.status(200).send({
      success:true,
      message:"Appointment Booked Successfully"
    })

  }catch(error){
    
    res.status(500).send({
      success:false,
      error,
      message:'Error while booking Appointment'
    })
  }
}

const bookingAvailabilityController=async(req,res)=>{
  try{
     const date=moment(req.body.date,'DD-MM-YY').toISOString()
     const fromTime=moment(req.body.time,'HH:mm').subtract(1,'hours').toISOString()
    const toTime=moment(req.body.time,'HH:mm').add(1,'hours').toISOString()
     const doctorId=req.body.doctorId
     const appointment =await appointment.find({
        doctorId,
        date,
        time:{
          $gte:fromTime , $lte:toTime
        }

     })
     if(appointment.length>0){
      return res.status(200).send({
        message:'Appointments not Avialible at this time',
        success:true
      })
     }
     else{
      return res.status(200).send({
        message:'Appointment  Available ',

      })
     }


  }
  catch(error)
  {
    
    res.status(500).send(
      {
        success:false,
        error,
        message:"Error in Booking"
      }
    )
  }

}

const userAppointmentController=async(req,res)=>{
  try{
    const appointments=await appointmentModel.find({
      userId:req.body.userId,
    });
    res.status(200).send({
      success:true,
      message:"User Appointment Fetch Successfully",
      data:appointments,
    })

  }catch(error){
    
    res.status(500).send({
      success:false,
      error,
      message:'Error In User Appointment'
    })
  }

}
module.exports={loginController,
  registerController,authController,
  applyDocterController,
  getAllNotificationController,
  deleteAllNotificationController,
getAllDoctorController,
bookAppontmentController,
bookingAvailabilityController,
userAppointmentController}