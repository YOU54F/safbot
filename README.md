# Safbot

Various cli tools I find useful, all rolled up in one

Very likely to change xD

## Installation

On Demand

- `npx safbot <command>`

Globally

- `npm -g install safbot`
- `yarn global add safbot`

Run one of the tools listed below

- `safbot <command>`
- `safbot <command> --help`
- `safbot list:examples`
- `safbot list:help`

## Tools

- `pactflow:curl`
  - `export $PACT_BROKER_BASE_URL`
  - `export $PACTFLOW_USERNAME`
  - `export $PACTFLOW_PASSWORD`
  - Usage: `curl:pactflow <path>`
  - Fetch Fresh Tokens `curl:pactflow --reset <path>`
  - Example `curl:pactflow $PACT_BROKER_BASE_URL/settings/tokens`
- `newman`
- `newman-slack`
- `newman-wrapper`
- `newman-collection`
- `portman`
- `postman-k6`
- `postman2md`
- `postman-cli`
- `postman-pact`
- `postman2openapi`
- `postman-coverage`
- `postman-to-swagger`
- `postman-to-openapi`
- `postman-collection`
- `postman-collection-gen`
- `postman-collection-transformer`
- `swagger-pact`
- `swagger2openapi`
- `swagger-to-sample-code`
- `coverage-swagger-postman`
- `oas-validate`
- `openapi-format`
- `openapi2postmanv2`
- `pat`
- `pmac`
- `curlx`
- `prism`
- `ufonaut`
- `spectral`
- `handlebars`
- `cy-openapi`
- `pact-login`
- `pact-diagram`
- `postbox-split`
- `postbox-merge`

temp removed, typescript file shouldnt be in there

- `"newman-collection": "ts-node ./src/newmanCollection.ts",` build errors
