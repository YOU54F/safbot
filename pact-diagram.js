const Diagram = require('cli-diagram');

const pactDiagramConsumerDriven = () => {
  const consumerunittest = new Diagram()
    .box('unit test')
    .arrow(['-->'])
    .box('mock provider\n (Pact)');
  const providerunittest = new Diagram()
    .box('mock consumer\n (Pact)')
    .arrow(['-->'])
    .box('unit test');
  const diagram = new Diagram()
    .box(`Consumer
${consumerunittest}
Pact will act as our Mock Provider
Ensuring interactions are fulfilled
Generating a Pact contract
Publishes to Pactflow`
    )
    .arrow(['-->:pact'])
    .box('Pactflow Broker\n(Consumer Driven)\n\n\n\nwe use\ncan-i-deploy to\ngate deployments')
    .arrow(['-->:webhook', '<--:results']).box(`Provider 
${providerunittest}
Reads the Pact Contract
Pact will act our Mock Client
Verifies against the running Provider
Publishes results to Pactflow`);
  return diagram.draw();
};


const pactDiagramBiDirectional = () => {
    const consumerunittest = new Diagram()
      .box('unit test')
      .arrow(['-->'])
      .box('mock provider\n (BYO tool)');
    const providerunittest = new Diagram()
      .box('Generate OpenAPI spec\n (BYO tool)')
      .arrow(['<--'])
      .box('Functional testing\n (BYO tool)');
    const diagram = new Diagram()
      .box(`Consumer
${consumerunittest}
Bring your own Mocking tool of choice
Ensure your interactions are fulfilled
Convert your mocks into a Pact contract
Publish to Pactflow`
      )
      .arrow(['-->:pact'])
      .box('Pactflow Broker\n(Bi-Directional)\n\nwe perform cross \ncontract verification\nis performed to ensure\nfield level compliance\n\nwe use can-i-deploy\nto gate deployments')
      .arrow(['<--:provider contract']).box(`Provider 
${providerunittest}
Design First or Provider First workflows
Craft an OpenAPI specification or generate from code
Functionally test your Provider against the specification
Publishes OpenAPI and verification results to Pactflow
This forms the Provider Contract`);
    return diagram.draw();
  };
  

console.log(pactDiagramConsumerDriven());
console.log(pactDiagramBiDirectional());
