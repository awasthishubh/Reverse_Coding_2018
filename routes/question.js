const router =  require("express").Router();
const Team = require("./../models/team.js");
const Ques = require("./../models/question.js");

router.get('/', function(req,res){
    var team='zxcv';
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

router.get('/', function(req,res){
    Ques.find({sold:false},'number sold attemptCount', function(err,qDoc){
        res.status(200).json(qDoc)
    })
})

router.get('/buy/:id', function(req,res){
    console.log(req.params.id)
    Ques.find({sold:false},'number sold attemptCount', function(err,qDoc){
        res.status(200).json(qDoc)
    })
})

module.exports=router


// Team.create({name:'Kinne',credit:2500,questions:[
//     {number:3},{number:5}
// ]})