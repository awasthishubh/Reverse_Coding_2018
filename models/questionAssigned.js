const mongoose = require("mongoose");

const schema = mongoose.Schema;

const model = new schema({
    team:{
        type:String,
        required:true
    },
    number:{
        type:Number,
    },
    casePassed:{
        type: Number,
        default: 0
    },
    isAllowed:{
        type:Boolean,
        default:true
    }
});

module.exports = mongoose.model("questionAssigned", model);