const mongoose = require("mongoose");

const schema = mongoose.Schema;

const model = new schema({

    name:{
        type:String
    },
    credits:{
        type:Number
    }
});

module.exports = mongoose.model("teams", model);