const jwt = require("jsonwebtoken");
const Team = require("./../models/team.js");

module.exports = (req, res, next)=>{
    
    let authHeader = req.get("Authorization")
    if(authHeader=='qwerty@123'){
        next()
    }
    else{
        return res.status(406).json({err:"Invalid authorization header"});
    }
}