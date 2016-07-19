var request= require('request')

var express=require('express')
var mongodb=require('mongodb').MongoClient

var app=express()
var database='mongodb://localhost:27017/dt'

app.set('json spaces',2)
app.get('/latest/imagesearch',(req,res)=>{
    mongodb.connect(database,(err,db)=>{
        if(err) throw err
        db.collection('latestsearch').find().toArray((err,doc)=>{
            if(err) throw err
            res.json(doc)
        })
        
    })
})
app.get('/api/imagesearch/:keywords',(req,res)=>{
    var keywords=req.params.keywords
    var offset=req.query.offset?req.query.offset:1
    var api_key='868d32f7349fe657ad20120786197832'
    var method='flickr.photos.search'
    var endpoint=`https://api.flickr.com/services/rest/?api_key=${api_key}&method=${method}&text=${keywords}&format=json&page=${offset}&nojsoncallback=1`
    
    request(endpoint,(err,body,queries)=>{
        if(err) throw err
        var when = new Date().toISOString()
        var results=[]
        queries=JSON.parse(queries)
        queries.photos.photo.forEach(photo=>{
            var title=photo.title
            var owner= photo.owner
            var id= photo.id
            results.push({
                title,
                image_url: `https://www.flickr.com/photos/${owner}/${id}/`,
                page_url: `https://www.flickr.com/photos/${owner}/${id}/in/photostream/lightbox/`
            })
         })
        mongodb.connect(database,(err,db)=>{
            if(err) throw err
            db.collection('latestsearch').insertOne({
                keywords,
                when
            })
        })
        console.log(`Requested search for: \"${keywords}\". Total Found: ${queries.photos.total}`)
        res.json(results)
       
    })
})
app.use(express.static(__dirname))

app.listen(8080,()=>console.log("listening on port 8080"))