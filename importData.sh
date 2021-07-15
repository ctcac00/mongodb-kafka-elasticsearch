#!/usr/bin/env bash

echo "Import books collection to MongoDB..."

mongoimport -d test -c test --type json --username root --password changeme --authenticationDatabase admin -h localhost:27017 data/books.json

echo "creating text index on new collection"

docker exec -it mongo sh -c "mongo --username root --password changeme --authenticationDatabase admin test --eval 'db.test.createIndex({ title: \"text\" })'"
