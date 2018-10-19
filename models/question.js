const mongoose = require("mongoose");

const schema = mongoose.Schema;

const model = new schema({

    number:{
        type:Number,
        default: 1
    },
    sold:{
        type:Boolean,
        default:false
    },
    credit:{
        type:Number
    },
    executable:{
        type:"object"
    },
    output:{
        type:"array",
        // required: [true, "Output string is required"]
    },
    testcases:{
        type:"array"
    },
    marking:{
        type:"number",
        default: 5
    }

});

model.statics.insertInc = function(output, cb){
    
    this.aggregate([
        {
            $group: {
                _id: null,
                max: {$max: "$number"}
            }
        }
    ]).exec((err, data)=>{
    
        if(err){
            return cb(err);
        }
        let number = (data[0])? data[0].max || 0 : 0;
        let doc = {number: number + 1, output};
        this.create(doc, cb);

    });

}

module.exports = mongoose.model("question", model);