const router =  require("express").Router();
const Team = require("./../models/team.js");
const Ques = require("./../models/question.js");
const qAssigned = require("./../models/questionAssigned.js");
const fs=require('fs')
const path=require('path')

router.get('/', function(req,res){
    var team='zxcv';
    qAssigned.find({team:team, isAllowed:true},function(err, doc){
        res.status(200).json(doc)
    })
})

router.post('/',function(req,res){
    var number=req.body.number;
    var marking=req.body.marking || 5;
    var credit=req.body.credit;
    var upsert=true
    if(!number) return res.status(400).json({'Message':'Incomplete request'})
    if(!credit) upsert=false
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
    Ques.update( { number }, credit?{number,credit,bin,output,testcases,marking}:{number,bin,output,testcases,marking}, { upsert,setDefaultsOnInsert: true }, function(err,doc){
        if(err){
            console.log(err);
            return res.status(500).json({msg:'DB Error'})
        }
        if(doc.n==0 && upsert==false){
            return res.status(404).json({msg:"Question not found, Add credits to create"});
        }
        console.log(doc)
        return res.status(200).json({msg:"Question added successfully"});
    });
})




module.exports=router


