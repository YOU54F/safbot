var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const coverage = require("swagger-coverage-postman");
const refParser = require("json-schema-ref-parser");
const path = require('path');
const main = () => __awaiter(this, void 0, void 0, function* () {
    const oas = "../samples/oas-v3.0.1.yml";
    const postmanCollection = "../samples/test.postman_collection.json";
    // Load swagger file
    const apiFile = path.join(__dirname, oas);
    const api = yield refParser.dereference(apiFile);
    // Load postman integration test file
    const integrationTestsFile = path.join(__dirname, postmanCollection);
    const integrationTests = require(integrationTestsFile);
    // Calculate coverage summary
    const coverageSummary = yield coverage.summary(api, integrationTests);
    console.log(coverageSummary);
    // { paths: 1, methods: 0.86, parameters: 0.15 } 
});
main();
