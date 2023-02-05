const appointmentModel = require("../models/appointmentModel")
const doctorModel = require("../models/doctorModel")
const userModel = require("../models/userModel")

const getDocterInfoController=async(req,res)=>{
try{
    const doctor=await doctorModel.findOne({userId:req.body.userId})
    res.status(200).send({
        success:true,
        message:'doctor data fetch Success',
        data:doctor
    })
}catch(error){

}
}
const updateProfileController=async(req,res)=>{
    try{
        const doctor=await doctorModel.findOneAndUpdate(
            {userId:req.body.userId},
            req.body
        );
        res.status(201).send({
            success:true,
            message:'Doctor profile Updated',
            data:doctor,
        })

    }catch{
        
        res.status(500).send({
            success:false,
            message:'Doctor profile Update Issue',
            error

        })
    }

}

const getDoctorIdController=async(req,res)=>{
  try{
        const doctor=await doctorModel.findOne({_id:req.body.doctorId})
        res.status(200).send({
           success:true,
           message:' in single Doctor Info fetched',
           data:doctor

        })

  }catch(error){

res.status(500).send({
    success:false,
    error,
    message:'error in single Doctor Info'
})
  }
}
const doctorAppointmentController=async(req,res)=>{
    try{
           id=req.body.userId
           if(id===null){
            res.status(200).send({
            success:true,
            message:'Doctor Appointment fetch Successfully',
            data:null,
        })
           }
        const doctor=await doctorModel.findOne({userId:id});
        
            
        const appointment=await appointmentModel.find({
            doctorId:doctor._id,
        })
        res.status(200).send({
            success:true,
            message:'Doctor Appointment fetch Successfully',
            data:appointment,
        })
    }catch(error){
        
        res.status(500).send({
            success:false,
            error,
            message:'Error in Doc Appointment'
        })
    }
}

const updateStatusController=async(req,res)=>{
    try{
          const {appointmentsId,status}=req.body;
          const appointments=await appointmentModel.findByIdAndUpdate(
            appointmentsId,
            {status}
          );
          const user=await userModel.findOne({_id:appointments.userId});
          user.notification.push({
            type:"status-updated",
            message:`your appointment has been updated ${status}`,
            onClickpath:"/doctor-appointments"
          })
          await user.save();
          res.status(200).send({
            success:true,
            message:"Appointment Status Updated"
          })

    }catch(error){
        
        res.status(500).send({
            success:false,
            error,
            message:"Error in Update Status"
        })
    }

}
module.exports={getDocterInfoController,
    updateProfileController,
    getDoctorIdController,
    doctorAppointmentController,
    updateStatusController
}