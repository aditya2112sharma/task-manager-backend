const TASK = require('../models/taskModels')
async function createTask(req,res){
    try{
        const {title, description,status} = req.body
        if(title === undefined || title.trim()==="") return res.status(400).json({message:"Title can not be empty"})
        await TASK.create({...req.body,owner: req.user.id})
        return res.status(201).json({message: "task created"})    
    } catch(error){
        return res.status(500).json({message: error.message})
    }
}
async function getTasks(req,res){
    try{
        const data = (await TASK.find({}))
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
async function getUserTasks(req,res){
    try{
        const data = await TASK.find({ owner: req.user.id }).populate("owner");
        return res.status(200).json(data)
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}
async function getTaskById(req,res){
    try{
        const id = req.params.id
        const task = await TASK.findById(id)
        if (!task){
            return res.status(404).json({message: "Task not found with this ID"})
        }
        return res.status(200).json(task)
    }catch(error) {
        return res.status(500).json({message:error.message})
    }
}
async function updateTaskById(req,res){
    try{
        const {title,description,completed} = req.body 
        if(title !== undefined && title.trim()==="") return res.status(400).json({message:"Title can not be empty"})
        const existingTask = await TASK.findById(req.params.id);            
        if (!existingTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        if (completed !== undefined && existingTask.completed === true && completed === true) {
            return res.status(400).json({
                message: "Task is already completed"
            });
        }
        const updatedTask = await TASK.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators: true})
        return res.status(200).json(updatedTask)
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

async function deleteTaskById(req,res){
    try{
        const deletedTask = await TASK.findOneAndDelete({_id:req.params.id})
        if(!deletedTask) return res.status(404).json({message:"task not found"})
        return res.status(200).json(deletedTask)
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

async function completeTask(req,res){
        try{
            const id = req.params.id
            const task = await TASK.findById(id);
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            task.completed = !task.completed;
            await task.save();
            return res.status(200).json(task)
        } catch (error) {
            return res.status(500).json({message:error.message})
        }
    }

module.exports = {createTask,getTasks,getTaskById,updateTaskById,deleteTaskById,completeTask,getUserTasks}