# foo Pact example project using Jest

This example is a really simple demonstration of the use of Pact in Jest tests.

Places where you need to make changes are marked with TODO comments

To run the tests:

```console
npm install
npm test
```

The important files in this project:

`foo.js` - This is the consumer code that will access your provider. You should replace this 
with your actual consumer code.

`__tests__/foo.spec.js` - This is the Pact consumer test that invokes the consumer code.

## Comments about Jest

To avoid race conditions if you have multiple pact specs, we recommend running Jest '[in band](https://facebook.github.io/jest/docs/en/cli.html#runinband)'. 
If you are running a large unit test suite you may want to run that separately as a result to take advantage of 
the concurrency of jest (although this is not always faster). To achieve this you can get your pact tests to have 
a suffix of '.pact.js' and add the following Jest argument to your pact task in npm:

```
--testRegex \"/*(.test.pact.js)\""
```

This example uses [`jest-pact`](https://github.com/pact-foundation/jest-pact)

## Publishing the pact file

Running the tests ( if they pass ;-) ) will generate a pact file `pacts/foo-bar.json`.
You can publish this to your broker by running `npm run test:publish`.

Generally, you would do this from your CI server.


**REMEMBER to set the PACTFLOW_TOKEN environment variable with a valid token before running this!**

  
The script in `test/publish.js` needs to be updated to set the correct version and branch environment variables
for your CI system.
