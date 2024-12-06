const express=require('express')
const app=express()
const userRoutes=require('./routes/user')
const adminRoutes=require('./routes/admin')
const path=require('path')
const hbs=require('hbs')
const connectDB = require('./db/connectDB')
const session=require('express-session')
const nocache=require('nocache')

app.use(nocache())
app.use(session({
    secret:'mysecretkey',
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge:1000*60*60*24
    }
}))  

app.set('views',path.join(__dirname,'views')); //view setup and configuring the path
app.set('view engine','hbs');

app.use(express.static('public')); //static file setting

app.use(express.urlencoded({extended:true}))
app.use(express.json())  

app.use('/user',userRoutes)
app.use('/admin',adminRoutes)

connectDB();

app.listen(5000,()=>{  
    console.log('Server started on port 5000 ')   
})  