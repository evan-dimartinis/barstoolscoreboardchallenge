const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://evandimar:evandimar@scoreboardchallenge.zg5capy.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
});

const NBAData = require("./frontend/NBA-data.json")

app.get("/NBA", (req, res) => {
  console.log("Connected to React");
  res.send({ nba: NBAData });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

setInterval(function() {
    client.connect(err => {
        const db = client.db("ScoreboardRefreshTimes")
        db.collection("RefreshTimes").find({}).sort({_id:-1}).limit(1).forEach(
            function(doc) {
                const lastTimeRefreshed = doc._id.getTimestamp().getTime()
                console.log(lastTimeRefreshed)
                if (lastTimeRefreshed < Date.now() - 15000) {
                    db.collection("RefreshTimes").insertOne({ "RefreshDt" : Date.now() }).catch(err => {
                        console.log(err)
                    })
                    console.log("Inserted new doc")
                }
            }
        )
    })
}, 10000)