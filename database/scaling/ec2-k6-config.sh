#!/bin/bash

curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 379CE192D401AB61
echo "deb https://dl.bintray.com/loadimpact/deb stable main" | sudo tee -a /etc/apt/sources.list
sudo apt-get update
sudo apt-get install k6

echo "import http from 'k6/http';" >> stresstest.js
echo "import { check, sleep } from 'k6';" >> stresstest.js
echo "export let options = {" >> stresstest.js
echo "  vus: 60," >> stresstest.js
echo "  duration: '120s'," >> stresstest.js
echo "};" >> stresstest.js
echo "const directedTraffic = [" >> stresstest.js
echo "  3352999," >> stresstest.js
echo "  6921999," >> stresstest.js
echo "  8115999," >> stresstest.js
echo "  3984999," >> stresstest.js
echo "  3473999," >> stresstest.js
echo "  855999," >> stresstest.js
echo "  1103999," >> stresstest.js
echo "  4168999," >> stresstest.js
echo "  1477999," >> stresstest.js
echo "  1579992," >> stresstest.js
echo "  9905999," >> stresstest.js
echo "  6549999," >> stresstest.js
echo "  5399992," >> stresstest.js
echo "  8537999," >> stresstest.js
echo "  6858999," >> stresstest.js
echo "  8009992," >> stresstest.js
echo "  4499999," >> stresstest.js
echo "  1017999," >> stresstest.js
echo "  8508999," >> stresstest.js
echo "  9967999," >> stresstest.js
echo "];" >> stresstest.js
echo "const getDirectedTrafic = () => {" >> stresstest.js
echo "  let rand = Math.random() * 100;" >> stresstest.js
echo "  if (rand < 75) {" >> stresstest.js
echo "    return directedTraffic[Math.floor(Math.random() * directedTraffic.length)];" >> stresstest.js
echo "  } else {" >> stresstest.js
echo "    return Math.ceil(Math.random() * 10000000);" >> stresstest.js
echo "  }" >> stresstest.js
echo "};" >> stresstest.js
echo "export default function() {" >> stresstest.js
echo "  let res = http.get(\`http://54.215.144.139/restaurants/\${getDirectedTrafic()}\`);" >> stresstest.js
echo "  check(res, {" >> stresstest.js
echo "    'status was 200': (r) => r.status === 200," >> stresstest.js
echo "    'transaction time OK': (r) => r.timings.duration < 200," >> stresstest.js
echo "  });" >> stresstest.js
echo "}" >> stresstest.js

echo "{" >> package.json
echo "  \"name\": \"k6\"," >> package.json
echo "  \"version\": \"1.0.0\"," >> package.json
echo "  \"description\": \"Run k6 stress test\"," >> package.json
echo "  \"main\": \"index.js\"," >> package.json
echo "  \"scripts\": {" >> package.json
echo "    \"stress\": \"k6 run stresstest.js\"" >> package.json
echo "  }," >> package.json
echo "  \"author\": \"Jose Velez\"," >> package.json
echo "  \"license\": \"ISC\"," >> package.json
echo "  \"dependencies\": {" >> package.json
echo "    \"k6\": \"0.0.0\"" >> package.json
echo "  }" >> package.json
echo "}" >> package.json

npm i
