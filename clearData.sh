#!/usr/bin/env bash

echo "clearing data in MongoDB"

docker exec -it mongo sh -c "mongo --username root --password changeme --authenticationDatabase admin test --eval 'db.test.deleteMany({})'"

echo "clearing data in ElasticSearch"

curl -X DELETE "localhost:9200/test.test?pretty"
