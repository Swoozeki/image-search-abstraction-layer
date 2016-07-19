var request= require('request')

var express=require('express')
var mongodb=require('mongodb').MongoClient

var app=express()

app.set('json spaces',2)
app.get('/api/imagesearch/:keywords',(req,res)=>{
    var keywords=req.params.keywords
    var offset=req.query.offset?req.query.offset:1
    var api_key='868d32f7349fe657ad20120786197832'
    var method='flickr.photos.search'
    var endpoint=`https://api.flickr.com/services/rest/?api_key=${api_key}&method=${method}&text=${keywords}&format=json&page=${offset}&nojsoncallback=1`

   request(endpoint,function(err,body,queries){
       if(err) throw err
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
       res.json(results)
       
   })
})

app.listen(8080,()=>console.log("listening on port 8080"))