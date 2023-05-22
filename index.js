const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const port = process.env.PORT || 5000;
const app = express();

// middleware 

app.use(cors());
app.use(express.json())

// Routes 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iizb9vt.mongodb.net/?retryWrites=true&w=majority`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const toysCollection = client.db('smartKiddo').collection('toys');

    app.get('/toys', async (req, res) => {

      const result = await toysCollection.find().limit(20).toArray();
      res.send(result);


    })

    app.get('/toysBySearch', async(req, res) => {

        const searchTerm = req.query.inputText; 
        const query = { name: { $regex: ".*" + searchTerm + ".*", $options: "i" } }
        const result = await toysCollection.find(query).toArray();
        res.send(result);
    })

    app.get('/searchByCategory', async (req, res) => {

      const searchItem = req.query.category;


      const query = { category: searchItem }

      const result = await toysCollection.find(query).limit(3).toArray();
      res.send(result);

    })

    app.get('/toyDetails/:id', async(req, res) => {

        const id = req.params.id; 
       
        const query = {_id: new ObjectId(id)}
        const result = await toysCollection.findOne(query);
        res.send(result); 
     
    })





  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {

  res.send("Smart Kiddo Server is Running");
})

app.listen(port, () => {

  console.log(`Smart Kiddo Server is running on port ${port}`);
})