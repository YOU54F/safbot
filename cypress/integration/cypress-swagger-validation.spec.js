describe('Basic API checks', () => {
  it('Should be a valid swagger schema', function () {
      cy.task('validateSwaggerFile', {
          file: './testing/swagger.json',  // optional path or full URL, see below
      }).should('equal', null);
  });

  it('Should return a valid health payload', function () {
      cy.request('/healthz').then($response => {
          // Check the swagger schema:
          cy.task('validateSwaggerSchema', {
              file:           './testing/swagger.json',  // optional path or full URL, see below
              endpoint:       '/healthz',
              method:         'get',
              statusCode:     200,
              responseSchema: $response.body,
              verbose:        true,                      // optional, default: false
          }).should('equal', null);
      });
  });
});

// Then in your cypress Plugins file:



// const {SwaggerValidation} = require('@jc21/cypress-swagger-validation');

// module.exports = (on, config) => {
//   // ...
//   on('task', SwaggerValidation(config));
//   // ...
//   return config;
// };