const mongoose = require("mongoose");

const schema = mongoose.Schema;

const model = new schema({
    allow:{
        type:Boolean
    }
});

module.exports = mongoose.model("admin", model);