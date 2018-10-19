const mongoose = require("mongoose");

const schema = mongoose.Schema;

const model = new schema({
    number:{
        type:Number,
        default: 1
    },
    output:{
        type:Array,
    },
    testcases:{
        type:Array
    },
    sold:{
        type:Boolean,
        default:false
    },
    bin:{
        type:Object
    },
    team:{
        type:String,
        default:null
    },
    marking:{
        type:Number,
        default: 50
    },
    points:{
        type:Number,
        default:0
    }

});

module.exports = mongoose.model("question", model);