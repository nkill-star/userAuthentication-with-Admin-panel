const userSchema=require('../model/userModel')
const bcrypt=require('bcryptjs')
const saltround=10

const registerUser=async(req,res)=>{

    try {
        const {email,password}=req.body

        const user=await userSchema.findOne({email}) // finding existing user
        if(user) return res.render('user/login',{message: 'user already exist'}) // if user already exist printing message user already exist

        const hashedPassword= await bcrypt.hash(password,saltround)

        const newUser=new userSchema({
            email,
            password:hashedPassword
        })

        await newUser.save() // saving new user

        res.render('user/login',{message:'user created successfully'})
        


    } catch (error) {
        res.render('user/register',{message: 'Something went wrong'})
        
    }
}

const logout=(req,res)=>{

    req.session.user=null
    res.redirect('/user/login')
}

const login = async (req, res) => { // Add 'async' here
    try {
      const { email, password } = req.body;
  
      // Check if the user exists
      const user = await userSchema.findOne({ email }); // 'await' for asynchronous operation
      if (!user) {
        return res.render('user/login', { message: 'User does not exist' });
      }
  
      // Check if the password is correct by decrypting the password and using the compare method in bcrypt
      const isMatch = await bcrypt.compare(password,user.password)
      if (!isMatch) {
        return res.render('user/login', { message: 'Incorrect password' });
      }
      req.session.user=true
  
      // Successful login
      res.render('user/userHome', { message: 'Login Successfull' });
  
    } catch (error) {
      
    }
  };
  

const loadRegister=(req,res)=>{
    res.render('user/register')
}

const loadLogin=(req,res)=>{
    res.render('user/login')
}

const loadHome=(req,res)=>{
    res.render('user/userHome')
}

module.exports={registerUser,loadRegister,loadLogin,login,loadHome,logout}
