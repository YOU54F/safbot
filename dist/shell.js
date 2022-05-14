#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = __importDefault(require("shelljs"));
const argv = process.argv.slice(2);
const runProgram = (argv) => {
    switch (argv[0]) {
        case "list:examples":
            console.log("Showing a demo of some programs");
            shelljs_1.default.echo("__________", "\n");
            displayExamples();
            break;
        case "list:help":
            console.log("Showing help for all available programmes");
            shelljs_1.default.echo("__________", "\n");
            displayAllHelps();
            break;
        case undefined:
            console.log("try a command");
            shelljs_1.default.echo("__________", "\n");
            displayAllCommands();
            break;
        case "curl:pactflow":
            console.log("access your broker");
            // shell.exec(
            //   `$(npm bin)/ts-node ./src/cognitocli/runner.ts   --header cookie --cognitoclient 7t2s56arpg424kh7ou60apca8m --userpool ap-southeast-2_x0L1olP0D --run 'curl ${argv.join(
            //     " "
            //   )}'`
            // );
            shelljs_1.default.exec(`node ./dist/cognitocli/runner.js   --header cookie --cognitoclient 7t2s56arpg424kh7ou60apca8m --userpool ap-southeast-2_x0L1olP0D --run 'curl ${argv.join(" ")}'`);
            break;
        default:
            shelljs_1.default.echo("__________", "\n");
            shelljs_1.default.echo("Executing", argv[0], "\n");
            shelljs_1.default.echo("__________", "\n");
            shelljs_1.default.exec(`$(npm bin)/${argv.join(" ")}`);
            break;
    }
};
const displayHelp = (programName) => {
    shelljs_1.default.echo("__________", "\n");
    shelljs_1.default.echo(programName, "\n");
    shelljs_1.default.echo("__________", "\n");
    shelljs_1.default.exec(`$(npm bin)/${programName} --help`);
};
const displayExample = (programName, command) => {
    shelljs_1.default.echo("__________", "\n");
    shelljs_1.default.echo(programName, "\n");
    shelljs_1.default.echo("__________", "\n");
    shelljs_1.default.exec(command);
};
shelljs_1.default.echo("*** Heath Robinson ***", "\n");
shelljs_1.default.echo("*** A collection of CLI tools ***", "\n");
// shell.echo('*** TOOLS ***', '\n');
// // Also serves as documentation
const displayAllHelps = () => {
    displayHelp("newman");
    displayHelp("portman");
    displayHelp("postman");
    displayHelp("pmpact");
    displayHelp("postman-to-k6");
    displayHelp("postman-collection-transformer");
    displayHelp("p2o");
    displayHelp("openapi2postmanv2");
    displayHelp("openapi-format");
    displayHelp("oas-validate");
    displayHelp("swagger2openapi");
    displayHelp("swagger-mock-validator");
    displayHelp("cy-openapi");
    displayHelp("handlebars");
    displayHelp("prism");
    displayHelp("spectral");
    displayHelp("curlx");
    displayHelp("postman2md");
    displayHelp("pmac");
    displayHelp("xml2js");
    displayHelp("js-yaml");
    displayHelp("postbox-split");
    displayHelp("postbox-merge");
    displayHelp("redocly");
    displayHelp("wsdl-to-ts");
    displayHelp("openapi-diff");
};
const displayAllCommands = () => {
    console.log("list:help");
    console.log("list:examples");
    console.log("newman");
    console.log("portman");
    console.log("postman");
    console.log("pmpact");
    console.log("postman-to-k6");
    console.log("postman-collection-transformer");
    console.log("p2o");
    console.log("openapi2postmanv2");
    console.log("openapi-format");
    console.log("oas-validate");
    console.log("swagger2openapi");
    console.log("swagger-mock-validator");
    console.log("cy-openapi");
    console.log("handlebars");
    console.log("prism");
    console.log("spectral");
    console.log("curlx");
    console.log("postman2md");
    console.log("pmac");
    console.log("xml2js");
    console.log("js-yaml");
    console.log("postbox-split");
    console.log("postbox-merge");
    console.log("redocly");
    console.log("wsdl-to-ts");
    console.log("openapi-diff");
    // console.log('newman-slack', 'yarn run newman-slack');
    // console.log('newman-wrapper', 'yarn run newman-wrapper');
    // console.log('postman2openapi', 'yarn run postman2openapi');
    // console.log('newman-collection', 'yarn run newman-collection');
    // console.log('swagger-to-sample-code', 'yarn run swagger-to-sample-code');
    // // console.log('pact-login',"yarn run pact-login")
    // console.log('pact-diagram', 'yarn run pact-diagram');
    // console.log('pact-json-schema', 'yarn run pact-json-schema');
};
const displayExamples = () => {
    displayExample("newman-slack", "yarn run newman-slack");
    displayExample("newman-wrapper", "yarn run newman-wrapper");
    displayExample("postman2openapi", "yarn run postman2openapi");
    displayExample("newman-collection", "yarn run newman-collection");
    displayExample("swagger-to-sample-code", "yarn run swagger-to-sample-code");
    // displayExample('pact-login',"yarn run pact-login")
    displayExample("pact-diagram", "yarn run pact-diagram");
    displayExample("pact-json-schema", "yarn run pact-json-schema");
};
runProgram(argv);
