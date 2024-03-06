const mongoose = require('mongoose');
require('dotenv').config();
const mongoURL = process.env.MONGODB_URL_LOCAL;
// const mongoURL = process.env.MONGODB_URL;

// mongoose.connect(mongoURL)
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log('MongoDB connection error:', err));

mongoose.connect(mongoURL);

// mongoose.connect(mongoURL,{
//     useNewUrlParser :true,
//     useUnifiedTopology:true 
// })

const db = mongoose.connection;

db.on('connected',()=>{
    console.log('Connected to MongoDB server');
});

db.on('error',(err)=>{
    console.log('MongoDB connection error');
});
db.on('disconnected',()=>{
    console.log('MongoDB disconnected')
});


module.exports = db;

