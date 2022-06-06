const userSchema = require('../models/user_model')
const {BadRequest, UnAuthError} = require('../errors')
const {StatusCodes} = require('http-status-codes')
const jwt = require('jsonwebtoken')

const register = async (req,res)=>{
    const {name, email, password} = req.body
    
    //optional: as moongose can also validate
    // if(!name ||!email ||!password){
    //     throw new BadRequest('please provide name, email and password')
    // } 

    const user = await userSchema.create({...req.body})
    
    const token = user.createJwtToken()

    res.status(StatusCodes.CREATED).json({user:user.name, id: user.id,token})
}

const login = async(req,res)=>{
    const {email, password} = req.body
    
    if(!email || !password){
        throw new BadRequest('please provide email and password')
    }
    
    //find the user
    const user = await userSchema.findOne({email})

    if(!user){
        throw new UnAuthError('Invalid credentials')
    }
    
    //compare password
    const isPasswordCorrect = await user.comparePassword(password)

    if(!isPasswordCorrect){
        throw new UnAuthError('invalid password')
    }

    const token = user.createJwtToken()

    res.status(StatusCodes.ACCEPTED).json({username: user.name, userId: user._id, token})
}

module.exports = {
    register,
    login
}
