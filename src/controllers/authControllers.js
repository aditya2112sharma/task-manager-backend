const AUTH = require("../models/authModels")
const bcrypt = require('bcrypt')
const {setUser} = require('../service/auth')

async function handleRegister(req,res){
    const {name,email,password} = req.body
    const role = req.body.role
    if (password.length<8 || password.length>12){
        return res.status(401).json({error: "password is greater than 12 or smaller than 8"})
    }

    const exists = await AUTH.exists({ email: email });
    if (exists) {
        return res.status(401).json({error: "email already exist"})
    }
    
    const hashPassword = await bcrypt.hash(password,12)

    await AUTH.create({
        name: name,
        email: email,
        password: hashPassword,
        role: role
    })
    const user = await AUTH.findOne({email:email})
    const token = setUser({ id: user._id,
        name:user.name,
        email:user.email,
        role:user.role
    })
    res.cookie("token",token,{
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    })
    return res.status(200).json({message: "user created"})
}
async function handleLogin(req,res){
    const {email,password} = req.body
    const user = await AUTH.findOne({email:email})
    if (!user){
        return res.status(401).json({error: "user not found"})
    }
    const isMatched = await bcrypt.compare(password,user.password)
    if (!isMatched){
        return res.status(401).json({error: "username or password is wrong"})
    }
    const token = setUser({ id: user._id,
        name:user.name,
        email:user.email,
        role:user.role
    })
    res.cookie("token",token,{
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    })
    return res.status(200).json({message: "Login successfully"})
}
async function handleLogout(req,res){
    res.clearCookie("token");
    return res.status(200).json({message: "Logout Successfully"})
}

module.exports = {handleRegister,handleLogin,handleLogout}
