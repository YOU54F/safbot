#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = __importDefault(require("shelljs"));
const displayHelp = (programName) => {
    shelljs_1.default.echo('__________', '\n');
    shelljs_1.default.echo(programName, '\n');
    shelljs_1.default.echo('__________', '\n');
    shelljs_1.default.exec(`$(npm bin)/${programName} --help`);
};
const displayExample = (programName, command) => {
    shelljs_1.default.echo('__________', '\n');
    shelljs_1.default.echo(programName, '\n');
    shelljs_1.default.echo('__________', '\n');
    shelljs_1.default.exec(command);
};
shelljs_1.default.echo('*** Heath Robinson ***', '\n');
shelljs_1.default.echo('*** A collection of CLI tools ***', '\n');
shelljs_1.default.echo('*** TOOLS ***', '\n');
// Also serves as documentation
displayHelp('newman');
displayHelp('portman');
displayHelp('postman');
displayHelp('pmpact');
displayHelp('postman-to-k6');
displayHelp('postman-collection-transformer');
displayHelp('p2o');
displayHelp('openapi2postmanv2');
displayHelp('openapi-format');
displayHelp('oas-validate');
displayHelp('swagger2openapi');
displayHelp('swagger-mock-validator');
displayHelp('cy-openapi');
displayHelp('handlebars');
displayHelp('prism');
displayHelp('spectral');
displayHelp('curlx');
displayHelp('postman2md');
displayHelp('pmac');
displayHelp('pat');
displayHelp('xml2js');
displayHelp('js-yaml');
displayHelp('postbox-split');
displayHelp('postbox-merge');
displayHelp('redoc-cli');
displayHelp('wsdl-to-ts');
displayHelp('openapi-diff');
shelljs_1.default.echo('*** Examples of Operation ***', '\n');
displayExample('newman-slack', 'yarn run newman-slack');
displayExample('newman-wrapper', 'yarn run newman-wrapper');
displayExample('postman2openapi', 'yarn run postman2openapi');
displayExample('newman-collection', 'yarn run newman-collection');
displayExample('swagger-to-sample-code', 'yarn run swagger-to-sample-code');
// displayExample('pact-login',"yarn run pact-login")
displayExample('pact-diagram', 'yarn run pact-diagram');
displayExample('pact-json-schema', 'yarn run pact-json-schema');
