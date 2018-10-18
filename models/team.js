const mongoose = require("mongoose");

const schema = mongoose.Schema;

const model = new schema({

    name:{
        type:String
    },
    credit:{
        type:Number
    },
    questions:[
        {
            number:{
                type:Number
            },
            casesPassed:{
                type:Number,
                default:0
            },
            isAllowed:{ //no submission after phase ends
                type:Boolean,
                default: true  
            }
        }
    ]
});

module.exports = mongoose.model("teams", model);