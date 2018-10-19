const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
// const multipart = require("connect-multiparty");

require('dotenv').config();

app=express()
// app.use(multipart({uploadDir: path.join(__dirname, "./uploads")}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req,res, next)=>{	
    res.header("Access-Control-Allow-Origin", "*");	
    res.header("Access-Control-Allow-Headers", "Authorization");	
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, PATCH, OPTIONS');
    next()
})

app.use("/question", require("./routes/question.js"));
app.use("/auction", require("./routes/auction.js"));
app.use("/team", require("./routes/team.js"));
app.use("/admin", require("./routes/admin.js"));

app.use(express.static('./files/bin'))
// app.use("/static", express.static(path.join(__dirname, "./uploads")));

mongoose.connect(process.env.db, {useNewUrlParser: true}, (err, db)=>{
    if(err){
        console.error("Error connecting to MongoDB");
        process.exit(1);
    }
    console.log("Connected to MongoDB");
});

app.listen(process.env.PORT || 3000, function(){
    console.log(`Server Started on PORT:${process.env.PORT || 3000}`)
})
