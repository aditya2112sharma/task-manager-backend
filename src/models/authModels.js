const mongoose = require("mongoose")

const authSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required: true,
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})
const AUTH = new mongoose.model('Auth',authSchema)
module.exports = AUTH
