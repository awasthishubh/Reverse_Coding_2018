var mongoose=require('mongoose')
keys=require('./config').keys

const Schema = mongoose.Schema;
mongoose.connect(keys.db, { useNewUrlParser: true });

const model=new Schema({
    
  });
  
mongoose.model('model', model);

