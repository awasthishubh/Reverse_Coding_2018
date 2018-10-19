const router =  require("express").Router();
const Team = require("./../models/team.js");
const Ques = require("./../models/question.js");
const qAssigned = require("./../models/questionAssigned.js");

userpolicy=require('../policies/user')

router.get('/', userpolicy, function(req,res){
    Ques.find({sold:false},'number sold attemptCount', function(err,qDoc){
        res.status(200).json(qDoc)
    })
})

router.get('/buy/:id', userpolicy, function(req,res){
    team=req.body.team;
    number=req.params.id;
    Ques.findOne({sold:false, number},function(err,qDoc){
        if(err){
            console.log(err);
            return res.status(500).json({'Message':'SOmething is wrong'})
        }
        if(!qDoc){
            return res.status(404).json({'message':'Question not found or sold'})
        }
        qAssigned.find({team,isAllowed:true},function(err,doc){
            if(err){
                console.log(err);
                return res.status(500).json({'Message':'SOmething is wrong'})
            }
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
module.exports=router
