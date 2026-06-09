const { setUser,getUser } = require("../service/auth")

function restrictToLoggedUserOnly(req,res,next){
    const token = req.cookies.token
    if (!token) return res.status(401).json({error: "please signin"})

    const user = getUser(token)
    if (!user) return res.status(401).json({error: "Please SignUp"})
    req.user = user
    next()
}

module.exports = restrictToLoggedUserOnly