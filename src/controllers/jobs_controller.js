const JobSchema = require('../models/job_model')
const {BadRequest, UnAuthError,NotFound} = require('../errors')
const {StatusCodes} = require('http-status-codes')


const getAllUserJobs = async (req,res)=>{
    const {allJobsOnDb} = req.body
    const queryObject = {}
    let jobs 
    if(allJobsOnDb === true){
       jobs = await JobSchema.find({}).sort('createdAt')
    }else{
        jobs = await JobSchema.find({createdBy: req.user.userId}).sort('createdAt')
    }
    res.status(StatusCodes.OK).json({jobs,hbHits:jobs.length})
}

const getJob = async(req,res)=>{
    const {user: {userId}, params: {id: jobId}} = req

    const job = await JobSchema.findOne({
        _id: jobId, createdBy: userId
    })

    if(!job){
        throw new NotFound('Job not available')
    }

    res.status(StatusCodes.OK).json({job})
}

const createJob = async(req,res)=>{
    req.body.createdBy = req.user.userId

    const job = await JobSchema.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
    
}

const updateJob = async(req,res)=>{
    const {body: {company,position},
        user: {userId},
        params: {id: jobId}
    } = req

    if(company='' ||position==='' ){
        throw new BadRequest('company or position fields cannot be empty')
    }

        //ensure only jobs belonging to the user can only be updated 
    const job = await job.findByAndUpdate({_id: jobId,createdBy:userId},req.body,
        {new: true, runValidators: true})

    if(!job){
        throw new NotFound('Job not available')
    }
    res.status(StatusCodes.CREATED).json({job})
}

const deleteJob = async(req,res)=>{
    const {user: {userId}, params: {id: jobId}} = req

    //ensure only jobs belonging to the user can only be remove
    const job = await JobSchema.findOneAndRemove({
        _id:jobId, createdBy:userId
    })

    //error if no job is found
    if(!job){
        throw new NotFound('Job not available')
    }

    res.status(StatusCodes.OK).json({status: "successfully removed"})
}


    
module.exports = {
    getAllUserJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}