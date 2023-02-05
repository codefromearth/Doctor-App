const express=require('express')
const { getAllUsersController, getAllDoctorsController,changeStatusController } = require('../controllers/adminController')
const router =express.Router()
const authMiddleware = require('../middlewares/authMiddleware')


router.get('/getAllUsers',authMiddleware,getAllUsersController)

router.get('/getAllDocters',authMiddleware,getAllDoctorsController)
router.get('/getAllDocters',authMiddleware,getAllDoctorsController)
//podt account status
router.post('/changeAccountStatus',authMiddleware,changeStatusController)

module.exports=router