const jwt = require("jsonwebtoken")

const secretKey = "AdityaSharma"

function setUser(payload){
    return jwt.sign(payload,secretKey)
}
function getUser(token){
    return jwt.verify(token,secretKey)
}

module.exports = {setUser,getUser}