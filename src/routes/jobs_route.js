const express = require('express')
const router = express.Router()

const {getAllUserJobs, getJob, createJob, deleteJob, updateJob}=require('../controllers/jobs_controller')

router.route('/').post(createJob).get(getAllUserJobs)

router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob)

module.exports = router