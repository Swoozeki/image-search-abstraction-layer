var express=require('express')
var mongodb=require('mongodb').MongoClient

var app=express()

app.listen(8080,()=>console.log("listening on port 8080"))