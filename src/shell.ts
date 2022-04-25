import shell from 'shelljs';

const displayHelp = (programName: string) => {
  shell.echo('__________', '\n');
  shell.echo(programName, '\n');
  shell.echo('__________', '\n');
  shell.exec(`$(npm bin)/${programName} --help`);
};

const displayExample = (programName: string, command: string) => {
  shell.echo('__________', '\n');
  shell.echo(programName, '\n');
  shell.echo('__________', '\n');
  shell.exec(command);
};

shell.echo('*** TOOLS ***', '\n');
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

shell.echo('*** Examples of Operation ***', '\n');

displayExample('newman-slack', 'yarn run newman-slack');
displayExample('newman-wrapper', 'yarn run newman-wrapper');
displayExample('postman2openapi', 'yarn run postman2openapi');
displayExample('newman-collection', 'yarn run newman-collection');
displayExample('swagger-to-sample-code', 'yarn run swagger-to-sample-code');
// displayExample('pact-login',"yarn run pact-login")
displayExample('pact-diagram', 'yarn run pact-diagram');
