const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const User = require('../models/user')
const{jwtAuthMiddleware} = require('../jwt');
const { message } = require('prompt');

const checkAdminRole = async (userID)=>{ 
    try{
        const user = await User.findById(userID);
        return user && user.role == 'admin';
    }catch(err){
        return false;
    }
};

//POST route to add a candidate
router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try{
        if (!(await checkAdminRole(req.user.id))) {
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
        
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
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
        
        if (!(await checkAdminRole(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
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

//let's start voting
router.post('/vote/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    //no admin can vote
    //user can only vote one
    candidateID = req.params.candidateID;
    console.log(req.params.candidateID);
    userID = req.user.id;
    try{
        //Find the Candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({message : 'Candidate not found'});
        }

        const user = await User.findById(userID);
        if(!user){
            return res.status(404).json({message : 'User not found'});
        }
        if(user.isVoted){
             res.status(400).json({message : 'You have already voted'});
        }
        if(user.role == 'admin'){
            res.status(403).json({message : 'admin is not allowed'});
        }
        //update the candidate document to record the vote
        candidate.votes.push({user : userID});
        candidate.voteCount++;
        await candidate.save();

        //update the user document
        user.isVoted = true;
        await user.save();
        
        res.status(200).json({message : 'Vote recorded succesfully'});



    }catch(err){
        console.log(err);
        res.status(500).json({err : 'Internal server error'});
    }
});

//vote  count
router.get('/vote/count',async (req,res)=>{
    try{
        //Find all candidate and sort them by vote count in descending order
    const candidate = await Candidate.find().sort({voteCount : 'desc'});

    //Map the candidate to only return their names and vote count
    const voteRecord = candidate.map((data)=>{
        return{
            name : data.name,
            party: data.party,
            count : data.voteCount
        }
    });
    return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({err : 'Internal server error'});
    }
})

module.exports = router;

