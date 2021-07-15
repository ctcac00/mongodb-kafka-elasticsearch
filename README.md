# MongoDB-Kafka-ElasticSearch

This project is a Proof-of-Concept that demonstrates how you can leverage both MongoDB and ElasticSearch to power various users searches in your APIs.
It makes use of Kafka to move data from MongoDB to ElasticSearch to be indexed. Thanks to Kafka connect this can be done without any coding.
All we need to do, is to set up the MongoDB Source Connector and the ElasticSearch Sink Connector to make this possible.

The overall archictecture is:

|Database|ETL Layer|Search Engine|
| ----------- | ----------- | ----------- |
|MongoDB|Kafka|ElasticSearch|

Data is inserted into MongoDB, then gets published to Kafka and finally it gets ingested into ElasticSearch.

All the infrastructure is self contained and it runs on docker containers.
You can reuse the docker compose files to create different projects with each of the elements, for instance, demonstrate MongoDB and Kafka integration on its own.

There are other components to aid with demonstrating some of the features, such as DejaVu, which is a UI app for ElasticSearch that allows us to visualise indexes data, make queries to ElasticSearch and also build dashboards for searches.

Another big part of this project is a sample backend API and a React frontend app. This was created to demonstrate how using MongoDB and ElasticSearch is completely transparent for the end user, as all the complexity is handled by the backend API.

## Pre-requisites

Please install:

* curl
* node
* docker
* docker-compose (might be included in newer docker releases)
* mongodb tools (mongo shell and mongoimport needed)

## How to run

* Call `docker-compose` on this directory to stand up the required containers
* Connect to MongoDB on port 27017 using Compass or mongoshell
* Create a new database and collection called `test.test`
* Run the script `elasticsearch/setupConnectors.sh` to enable the MongoDB Source Connector and the ElasticSearch Sink Connector
* Open the Dejavu interface on `http://<your_server>:1358`
* On Dejavu, connect to your ElasticSearch server using the URL `http://<your_server>:9200` and set the basic authorization header like this

|Header|Value|
| ----------- | ----------- |
|Authorization|Basic ZWxhc3RpYzpjaGFuZ2VtZQ==|

Then use `test.test` as the index you want to connect to

* Add data to the `test.test` collection
* Reload Dejavu to see the data

## Backend API

* Start the backend API server:

```bash
cd backend && npm install && npm start
```

## Frontend UI

* Start the frontend app:

```bash
cd frontend && npm install && npm start
```

* Open the UI on `http://<your_server>:3001`

---

### NOTE

This app only works with the books collection. This is in the [data](data) folder.
To import this data run:

```bash
./importData.sh
```

---

## Tips & Tricks

Use the following command enable TRACE logs on the connectors:

```bash
curl -s -X PUT -H "Content-Type:application/json" http://localhost:8083/admin/loggers/org.apache.kafka.connect.runtime.WorkerSourceTask n-d '{"level": "TRACE"}' | jq '.'
```

To restart a failed connector, run the following command (example with elasticsearch-connector):

```bash
curl -X POST localhost:8083/connectors/elasticsearch-connector/tasks/0/restart
```

You can connect to the Confluent Control center at `http://<your_server>:9021`
