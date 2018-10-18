const router =  require("express").Router();
const Team = require("./../models/team.js");
const Ques = require("./../models/question.js");
const qAssigned = require("./../models/questionAssigned.js");

router.get('/', function(req,res){
    Ques.find({sold:false},'number sold attemptCount', function(err,qDoc){
        res.status(200).json(qDoc)
    })
})

router.get('/buy/:id', function(req,res){
    team=req.body.team
    number=req.params.id
    Ques.find({sold:false, number},function(err,qDoc){
        if(qDoc.length<1){
            return res.status(404).json({'message':'Question not found or sold'})
        }
        qAssigned.findOne({team,isAllowed:true},function(err,doc){
            if(doc.length==2){
                return res.status(405).json({'Message':'Not Allowed'})
            }
            qDoc.sold=true;
            qDoc.save()
            qAssigned.create({team,number})
            return res.status(200).json({'Message':'Assigned'})
        })
    })
})