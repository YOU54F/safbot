
   
const { transpile } = require('postman2openapi');
const fs = require('fs')

const postmanCollection = require("../samples/postman-collection.json")
const postman = JSON.stringify(postmanCollection);
const openapi = transpile(postman, 'yaml');
const filePath = __dirname + "/../samples/oas-generated-from-postman.yml"
fs.writeFileSync(filePath, openapi);

console.log('Postman collection successfully converted to OAS and stored at the following location',filePath)