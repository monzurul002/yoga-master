const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express")
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config()
const cors = require("cors")
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jtrl73o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const userCollection = client.db("yoga-master").collection("users")
        const classesCollection = client.db("yoga-master").collection("classes")
        const cartCollection = client.db("yoga-master").collection("cart")
        const paymentCollection = client.db("yoga-master").collection("payment")
        const orderCollection = client.db("yoga-master").collection("order")
        const enrolledCollection = client.db("yoga-master").collection("enrolled")
        const appliedCollection = client.db("yoga-master").collection("applied")

        //classes 
        app.get("/classes", async (req, res) => {
            const query = { status: "approved" };
            const result = await classesCollection.findOne(express.query);
            res.send(result)
        })

        app.get("/allClasses", async (req, res) => {
            const users = await classesCollection.find().toArray();
            res.send(users)
        })

        //get class by instructor email

        app.get("/classes/:email", async (req, res) => {
            const { email } = req.params;
            const result = await classesCollection.find({ instructorEmail: email }).toArray()
            res.send(result)

        })

        //post new class
        app.post("/newclass", async (req, res) => {
            const classInfo = req.body;
            const result = await classesCollection.insertOne(classInfo);
            res.send(result)
        })
        // class put

        app.put('/change-status/:id', async (req, res) => {
            const { id } = req.params.id;
            const { status } = req.body;
            const { reason } = req.body;
            console.log(reason);
            const filter = {_id: ObjectId(id)};
            const options = {upsert:true}
            const updateDoc = {
                $set:{
                    status,reason
                }
            }
             const result = await classesCollection.insertOne(filter,updateDoc,options);
             res.send(result)

        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Server is running")
})


app.listen(port, () => {
    console.log("server is running");
})
