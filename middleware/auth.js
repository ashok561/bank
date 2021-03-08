const jwt = require('jsonwebtoken');
const errorResponse =  require('../utils/errorResponse')
const User = require('../models/User')

exports.protect =  async (req,res,next)=>{
    console.log('hii');
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }
    
    if(!token){
        return next(new errorResponse('not authorise user access', 401))
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
        req.user = await User.findById(decoded.id);
        next();
    }catch(err){
        return next(new errorResponse('not authorise user access', 401))
    }
}

exports.authorize = (...roles)=>{
  
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
                new errorResponse(`user role ${req.user.role} is unauthorized`, 403)
                )
        };
        next();
    }
}