const router =  require("express").Router();
const Team = require("./../models/team.js");
var multer  = require('multer');
const fs=require('fs')
const path=require('path')


const Ques = require("./../models/question.js");
const qAssigned = require("./../models/questionAssigned.js");

const uploadLoc=path.join(__dirname,'../files/uploads')
var upload = multer({ dest: uploadLoc })

userpolicy=require('../policies/user')

router.get('/leaderboard', userpolicy, function(req,res){
    Team.find({},'name credits',{sort:{credits:-1}},function(err,doc){
        res.json(doc)
    })
})

router.post('/submit', upload.single('file'), userpolicy ,function(req,res){
    allowedLang={
        "python2": 7,
        "python3": 9,
        "c": 11,
        "cpp":16
    }
    lang=allowedLang[req.body.lang]
    const boxExec = require("box-exec")();
    team=req.body.team;
    number=req.body.number;
    

    if(!number || !lang) return res.status(400).json({Message:"Incomplete Request."})
    orgName=req.file.originalname.split('.')
    filename=`${team}_${number}_${(new Date).getTime()}.${orgName[orgName.length-1]}`
    fileLoc=path.join(__dirname,'../files/attempts',filename)
    try{
        fs.renameSync(path.join(__dirname,'../files/uploads',req.file.filename),fileLoc)
    } catch(e){console.log(e);return res.status(500).json({"Message":"Unable to read loacation"})}
    console.log({team,number})
    qAssigned.findOne({team,number},function(err,doc){
        if(!doc){
            return res.status(404).json({Message:"Question Not assigned"})
        }
        Ques.findOne({number},function(err,doc){
            if(!doc){
                return res.status(400).json({Message:"Question not found"})
            }
            result=[]
            boxExec.on("success",(data)=>{
                console.log("success")
                boxExec.execute();
            });
            boxExec.on("error",()=>{
                var err=true;
                console.log("error")
                console.log(typeof boxExec.errortext);
                console.log(boxExec.errortext);
                return res.status(400).json({err,Message:boxExec.errortext})
            });
            boxExec.on("output",()=>{
                console.log('output')
                var err=false,result=[],points=0
                console.log(boxExec.output);
                doc.testcases.forEach(function(testcase,i){
                    console.log(i,boxExec.output[testcase].output,doc.output[i])
                    result.push(boxExec.output[testcase].output.trim()==doc.output[i].trim())
                })
                console.log(12345)
                res.json({err:false,result,points});
            });
            boxExec.on("fileError",(err)=>{
                console.log("fileError")
                console.log(err);
            });
            boxExec.on("langKeyError",(err)=>{
                console.log("langKeyError")
                console.log(err);
            });
            boxExec.setData(16,fileLoc,...doc.testcases);
        })
    })
    // res.json([req.file,req.body])
})

module.exports=router