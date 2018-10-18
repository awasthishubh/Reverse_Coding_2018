express = require('express')
var bodyParser = require('body-parser')

app=express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req,res, next)=>{	
    res.header("Access-Control-Allow-Origin", "*");	
    res.header("Access-Control-Allow-Headers", "X-Requested-With");	
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, PATCH, OPTIONS');
    next()
})

require('./routes/route')(app)

app.listen(process.env.PORT || 3000, function(){
    console.log(`Server Started on PORT:${process.env.PORT || 3000}`)
})
