const router =  require("express").Router();
const Team = require("./../models/team.js");
const Ques = require("./../models/question.js");
const qAssigned = require("./../models/questionAssigned.js");

router.get('/', function(req,res){
    var team=req.body.team;
    Team.findOne({name:team},function(err, doc){
        qNum=[];
        doc.questions.forEach(function(el){
            qNum.push(el.number)
        })
        Ques.find({number:{$in:qNum},sold:false},'number sold attemptCount',function(err,qDoc){
            res.status(200).json(qDoc)
        })
    })
})



module.exports=router


// Team.create({name:'Kinne',credit:2500,questions:[
//     {number:3},{number:5}
// ]})