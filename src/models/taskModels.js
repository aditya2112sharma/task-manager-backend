const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth"
    }
})
const TASK = mongoose.model("Task", taskSchema)
module.exports = TASK