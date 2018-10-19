const mongoose = require("mongoose");

const schema = mongoose.Schema;

const model = new schema({

    team:{
        type:String,
        default: 1
    },
    question:{
        type:Number
    },
    result:{
        type:Array
    },
    points:{
        type:Number,
    }

});

module.exports = mongoose.model("question", model);