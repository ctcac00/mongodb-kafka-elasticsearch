const express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
const { MongoClient } = require("mongodb")
const { Client } = require("@elastic/elasticsearch")

const mongoDBFields = ["title", "status", "authors", "categories", "isbn"]

const uri =
  "mongodb://root:changeme@localhost:27017/admin?retryWrites=true&writeConcern=majority"

const mongoDBClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const esClient = new Client({ node: "http://localhost:9200" })

const port = 3000
const app = express()

app.use(cors())
app.use(bodyParser.text())

/*
 query example:
MongoDB
  curl "localhost:3000/search" -H "Content-Type: text/plain" -d "title contains Android"

 ElasticSearch
  curl "localhost:3000/search" -H "Content-Type: text/plain" -d "shortDescription contains Adroid"
*/
async function run() {
  await mongoDBClient.connect()
  console.log(`Connected to mongodb at:${uri}`)

  const database = mongoDBClient.db("test")
  const collection = database.collection("test")

  app.post("/search", async function (req, res) {
    var isMongoDBQuery = false
    var query = req.body
    console.log(`query: ${query}`)

    if ((typeof query === "string" || query instanceof String) && query.length > 10) {
      for (let index = 0; index < mongoDBFields.length; index++) {
        const field = mongoDBFields[index]
        if (query.includes(field)) {
          isMongoDBQuery = true
        }
      }

      var fields = ""
      if (query.includes("contains")) {
        fields = query.split(" contains ")
      } else {
        fields = query.split(" is ")
      }     

      if (isMongoDBQuery & fields.length >= 2) {
        // MongoDB query
        var mql = { shortDescription: { $exists: 1 } }
        mql[fields[0].trim()] = fields[1].trim()

        console.log(`MQL -> ${JSON.stringify(mql)}`)
        try {
          const cursor = collection.find(mql)

          if ((await cursor.count()) === 0) {
            console.log("No documents found!")
            res.send([])
          } else {
            const result = []
            await cursor.forEach(function (doc) {
              result.push(doc)
            })
            res.send(result)
          }
        } catch (e) {
          res.send([])
        }

      } else if (fields.length >= 2) {
        // ElasticSearch query
        const esQuery = `{
        "match": {
          "${fields[0].trim()}": {
            "query": "${fields[1].trim()}",
            "fuzziness": "AUTO"
          }
        }
      }`

        console.log(`esQuery: ${esQuery}`)
        const result = await esClient.search({
          index: "test.test",
          body: {
            query: JSON.parse(esQuery)
          }
        })

        if (result.body) {
          
          const ids = []
          result.body.hits.hits.forEach(function (doc) {
              ids.push(doc._source.id)
          });

          console.log(`Documents ids: ${JSON.stringify(ids)}`)
          try {
            const cursor = collection.find({_id : { $in: ids }})
  
            if ((await cursor.count()) === 0) {
              console.log("ES - No documents found!")
              res.send([])
            } else {
              const result = []
              await cursor.forEach(function (doc) {
                result.push(doc)
              })
              res.send(result)
            }
          } catch (e) {
            res.send([])
          }

        } else {
          res.send([])
        }
      } else {
        res.send([])
      }
    }
    else {
      res.send([])
    }

  })

  app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`)
  })
}
run().catch(console.dir)

// The code below is to catch any program interruptions and close the mongodb connection safely
process.stdin.resume()//so the program will not close instantly

async function exitHandler(options, exitCode) {
  if (options.cleanup) {
    // Ensures that the client will close when you finish/error
    console.log(`Closing mongodb connection...`)
    await mongoDBClient.close()
  }
  if (exitCode || exitCode === 0) console.log(exitCode)
  if (options.exit) process.exit()
}

//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }))

//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }))

// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }))
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }))

//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }))