echo "adding elasticsearch sink connector..."

curl -X PUT localhost:8083/connectors/elasticsearch-connector/config -H "Content-Type: application/json" -d '{
    "connector.class": "io.confluent.connect.elasticsearch.ElasticsearchSinkConnector",
    "value.converter": "org.apache.kafka.connect.json.JsonConverter",
    "topics": "test.test",
    "transforms": "RenameField,ValueToKey,ExtractField,ReplaceField",
    "transforms.RenameField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
    "transforms.RenameField.renames": "_id:id",
    "transforms.ValueToKey.type":"org.apache.kafka.connect.transforms.ValueToKey",
    "transforms.ValueToKey.fields":"id",
    "transforms.ExtractField.type":"org.apache.kafka.connect.transforms.ExtractField$Key",
    "transforms.ExtractField.field":"id",
    "transforms.ReplaceField.type": "org.apache.kafka.connect.transforms.ReplaceField$Value",
    "transforms.ReplaceField.blacklist": "isbn,pageCount,publishedDate,thumbnailUrl,status,authors,categories",
    "connection.url": "http://es01:9200",
    "connection.username": "elastic",
    "connection.password": "changeme",
    "type.name": "_doc",
    "schema.ignore": "true",
    "write.method":"upsert",
    "value.converter.schemas.enable": "false"
}'

echo "\n"

echo "adding mongodb source connector..."

curl -X PUT localhost:8083/connectors/mongodb-connector/config -H "Content-Type: application/json" -d '{
    "connector.class": "com.mongodb.kafka.connect.MongoSourceConnector",
    "key.converter": "org.apache.kafka.connect.storage.StringConverter",
    "value.converter": "org.apache.kafka.connect.storage.StringConverter",
    "errors.tolerance": "all",
    "errors.log.enable":"true",
    "connection.uri": "mongodb://root:changeme@mongo:27017/admin",
    "database": "test",
    "collection": "test",
    "publish.full.document.only": "true"
}'