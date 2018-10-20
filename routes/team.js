const router =  require("express").Router();
const Team = require("./../models/team.js");
var multer  = require('multer');
const fs=require('fs')
const path=require('path')
const Attempt=require("./../models/attempt.js");

const Ques = require("./../models/question.js");
const qAssigned = require("./../models/questionAssigned.js");

const uploadLoc=path.join(__dirname,'../files/uploads')
var upload = multer({ dest: uploadLoc })

userpolicy=require('../policies/user')

router.get('/leaderboard', userpolicy, function(req,res){
    Team.find({},'name points',{sort:{credits:-1}},function(err,doc){
        res.json(doc)
    })
})

router.get('/',userpolicy,function(req,res){
    team=req.body.team
    Team.findOne({name:team},function(err,doc){
        console.log(team,doc)
        Ques.find({team},function(err,qDoc){
            if(err){

            }
            console.log(qDoc)
            res.json({Team:doc,quesAssigned:qDoc.length})
        })
    })
})

router.get('/attempts', userpolicy, function(req,res){
    Attempt.find({team:req.body.team},'result question points 1539990093190',function(err,docs){
        if(err){
            return
        }
        res.send(docs)
    })
})



module.exports=router