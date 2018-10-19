const jwt = require("jsonwebtoken");
const Team = require("./../models/team.js");

module.exports = (req, res, next)=>{
    
    let authHeader = req.get("Authorization") || "";
    let split = authHeader.split(" ");
    if(!authHeader || split[0] !== "Bearer"){
        return res.status(406).json({err:"Invalid authorization header"});
    }
    jwt.verify(split[1], process.env.SECRET, function(err, decoded) {
        if(err){
            return res.status(401).json({err:"Invalid token"});
        }
        if(!decoded.team) return res.status(401).json({err:"Team not found"});
        Team.findOne({name:decoded.team},function(err,doc){
            if(!doc){
                return res.status(401).json({err:"Not allowed for round 2"});
            }
            console.log(decoded.team)
            req.body.team = decoded.team;
            next();
        })
    });
}