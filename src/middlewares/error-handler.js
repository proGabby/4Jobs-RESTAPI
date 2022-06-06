const CustomError = require('../errors/custom-error')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = async (err, req, res, next)=>{
    //creating an error object
    let customError={
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "something went wrong try again"
    }


    if(err instanceof CustomError){
        return res.status(err.statusCode).json({msg: err.message})
    }

    //handling validation Error
    if(err.name === 'ValidationError'){
        customError.msg = Object.values(err.errors).map((item)=>item.message).join(',')
        customError.statusCode = 400
    }
 
    //handling duplicate email
    if(err.code && (err.code === 11000)){
        customError.msg = `${Object.keys(err.keyValue)} already exist.. please enter another ${Object.keys(err.keyValue)}`;
        customError.statusCode = 400
    }

    //handling cast Error
    if(err.name === "CastError"){
        customError.msg = `No item found with id: ${err.value}`;
        customError.statusCode = 404
    }

   // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: err}) 
    return res.status(customError.statusCode).json({msg: customError.msg})
}

module.exports = errorHandlerMiddleware