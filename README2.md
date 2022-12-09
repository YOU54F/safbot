# Pactflow-Cli

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

## Tools

- `pactflow:curl`
  - `export $PACT_BROKER_BASE_URL`
  - `export $PACTFLOW_USERNAME`
  - `export $PACTFLOW_PASSWORD`
  - Usage: `curl:pactflow <path>`
  - Fetch Fresh Tokens `curl:pactflow --reset <path>`
  - Example `curl:pactflow $PACT_BROKER_BASE_URL/settings/tokens`
