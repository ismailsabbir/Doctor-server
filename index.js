const express = require('express')
const { MongoClient, ObjectId } = require('mongodb');
const cors=require('cors')
// const services=require('./services.json')
const app = express()
const port = 5000
app.use(cors())
app.use(express.json())
// password:koTKjunMt4Hfgmd3
// dbname:doctor 
const uri = "mongodb+srv://doctor:koTKjunMt4Hfgmd3@cluster0.3w5podw.mongodb.net/?retryWrites=true&w=majority";
const client=new MongoClient(uri);
async function run(){
  await client.connect();
  try{
    console.log('Mongodb connected');
    const servicecollection=client.db('doctorinfo').collection('services');
    const reviewcollection=client.db('doctorinfo').collection('review');
    const appoinmentcollection=client.db('doctorinfo').collection('appoinment');
    app.get('/services',async(req,res)=>{
      const query={}
      const cursor=servicecollection.find(query);
      const services=await cursor.toArray();
      res.send(services);
    })
    app.get('/services/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const services=await servicecollection.findOne(query);
      res.send(services);
    })
    app.post('/appoinment',async(req,res)=>{
      const appoinmentinfo=req.body;
      const result=await appoinmentcollection.insertOne(appoinmentinfo);
      res.send(result);
      console.log(result);
    })
    app.get('/appoinment',async(req,res)=>{
      const query={};
      const cursor=appoinmentcollection.find(query);
      const appoinment=await cursor.toArray();
      res.send(appoinment);
    })
    app.post('/review',async(req,res)=>{
      const review=req.body;
      const result=await reviewcollection.insertOne(review);
      res.send(result);
      console.log(result);
    })
    app.get('/review',async(req,res)=>{
      const query={};
      const cursor=reviewcollection.find(query);
      const review=await cursor.toArray();
      res.send(review)
    })
  }
  catch(error){
    console.log(error)
  }
}
run()
app.get('/', (req, res) => {
  res.send('Hello Doctor server!')
})
// app.get('/services',(req,res)=>{
//   res.send(services);
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})