const express=require('express')
const { getDocterInfoController, updateProfileController, getDoctorIdController, doctorAppointmentController, updateStatusController } = require('../controllers/doctorController')
const authMiddleware = require('../middlewares/authMiddleware')
const router=express.Router()

//post single doc info

router.post('/getDocterInfo',authMiddleware,getDocterInfoController)
router.post('/updateProfile',authMiddleware,updateProfileController)
//post single doc info
router.post('/getDoctorById',authMiddleware,getDoctorIdController)

router.get('/doctor-appointment',authMiddleware,doctorAppointmentController)

router.post('/update-status',authMiddleware,updateStatusController)
module.exports=router;