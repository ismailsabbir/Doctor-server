const express = require('express');
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = 5000
app.use(cors())
app.use(express.json())
// password:koTKjunMt4Hfgmd3
// dbname:doctor 
// const uri = "mongodb+srv://${process.env.db-name}:${process.env.password}@cluster0.3w5podw.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb+srv://doctor:koTKjunMt4Hfgmd3@cluster0.3w5podw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);
async function run() {
  await client.connect();
  try {
    console.log('Mongodb connected');
    const servicecollection = client.db('doctorinfo').collection('services');
    const reviewcollection = client.db('doctorinfo').collection('review');
    const appoinmentcollection = client.db('doctorinfo').collection('appoinment');
    const storedservicescollection = client.db('doctorinfo').collection('storedata');
    app.get('/storedata', async (req, res) => {
      const query = {};
      const cursor = storedservicescollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    })
    app.get('/storedata/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const services = await storedservicescollection.findOne(query);
      res.send(services);
    })
    app.post('/services', async (req, res) => {
      const services = req.body;
      const result = await servicecollection.insertOne(services);
      res.send(result);
      console.log(result);
    })
    app.get('/services', async (req, res) => {
      const query = {}
      const cursor = servicecollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    })
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const services = await servicecollection.findOne(query);
      res.send(services);
    })
    app.post('/appoinment', async (req, res) => {
      const appoinmentinfo = req.body;
      const result = await appoinmentcollection.insertOne(appoinmentinfo);
      res.send(result);
      console.log(result);
    })
    app.get('/appoinment/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)};
      const appoinment=await appoinmentcollection.findOne(query);
      res.send(appoinment);
    });
    app.put('/appoinment/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const appoinment=req.body;
      const option={upsert:true};
      const updateappoinment={
        $set:{
          date:appoinment.date,
          servicestype:appoinment.servicestype
        }
      }
      const result=await appoinmentcollection.updateOne(filter,updateappoinment,option);
      res.send(result);
    })
    app.get('/appoinment', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email
        }
      }
      const cursor = appoinmentcollection.find(query);
      const appoinmemt = await cursor.toArray();
      res.send(appoinmemt);
    })
    app.delete(`/appoinment/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await appoinmentcollection.deleteOne(query);
      res.send(result);
      console.log(result);
    })
    app.post('/review', async (req, res) => {
      const review = req.body;
      const result = await reviewcollection.insertOne(review);
      res.send(result);
      console.log(result);
    })
    app.get(`/review/:revtypes`, async (req, res) => {
      const reviewtypes = req.params.revtypes;
      const query = { servicestype: reviewtypes };
      const cursor = reviewcollection.find(query);
      const review = await cursor.toArray();
      res.send(review)
    })

    app.delete(`/review/:id`, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await reviewcollection.deleteOne(query);
      res.send(result);
      console.log(result);
    })
    app.get('/review', async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email
        }
      }
      const cursor = reviewcollection.find(query);
      const specificreview = await cursor.toArray();
      res.send(specificreview);
    });

  }
  catch (error) {
    console.log(error)
  }
}
run()
app.get('/', (req, res) => {
  res.send('Hello Doctor server!')
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})