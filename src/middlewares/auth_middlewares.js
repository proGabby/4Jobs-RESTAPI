const {CustomError,UnAuthError,BadRequest} = require('../errors')
const { StatusCodes } = require('http-status-codes')


const jwt = require('jsonwebtoken')

const authenticationMiddleware = async(req,res,next) =>{
    //get the token string from the header
    const authHeader = req.headers.authorization;

    //check for header
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnAuthError('cound not authenticate you')
    }

    //split the token string to get the token
    const token = authHeader.split(" ")[1]

     //verify the token
     try {
        //Note: decode contains all the data on the payload when token was sign
        const payload = jwt.verify(token,process.env.JWT_SECRET) 
        const {userId, name:username} = payload
        req.user = {userId,username}
        next()
    } catch (error) {
        throw new UnAuthError("not authorized to access this page")
    }

}

module.exports = authenticationMiddleware