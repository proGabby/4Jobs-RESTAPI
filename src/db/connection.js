const mongoose = require('mongoose')

connectDB = (uri)=>{
    mongoose.connect(uri).then(()=>{
        console.log('db connected')
    })
}


module.exports = connectDB