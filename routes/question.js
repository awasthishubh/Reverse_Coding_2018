const router =  require("express").Router();
const Team = require("./../models/team.js");
const Ques = require("./../models/question.js");
const qAssigned = require("./../models/questionAssigned.js");

router.get('/', function(req,res){
    var team='zxcv';
    qAssigned.find({team:team, isAllowed:true},function(err, doc){
        res.status(200).json(doc)
    })
})



module.exports=router


