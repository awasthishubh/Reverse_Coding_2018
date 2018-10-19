const router =  require("express").Router();
const Team = require("./../models/team.js");
var multer  = require('multer');
const fs=require('fs')
const path=require('path')
const Ques = require("./../models/question.js");
const qAssigned = require("./../models/questionAssigned.js");

const uploadLoc=path.join(__dirname,'../files/uploads')
var upload = multer({ dest: uploadLoc })

router.get('/leaderboard', function(req,res){
    Team.find({},'name credits',{sort:{credits:-1}},function(err,doc){
        res.json(doc)
    })
})

router.post('/submit', upload.single('file') ,function(req,res){
    team='Qwerty'
    number=17
    filename=`${team}_${number}_${(new Date).getTime()}`
    fileLoc=path.join(__dirname,'../files/attempts',filename)
    try{
        fs.renameSync(path.join(__dirname,'../files/uploads',req.file.filename),fileLoc)
    } catch(e){console.log(e);return res.status(500).json({"Message":"Unable to read loacation"})}
    res.json([req.file,req.body])

})

module.exports=router