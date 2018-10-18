const mongoose = require("mongoose");

const schema = mongoose.Schema;

const model = new schema({
    team:{
        type:String
    },
    number:{
        type:Number,
    },
    casePassed:{
        type: Number,
        default: 0
    },
    isAllowed:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model("questionAssigned", model);