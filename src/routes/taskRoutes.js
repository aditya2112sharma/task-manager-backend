const express = require('express')
const {createTask,getUserTasks,getTasks,getTaskById,updateTaskById,deleteTaskById,completeTask} = require('../controllers/taskControllers')
const authorize = require('../middleware/authorize')

const router = express.Router()

router.get('/all',authorize('admin'),getTasks)
router.get('/',getUserTasks)
router.get('/:id', getTaskById)
router.post('/',createTask)
router.put('/:id', updateTaskById)
router.delete('/:id',deleteTaskById)
router.patch('/completed/:id',completeTask)


module.exports = router