const generateCode = require('swagger-to-sample-code');

generateCode('https://petstore.swagger.io/v2/swagger.json', ['nodejs', 'java'])
  .then((results) => results.map((snippet) => console.log(snippet)))
//   .then((results) => results.map((snippet) => console.log(snippet.samples[0].source)))
  .catch((e) => console.log(e));

// you can also pass Swagger JSON or String in place of Swagger url.
