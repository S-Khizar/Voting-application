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
userSchema.pre('save',async function(next){
    const User =this;

    //Hash the password only if it has been modified (or is new)
    if(!User.isModified('password')) return next();

    try{
         //hash password generation
         const salt = await bcrypt.genSalt(10);

         //hash passowrd
         const hashPassword = await bcrypt.hash(User.password,salt);
         User.password = hashPassword;
         next();
    }catch(err){
         return next(err);

    }
})

userSchema.methods.comparePassword = async function(candidatePassword){
    try{
         const isMatch = await bcrypt.compare(candidatePassword,this.password);
         return isMatch;
    }catch(err){
         throw err;
    }
}

const User =mongoose.model('User',userSchema);
module.exports=User;