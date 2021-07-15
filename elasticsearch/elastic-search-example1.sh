curl -X GET "localhost:9200/.ent-search-engine-documents-my-search-engine/_search?pretty" -H 'Content-Type: application/json' -d'
{
  "query": {
    "query_string": {
      "query": "park"
       }
  }
}
'
