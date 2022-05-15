safbot pactflow:curl --get \
    --data-urlencode "consumer=foo" \
    --data-urlencode "provider=bar" \
    --data-urlencode "template=javascript-node-consumer-jest" \
    --data-urlencode "token=env-var" \
    --data-urlencode "createConsumer=false" \
    --data-urlencode "createProvider=false" \
    $PACT_BROKER_BASE_URL/generate-project.zip

# https://github.com/pactflow/example-project-templates/blob/main/manifest.json

cat pactflow-example-projects.json | jq -r '.exampleTemplates[] | select(.type | contains("consumer"))|{category}|join(" ")'

# javascript-node-consumer-mocha
# javascript-node-consumer-jest
# java-gradle-consumer-junit
# java-gradle-consumer-junit5

cat pactflow-example-projects.json | jq -r '.exampleTemplates[] | select(.type | contains("provider"))|{category}|join(" ")'
# javascript-node-provider-mocha
# javascript-node-provider-jest
# java-gradle-provider-spring_junit
# java-gradle-provider-spring_junit5
