const mongoose=require('mongoose');
// const bcrypt = require('bcrypt');


//Define the userSchema
const userSchema = new  mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required : true
    },
    email : {
        type:String
    },
    mobile : {
        type:String
    },
    address :{
        type:String,
        required : true
    },
    aadharCardNumber : {
        type : Number,
        require : true,
        unique : true
    },
    password :{
        type:String
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default : 'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
});


const User =mongoose.model('User',userSchema);
module.exports=User;