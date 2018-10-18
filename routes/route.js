module.exports= function(route){
    route.get('/', function(req,res){
        res.send('Server running')
    })
}