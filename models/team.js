const mongoose = require("mongoose");

const schema = mongoose.Schema;

const model = new schema({
    name:{
        type:String
    },
    points:{
        type:Number,
        default:250
    }
});

module.exports = mongoose.model("teams", model);