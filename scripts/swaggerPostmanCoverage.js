const coverage = require("swagger-coverage-postman");
const refParser = require("json-schema-ref-parser");
const path = require('path')

const oas = "../samples/oas-v3.0.1.yml"
const postmanCollection = "../samples/postman-collection.json"


const main = async (oas,postmanCollection)=>{

    // Load swagger file
const apiFile = path.join(__dirname, oas);
const api = await refParser.dereference(apiFile);

// Load postman integration test file
const integrationTestsFile = path.join(__dirname, postmanCollection);
const integrationTests = require(integrationTestsFile);

// Calculate coverage summary
const coverageSummary = await coverage.summary(api, integrationTests);

console.log(coverageSummary);
// { paths: 1, methods: 0.86, parameters: 0.15 } 
}
main(oas,postmanCollection)