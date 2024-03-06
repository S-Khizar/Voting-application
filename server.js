const express = require('express');
const app = express();
// require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

//import the router file
const userRoute = require('./routes/userRoutes');

//use the routers
app.use('/user',userRoute);

app.listen(PORT ,()=>{
    console.log("Listening on port 3000");
});