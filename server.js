var express=require('express')
var mongodb=require('mongodb').MongoClient

var app=express()

app.get(function(req,res){
    res.end("here's your response!")
})

app.listen(8080,()=>console.log("listening on port 8080"))