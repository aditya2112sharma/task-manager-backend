const express = require('express')
const authRoute = require('./routes/authRoutes')
const taskRoute = require('./routes/taskRoutes')
const connectToMongoDB = require('./config/db')
const cookieParser = require('cookie-parser')
const restrictToLoggedUserOnly = require('./middleware/auth')
const cors = require('cors');
require('dotenv').config();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');


const PORT = 8000
const app = express()
console.log(process.env.MONGODB_URL)
connectToMongoDB(process.env.MONGODB_URL).then(()=>{
    console.log('Database is Connected')
})
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use('/auth',authRoute)
app.use('/task',restrictToLoggedUserOnly, taskRoute)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/me',restrictToLoggedUserOnly,(req,res)=>{
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
    })
})

app.listen(PORT, ()=>{
    console.log(`Server started at Port: ${PORT}`)
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`)
})