const router =  require("express").Router();
const Team = require("./../models/team.js");
const Ques = require("./../models/question.js");
const qAssigned = require("./../models/questionAssigned.js");

router.get('/endphase', function(req,res){
    qAssigned.update({isAllowed:true},{isAllowed:false},{multi: true},function(err,doc){
        return res.json({Message:'Phase Ended'})
    })
})

module.exports=router
