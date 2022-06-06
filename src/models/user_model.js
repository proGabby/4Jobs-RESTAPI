
// const { string } = require('joi')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'name field must be provided'],
        minlength: 3,
        maxlength: 50,
    },
    email:{
        type: String,
        required: [true, 'email field must be provided'],
        unique: true, // ensure the field is unique
        //match: [, 'please provide valid email'],
    },
    password:{
        type: String,
        required: [true, 'please provide password'],
        minlength: 6,
    },
})

//moongose middleware to handle password hashing
userSchema.pre('save', async function() {
   //generating a bcrypt salt
   const salt = await bcrypt.genSalt(10)

   //hashing the password
   this.password = await bcrypt.hash(this.password,salt)  
//    next()
})

//mongoose schema instance method
//creating Jwt token
userSchema.methods.createJwtToken = function(){
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TOKEN_LIFETIME
    } )
}

userSchema.methods.comparePassword = async function(inputPassword){
    const isMatch = await bcrypt.compare(inputPassword,this.password)
    return isMatch
}

module.exports = mongoose.model('user', userSchema)