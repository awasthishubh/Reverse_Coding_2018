const router =  require("express").Router();
const Team = require("./../models/team.js");
const Ques = require("./../models/question.js");
const qAssigned = require("./../models/questionAssigned.js");

router.get('/leaderboard', function(req,res){
    Team.find({},'name credits',{sort:{credits:-1}},function(err,doc){
        res.json(doc)
    })
})
module.exports=router
