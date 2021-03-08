const errorResponse =  require('../utils/errorResponse');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.getTransactions = async (req,res,next)=>{
       let query;
       //copy req.query
        const reqQuery = { ...req.query };

        //fields to exclude
        const removeFields = ['select','sort','page','limit'];

        //loop over removeFields and delete from them reqQuery
        removeFields.forEach( params => delete reqQuery[params]);
       
        //create query string
        let queryStr = JSON.stringify(reqQuery);


       //create operator $gt
         queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);
       
         //finding resource
        query = Transaction.find(JSON.parse(queryStr));
      
        //select Fields
        if(req.query.select){
                const fields = req.query.select.split(',').join(' ');
                query = query.select(fields);
        }

        //sort Field
        if(req.query.sort){
                const sortBy =  req.query.sort.split(',').join(' ');
                query = query.sort(sortBy);
        }else{
                query = query.sort('-createdAt');
        }

        const page = parseInt(req.query.page, 10) || 1;
        const limit =  parseInt(req.query.limit, 10) || 10;
        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        const total =await Transaction.countDocuments();

        query = query.skip(startIndex).limit(limit);
        
        //executive query
        const transaction = await query;

        //pagination 
        const pagination = {};
        if(endIndex < total){
                pagination.next = {
                 page: page + 1,
                limit
        }
        }
        if(startIndex > 0){
                pagination.prev = {
                page:page - 1,
                limit
                }
        }

        res.status(200).json({success:true, count:transaction.length,pagination, data:transaction})
   
}

exports.getTransaction = async (req,res,next)=>{
        const transaction = await Transaction.findById(req.params.id);
        if(!transaction){
          return  next(new errorResponse(`Transaction not found with id ${req.params.id}`, 404));
        }
        res.status(200).json({success:true, data:transaction});  
}

exports.getTransactionHistory = async (req,res,next)=>{

        let transaction = await Transaction.find({sender_account_no:req.params.id});       
        
        res.status(200).json({success:true, data:transaction});  
}



exports.createTransaction = async (req,res,next)=>{
        
        req.body.user  = req.user.id;
        req.body.sender_account_no = req.user.account_no;
               
        const tran = await User.findOne({account_no: req.body.receiver_account_no});

        if(!tran){
                return  next(new errorResponse(`Invalid account no`, 404));
        }

        const user =  await User.findOne({_id:req.user.id});
        
        if(user){
                
                if(user.amount >  req.body.amount){
                       const subtract = parseInt(user.amount) - parseInt(req.body.amount);
                      
                        const senderaccount = await User.findByIdAndUpdate(req.user.id,{amount:subtract},
                                {new:true, runValidators: true});   

                                if(senderaccount){
                                        const userrec =  await User.findOne({_id:tran._id});
                                       
                                         const add = parseInt(userrec.amount) + parseInt(req.body.amount);
                                         
                                        const receiveraccount = await User.findByIdAndUpdate(tran._id,{amount:add},
                                                {new:true, runValidators: true});            
                                }
                                const transcation = await Transaction.create(req.body);
                                res.status(201).json({success:true, data:transcation})  
                }else{
                        return  next(new errorResponse(`Insuffient amount with sender id `, 401));    
                }
        }

         
}

exports.updateTransaction = async (req,res,next)=>{
 
        const transaction = await Transaction.findByIdAndUpdate(req.params.id,req.body,
            {new:true, runValidators: true});
        if(!transaction){
            return  next(new errorResponse(`Transaction not found with id ${req.params.id}`, 404));
        }
        res.status(200).json({success:true, data:transaction})
}


exports.deleteTransaction = async (req,res,next)=>{
        const transaction = await Transaction.findById(req.params.id);
        if(!transaction){
            return  next(new errorResponse(`Transaction not found with id ${req.params.id}`, 404));
        }

        transaction.remove();
        res.status(200).json({success:true, data:{}})
    
}


