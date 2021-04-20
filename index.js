const express = require('express');
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
//app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require('dotenv').config();
const port = 5000;


const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jvd1e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("bithe-shop").collection("product");
  const orderCollection = client.db("bithe-shop").collection("orders");
  app.get('/products', (req, res) => {
     productCollection.find({})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    console.log(product)
    productCollection.insertOne(product)
    .then(result => {
      res.redirect('http://localhost:3000/');
    })
  })
  app.post('/order', (req, res) => {
      const newOrder = req.body;
      orderCollection.insertOne(newOrder)
      .then(result => {
          res.send(result.insertedCount > 0);
      })
  })
   app.get('/orders', (req, res) => {
    //console.log(req.query.email)
    orderCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })
   app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0);
    })
  })
});

 app.get('/', (req, res) => {
     res.send("I am working, continue your work")
  })
app.listen(port)