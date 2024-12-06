const express=require('express')
const router=express.Router()
const adminController=require('../controller/adminController')
const adminAuth=require('../middileware/adminAuth')


router.get('/login',adminAuth.isLogin,adminController.loadLogin)
router.post('/login',adminController.Login)
router.get('/dashboard',adminAuth.checkSession,adminController.loadDashboard)



router.post("/edituser", adminAuth.checkSession, adminController.edituser)

router.get("/deleteuser/:id", adminAuth.checkSession, adminController.deleteuser)

router.post("/adduser", adminAuth.checkSession, adminController.adduser)

router.get("/logout", adminAuth.checkSession, adminController.logout);

module.exports=router 