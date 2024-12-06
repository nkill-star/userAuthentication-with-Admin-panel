const express=require('express')
const router=express.Router()
const userContoller=require('../controller/userController')
const auth=require('../middileware/auth')


router.get('/login',auth.isLogin,userContoller.loadLogin)
router.post('/login',userContoller.login)

router.get('/register',auth.isLogin,userContoller.loadRegister)

router.post('/register',userContoller.registerUser)

router.get('/userHome',auth.checkSession,userContoller.loadHome)
router.get('/logout',auth.checkSession,userContoller.logout)

module.exports=router