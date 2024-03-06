const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const User = require('../models/user')
const{jwtAuthMiddleware} = require('../jwt');
const { message } = require('prompt');

const checkAdminRole = async (userID)=>{ 
    try{
        const user = await User.findById(userID);
        return user && user.role === 'admin';
    }catch(err){
        return false;
    }
};

//POST route to add a candidate
router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try{
        if (!(await checkAdminRole(req.user.userData.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }
        
        const data = req.body; //Assuming the request body contains the Candidate data


        //Create a new Candidate document using the mongoose model
        const newCandidate = new Candidate(data);



        //Save the new Candidate to the databse 
        const response = await newCandidate.save();
        console.log('data saved');
        res.status(200).json({response : response});

    }   catch(err){
        console.log(err);
        res.status(500).json({err : 'Internal server error'});
    }
})
module.exports = router;

router.put('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message : 'user does not have admin role'});
        }
        const candidateID = req.params.candidateID;//Extract the id from URL parameter
        const updateCandidateData = req.body; //update data for emp

        const response = await Candidate.findByIdAndUpdate(candidateID,updateCandidateData,{
            new:true, //return the update document
            runValidators:true, //Run Mongoose validation
        });
        if(!response){
            return res.status(404).json({error:'Candidate not found'});
        }
        console.log('Candidate updated');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
    }
})

router.delete('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!checkAdminRole(req.user.id)){
            return res.status(403).json({message : 'user does not have admin role'});
        }
        const candidateID = req.params.candidateID;//Extract the id from URL parameter
        

        const response = await Candidate.findByIdAndDelete(candidateID);


        if(!response){
            return res.status(404).json({error:'Candidate not found'});
        }
        console.log('Candidate deleted');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
    }
})

module.exports = router;

