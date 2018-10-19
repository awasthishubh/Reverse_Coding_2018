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
        // doc.forEach(function(d){
        //     Ques.find({team},'points',function(err,arr){
        //         if(err){
        //             console.log(err);
        //             res.s
        //         }
        //     })
        // })
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
            // doc.quesAssigned=qDoc.length
            res.json({Team:doc,quesAssigned:qDoc.length})
        })
    })
})



module.exports=router