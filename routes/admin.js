const router =  require("express").Router();
const Team = require("./../models/team.js");
const Ques = require("./../models/question.js");
const Admin=require("./../models/admin.js");
const qAssigned = require("./../models/questionAssigned.js");
const path=require('path')
const fs=require('fs')
const Attempt=require("./../models/attempt.js");

const adminpolicy=require("./../policies/admin");

module.exports=function(io){
    router.get('/submission', adminpolicy, function(req,res){
        a={'true':true,'false':false}
        allow=a[req.query.allow]
        if(allow===undefined) return res.json('Invalid respose')
        Admin.updateOne({},{allow:allow},{upsert:true},function(err,doc){
            console.log(err)
            console.log(doc)
            io.sockets.emit(allow?'lockAdded':'lockRemoves');
            return res.json({Message:allow?'Started':'Stopped'})
        })
    })

    router.get('/question', adminpolicy,function(req,res){
        Ques.find({},function(err,doc){
            if(err){
                return
            }
            return res.json(doc)
            
        })
    })

    router.post('/sale/:id', adminpolicy,function(req,res){
        points=req.body.points;
        team=req.body.team;
        number=req.params.id;
        if(!points||!team) return res.status(400).json({Message:'Invalid req   '})
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
                doc.points=doc.points-points
                doc.save()
                qDoc.team=team;
                qDoc.sold=true
                qDoc.save()
                io.sockets.emit('leaderboard');
                return res.status(200).json({'Message':'Assigned'})
            })
        })
        
    })

    router.post('/givepoints',function(req,res){

    })

    router.post('/addques',adminpolicy,function(req,res){
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
            mac : `/q${number}_mac`,
            win : `/q${number}_win.exe`,
            linux : `/q${number}_lin`
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
    return router
}



// module.exports=router
// Attempt.create({question:number,team},function(err){
//     if(err){

//     }