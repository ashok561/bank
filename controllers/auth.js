const errorResponse =  require('../utils/errorResponse')
const User = require('../models/User')

exports.register = async(req,res,next)=>{
    const {name,account_no,amount,password,role} =  req.body;
    
    const account = await User.findOne({account_no});
   
    if(account){
        return  next(new errorResponse(`Account number already exist`, 404));
    }
    const user = await User.create({
        name,
        account_no,
        password,
        amount,
        role
    })

    sendTokenResponse(user,200,res);
}

exports.login =  async(req,res,next)=>{
    const { account_no,password} =  req.body;
 
    if(!account_no || !password){
       
        return next(new errorResponse('please fill all the field', 400));
    }

    const user =await User.findOne({account_no}).select('+password');
  
    if(!user){
       
        return next(new errorResponse('user not found', 400));
    }
    const isMatch = await user.matchPassword(password);
    if(!isMatch){
        
        return next(new errorResponse('invalid credential', 401));
    }
    sendTokenResponse(user,200,res);
}

exports.getme = async(req,res,next)=>{
    console.log('hi');
    console.log(req.user.id);
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user
    })
}

exports.getamount = async(req,res,next)=>{
    const user = await User.findOne({account_no:req.params.id});
    res.status(200).json({
        success:true,
        data:user
    })
}

const sendTokenResponse = (user,statusCode,res)=>{
   
    const token = user.getSignedJwtToken();
    const options ={
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE *24 * 60 * 60 * 1000),
        httpOnly: true

    }
    if(process.env.NODE_ENV == 'production'){
       options.secure = true;
    }
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token
    })
}
