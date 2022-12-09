#!/bin/bash

if [[ -z "$PACT_BROKER_BASE_URL" ]]; then
    echo "Must provide PACT_BROKER_BASE_URL in environment" 1>&2
    exit 1
fi

while getopts c:p:t:l:o: flag; do
    case "${flag}" in
    c) consumer=${OPTARG} ;;
    p) provider=${OPTARG} ;;
    t) template=${OPTARG} ;;
    l) login=${OPTARG} ;;
    o) output_folder=${OPTARG} ;;
    esac
done
echo "consumer: $consumer"
echo "provider: $provider"
echo "template: $template"
echo "login: $login"
echo "output_folder: $output_folder"
echo "PACT_BROKER_BASE_URL: $PACT_BROKER_BASE_URL"

export $consumer=$consumer

$(npm bin)/ts-node ./src/cognitocli/runner.ts \
    --cognitoclient 7t2s56arpg424kh7ou60apca8m \
    --userpool ap-southeast-2_x0L1olP0D \
    --header cookie \
    --run 'curl -v \
    --get \
    $PACT_BROKER_BASE_URL/generate-project.zip \
    --data-urlencode "consumer=${consumer}" \
    --data-urlencode "provider=$provider" \
    --data-urlencode "template=$template" \
    --data-urlencode "token=env-var" \
    --data-urlencode "createConsumer=false" \
    --data-urlencode "createProvider=false" \
    -o $output_folder/$template.zip'

$(npm bin)/ts-node \
    ./src/cognitocli/PactflowRunner.ts \
    --username $PACTFLOW_USERNAME \
    --password $PACTFLOW_PASSWORD \
    --downloadProject \
    '{
"consumer":"foo",
"provider":"bar",
"template":"javascript-node-consumer-mocha",
"token":"env-var",
"createConsumer":false,
"createProvider":false,
"outputFolder":"templates"
}'
