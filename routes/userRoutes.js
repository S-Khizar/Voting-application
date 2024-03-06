const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const{jwtAuthMiddleware,generateToken} = require('./../jwt');
const { message } = require('prompt');

//POST route to add a person
router.post('/signup',async(req,res)=>{
    try{
        const data = req.body; //Assuming the request body contains the person data


        //Create a new person document using the mongoose model
        const newUser = new User(data);

        //Save the new user to the databse 
        const response = await newUser.save();
        console.log('data saved');

        const payload ={
            id:response.id
        }
        console.log(JSON.stringify(payload))
        const token = generateToken(payload);
        console.log("Token is : ",token);

        res.status(200).json({response : response,token : token});
    }   catch(err){
        console.log(err);
        res.status(500).json({err : 'Internal server error'});
    }
})

router.post('/login',async(req,res)=>{
    try{
        //Extract aadhar card and password from request body
        const {aadharCardNumber , password} = req.body;

        //find the user by aadhar card number
        const user = await User.findOne({aadharCardNumber:aadharCardNumber});

        //if aadharCardNumber does not exist or password does not match , return error
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error : 'Invalid username or password'});
        }

        //generate token
        const payload = {
            id: user.id
        }
        const token = generateToken(payload);

        //return token as response
        res.json({token});


    }catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'});
    }
})

//profile route
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json(user);
    }catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal server error'});
    }
})




router.put('/profile/password',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userId = req.user.id;//Extract the id from token
        const {currentPassword,newPassword} =req.body// extract the new password from request body

        //Find the user by userId
        const user = await User.findById(userId);

        if( !(await user.comparePassword(currentPassword))){
            return res.status(401).json({error : 'Invalid username or password'});
        }

        //update the user's password
        user.password = newPassword;
        await user.save();
        console.log('password updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
    }
})

module.exports = router;