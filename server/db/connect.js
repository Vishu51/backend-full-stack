const mongoose = require('mongoose')
URI="mongodb+srv://vishal:lFS5dBL8A2pIe1bg@cluster0.wanef.mongodb.net/Cluster0?retryWrites=true&w=majority"
const connectDB = () => {
    console.log('mmmmmmmmmmmmmm',URI);
    return mongoose.connect(URI , { useNewUrlParser : true, useUnifiedTopology : true})
    .then((res)=>console.log('> Connected...'))
    .catch(err=>console.log(`> Error while connecting to mongoDB : ${err.message}` ))
}

module.exports = connectDB