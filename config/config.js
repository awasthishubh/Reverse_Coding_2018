if(!process.env.HEROKU)
    module.exports.keys=require('./keys')
else{
    module.exports.keys={
        email: process.env.email,
        password: process.env.password,
        db: process.env.db
    }
}