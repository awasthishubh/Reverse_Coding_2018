const router =  require("express").Router();
const Team = require("./../models/team.js");
const Ques = require("./../models/question.js");
const fs=require('fs')
const path=require('path')
var multer  = require('multer');
const Attempt=require("./../models/attempt.js");

const uploadLoc=path.join(__dirname,'../files/uploads')
var upload = multer({ dest: uploadLoc })

userpolicy=require('../policies/user')
// Team.create({name:'Qwerty'})
// Team.create({name:'zxcv'})
// Team.create({name:'asd'})

router.get('/', userpolicy,function(req,res){
    var team=req.body.team;
    Ques.find({team},'-output -testcases -sold',function(err, doc){
        res.status(200).json(doc)
    })
})

router.post('/', upload.single('file'), userpolicy ,function(req,res){
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
    
    Ques.findOne({team,number},function(err,doc){
        if(err){

        }
        if(!doc){
            return res.status(404).json({Message:"Question Not assigned"})
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
                if(boxExec.output[testcase].output.trim()==doc.output[i].trim()){
                    result.push(true);points++
                } else{result.push(false)}
            })
            points=points*doc.marking;
            Attempt.create({team,question:number,result,points,time:(new Date).getTime()})
            if(points>doc.points){
                inc=points-doc.points
                Team.updateOne({name:team},{$inc : {points : inc}}, function(err){
                    if(err){
                        return
                    }
                    Ques.updateOne({number},{points},function(err,e){
                        if(err){
    
                        }
                        Ques.update({})
                        return res.json({err,result,points});
                    })
                })
            }
            else return res.json({err,result,points});
        });
        boxExec.on("fileError",(err)=>{
            console.log("fileError")
            console.log(err);
        });
        boxExec.on("langKeyError",(err)=>{
            console.log("langKeyError")
            console.log(err);
        });
        boxExec.setData(lang,fileLoc,...doc.testcases);
    })
})



module.exports=router


