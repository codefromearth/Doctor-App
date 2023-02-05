const express=require('express')
const { loginController, registerController, authController, applyDocterController,getAllNotificationController,deleteAllNotificationController, getAllDoctorController, bookAppontmentController, bookingAvailabilityController, userAppointmentController } = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

const router=express.Router()


router.post('/login',loginController)
router.post('/register',registerController)
//Auth || Post

router.post('/getUserData',authMiddleware, authController)
router.post('/apply-doctor',authMiddleware, applyDocterController)
router.post('/get-all-notification',authMiddleware, getAllNotificationController)

router.post('/delete-all-notification',authMiddleware, deleteAllNotificationController)

//get All Doc
router.get('/getAllDoctor',authMiddleware,getAllDoctorController)

router.post('/book-appointment',authMiddleware,bookAppontmentController)
router.post("/booking-availability",authMiddleware,bookingAvailabilityController)


//appointment List

router.get('/user-appointment',authMiddleware,userAppointmentController)
module.exports=router

