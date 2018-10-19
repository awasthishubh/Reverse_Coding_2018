const router =  require("express").Router();
const Team = require("./../models/team.js");
const Ques = require("./../models/question.js");
const qAssigned = require("./../models/questionAssigned.js");
const path=require('path')
const fs=require('fs')
const Attempt=require("./../models/attempt.js");

router.get('/endphase', function(req,res){
    qAssigned.update({isAllowed:true},{isAllowed:false},{multi: true},function(err,doc){
        return res.json({Message:'Phase Ended'})
    })
})

router.get('/question',function(req,res){
    Ques.find({},function(err,doc){
        if(err){
            return
        }
        return res.json(doc)
        
    })
})

router.post('/sale/:id', function(req,res){
    team=req.body.team;
    number=req.params.id;
    Team.findOne({name:team},function(err,doc){
        if(err){

        }else if(!doc){
            return res.status(404).json({Message:'Team not found'})
        }
        Ques.findOne({sold:false, number},function(err,qDoc){
            if(err){
                console.log(err);
                return res.status(500).json({'Message':'SOmething is wrong'})
            }
            if(!qDoc){
                return res.status(404).json({'message':'Question not found or sold'})
            }
            qDoc.team=team;
            qDoc.sold=true
            qDoc.save()
            return res.status(200).json({'Message':'Assigned'})
        })
    })
    
})

router.post('/addques',function(req,res){
    var number=req.body.number;
    var marking=req.body.marking || 50;
    if(!number) return res.status(400).json({'Message':'Incomplete request'})
    var testcases=[]
    var output=[]
    try{
        var files = fs.readdirSync(path.join(__dirname,`../files/question/${number}/testcases`));
        files.forEach(file => {
            testcases.push(path.join(__dirname,`../files/question/${number}/testcases/`,file));
            var data = fs.readFileSync(path.join(__dirname,`../files/question/${number}/output/`,file));
            output.push(data.toString());
        });
    }
    catch(e){
        console.log(e);
        return res.status(400).json({'Message':'Files not properly ordered'})
    }
    
    let bin={
        mac : `/static/bin/q${number}_mac`,
        win : `/static/bin/q${number}_win.exe`,
        linux : `/static/bin/q${number}_lin`
    }
    Ques.update( { number }, {number,bin,output,testcases,marking}, { upsert:true,setDefaultsOnInsert: true }, function(err,doc){
        if(err){
            console.log(err);
            return res.status(500).json({msg:'DB Error'})
        }
        console.log(doc)
        return res.status(200).json({msg:"Question added successfully"});
    });
})





module.exports=router
// Attempt.create({question:number,team},function(err){
//     if(err){

//     }