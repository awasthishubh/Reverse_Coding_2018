const router =  require("express").Router();
const Team = require("./../models/team.js");
const Ques = require("./../models/question.js");
const qAssigned = require("./../models/questionAssigned.js");
const Admin=require("./../models/admin.js");

userpolicy=require('../policies/user')

// router.get('/', userpolicy, function(req,res){
//     Ques.find({sold:false},'number sold attemptCount', function(err,qDoc){
//         res.status(200).json(qDoc)
//     })
// })



module.exports=router
