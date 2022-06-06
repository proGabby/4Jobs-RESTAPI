require('dotenv').config()
require('express-async-errors')

const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')

const express = require('express')
const app = express()
const path = require('path')
const errorHandlerMiddleware = require('./src/middlewares/error-handler')
const notFound = require('./src/middlewares/notfound')
const connectDB = require(path.join(__dirname,'src/db/connection.js'))
const authRouter = require('./src/routes/auth_route')
const jobsRouter = require('./src/routes/jobs_route')
const authenticationMiddleware = require('./src/middlewares/auth_middlewares')

PORT = process.env.PORT||3003


app.set('trust proxy', 1); //needful  for heroku hosting

app.use(rateLimit({
    windowMs: 15*60*1000,
    max: 100 //limit each IP to 100 requests per windowMs
}))

app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticationMiddleware,jobsRouter)


app.get('/',(req,res)=>{
    res.send("welcome to this project")
})

app.use(notFound)
app.use(errorHandlerMiddleware)

const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT,()=>{
            console.log('server is on')
        })
    } catch (error) {
        console.log(error)
    }
}

start()