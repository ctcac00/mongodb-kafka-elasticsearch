curl 'http://localhost:9200/test.test/_msearch?' \
  -H 'Connection: keep-alive' \
  -H 'sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"' \
  -H 'accept: application/json' \
  -H 'authorization: Basic ZWxhc3RpYzpjaGFuZ2VtZQ==' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36' \
  -H 'content-type: application/x-ndjson' \
  -H 'Origin: http://localhost:1358' \
  -H 'Sec-Fetch-Site: same-site' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Referer: http://localhost:1358/' \
  -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
  --data-raw $'{"preference":"results"}\n{"query":{"match_all":{}},"size":15,"_source":{"includes":["*"],"excludes":[]},"from":0,"sort":[{"_score":{"order":"desc"},"_id":{"order":"desc"}}],"track_total_hits":true}\n' \
  --compressed