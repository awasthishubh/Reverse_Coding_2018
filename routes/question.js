const router =  require("express").Router();
const Team = require("./../models/team.js");
const Ques = require("./../models/question.js");
const qAssigned = require("./../models/questionAssigned.js");
const fs=require('fs')
const path=require('path')

userpolicy=require('../policies/user')

router.get('/', userpolicy,function(req,res){
    var team=req.body.team;
    Team.find({team},'-output -testcases -sold',function(err, doc){
        res.status(200).json(doc)
    })
})

router.post('/',function(req,res){
    var number=req.body.number;
    var marking=req.body.marking || 150;
    if(!number) return res.status(400).json({'Message':'Incomplete request'})
    var testcases=[]
    var output=[]
    try{
        var files = fs.readdirSync(path.join(__dirname,`../uploads/${number}/testcases`));
        files.forEach(file => {
            testcases.push(path.join(__dirname,`../uploads/${number}/testcases/`,file));
            var data = fs.readFileSync(path.join(__dirname,`../uploads/${number}/output/`,file));
            output.push(data.toString());
        });
    }
    catch(e){
        console.log(e);
        return res.status(400).json({'Message':'Files not properly ordered'})
    }
    
    let bin={
        mac : `/static/${number}/bin/q${number}_mac`,
        win : `/static/${number}/bin/q${number}_win`,
        linux : `/static/${number}/bin/q${number}_lin`
    }
    Ques.update( { number }, {number,bin,output,testcases,marking}, { upsert=true,setDefaultsOnInsert: true }, function(err,doc){
        if(err){
            console.log(err);
            return res.status(500).json({msg:'DB Error'})
        }
        console.log(doc)
        return res.status(200).json({msg:"Question added successfully"});
    });
})

module.exports=router


