PACTICIPANT := "pactflow-example-bi-directional-provider-swaggerhub"
PACT_CLI="docker run --rm -v ${PWD}:/app -w "/app" -e PACT_BROKER_BASE_URL -e PACT_BROKER_TOKEN --env=PACTFLOW_FEATURES=publish-provider-contract pactfoundation/pact-cli:0.50.0.26"
## ====================
## SwaggerHub 
## ====================
SWAGGERHUB_CLI:="./$(npm bin)/swaggerhub"
API_AUTOMOCKING_TEMPLATE_URL=https://raw.githubusercontent.com/SmartBear/swaggerhub-cli/master/examples/integrations/api_auto_mocking.json
API_AUTOMOCKING_TEMPLATE_FILE=integrations/api_auto_mocking.json
## Swaggerhub user provided data
swagger_org?=YOU54F
swagger_api_name?=pactdemo
swagger_version?=1
## ====================
## Pactflow Provider Publishing
## ====================
OAS_FILE_PATH?=oas/products.yml
REPORT_FILE_PATH?=output/report.md
REPORT_FILE_CONTENT_TYPE?=text/plain
VERIFIER_TOOL?=dredd
## ====================

# Only deploy from main
ifeq ($(GIT_BRANCH),main)
	DEPLOY_TARGET=deploy
else
	DEPLOY_TARGET=no_deploy
endif

all: test

## ====================
## CI tasks
## ====================

ci:
	@if make test; then \
		make publish_success; \
	else \
		make publish_failure; \
	fi; \

publish_success: .env
	@echo "\n========== STAGE: publish provider contract (spec + results) - success ==========\n"
	PACTICIPANT=${PACTICIPANT} \
	"${PACT_CLI}" pactflow publish-provider-contract \
      /app/${OAS_FILE_PATH} \
      --provider ${PACTICIPANT} \
      --provider-app-version ${GIT_COMMIT} \
      --branch ${GIT_BRANCH} \
      --content-type application/yaml \
      --verification-exit-code=0 \
      --verification-results /app/${REPORT_FILE_PATH} \
      --verification-results-content-type ${REPORT_FILE_CONTENT_TYPE}\
      --verifier ${VERIFIER_TOOLL}

publish_failure: .env
	@echo "\n========== STAGE:  publish provider contract (spec + results) - failure  ==========\n"
	PACTICIPANT=${PACTICIPANT} \
	"${PACT_CLI}" pactflow publish-provider-contract \
      /app/${OAS_FILE_PATH} \
      --provider ${PACTICIPANT} \
      --provider-app-version ${GIT_COMMIT} \
      --branch ${GIT_BRANCH} \
      --content-type application/yaml \
      --verification-exit-code=1 \
      --verification-results ${REPORT_FILE_PATH} \
      --verification-results-content-type ${REPORT_FILE_CONTENT_TYPE}\
      --verifier ${VERIFIER_TOOLL}

# Run the ci target from a developer machine with the environment variables
# set as if it was on Github Actions.
# Use this for quick feedback when playing around with your workflows.
fake_ci: .env
	@CI=true \
	GIT_COMMIT=`git rev-parse --short HEAD` \
	GIT_BRANCH=`git rev-parse --abbrev-ref HEAD` \
	PACT_BROKER_PUBLISH_VERIFICATION_RESULTS=true \
	make ci; 
	GIT_COMMIT=`git rev-parse --short HEAD` \
	GIT_BRANCH=`git rev-parse --abbrev-ref HEAD` \
	make deploy_target

deploy_target: can_i_deploy $(DEPLOY_TARGET)

## =====================
## Build/test tasks
## =====================

test:
	@echo "\n========== STAGE: test ✅ ==========\n"
	npm run test

## =====================
## Deploy tasks
## =====================

deploy: deploy_app record_deployment

no_deploy:
	@echo "Not deploying as not on master branch"

can_i_deploy: .env
	@echo "\n========== STAGE: can-i-deploy? 🌉 ==========\n"
	"${PACT_CLI}" broker can-i-deploy --pacticipant ${PACTICIPANT} --version ${GIT_COMMIT} --to-environment production

deploy_app:
	@echo "\n========== STAGE: deploy 🚀 ==========\n"
	@echo "Deploying to prod"

record_deployment: .env
	@"${PACT_CLI}" broker record_deployment --pacticipant ${PACTICIPANT} --version ${GIT_COMMIT} --environment production

## =====================
## Pactflow set up tasks
## =====================

## ======================
## SwaggerHub set up tasks
## ======================

swaggerhub_setup_provider: swaggerhub_create_api swaggerhub_create_integration swaggerhub_enable_integration get_provider_automocked_endpoint healthcheck_provider_automocked_endpoint

swaggerhub_to_pactflow_fake_ci:
	GIT_COMMIT=`git rev-parse --short HEAD` \
	GIT_BRANCH=`git rev-parse --abbrev-ref HEAD` \
	PACT_BROKER_PUBLISH_VERIFICATION_RESULTS=true \
	make swaggerhub_test_mock_publish_provider_contract_to_pactflow;
	GIT_COMMIT=`git rev-parse --short HEAD` \
	GIT_BRANCH=`git rev-parse --abbrev-ref HEAD` \
	make deploy_target


swaggerhub_test_mock_publish_provider_contract_to_pactflow:
	# GIT_COMMIT=`git rev-parse --short HEAD` \
	# GIT_BRANCH=`git rev-parse --abbrev-ref HEAD` \
	# PACT_BROKER_PUBLISH_VERIFICATION_RESULTS=true
	@if make test_provider_automocked_endpoint; then \
		make publish_success; \
	else \
		make publish_failure; \
	fi; \

swaggerhub_create_api:
	@echo "\n========== STAGE: Design ==========\n"
	@echo "Uploading API to SwaggerHub"
	swaggerhub api:create ${swagger_org}/${swagger_api_name}/${swagger_version} --visibility=public -f ${OAS_FILE_PATH}

swaggerhub_download_integration:
	curl ${API_AUTOMOCKING_TEMPLATE_URL} -o ${API_AUTOMOCKING_TEMPLATE_FILE}

swaggerhub_create_integration:
	@echo "Creating Automock Integration"
	swaggerhub integration:create ${swagger_org}/${swagger_api_name}/${swagger_version} -f ${API_AUTOMOCKING_TEMPLATE_FILE}

swaggerhub_enable_integration:
	@echo "Enabling Automock Integration"
	swaggerhub integration:list ${swagger_org}/${swagger_api_name}/${swagger_version} | tail -n 1 | cut -f1,2 -d' ' \
	| xargs echo ${swagger_org}/${swagger_api_name}/${swagger_version} | sed -e "s/ /\//g" | xargs swaggerhub integration:execute

get_provider_automocked_endpoint:
	swaggerhub api:get ${swagger_org}/${swagger_api_name}/${swagger_version} --json | jq -r '.servers[0].url'

healthcheck_provider_automocked_endpoint:
	@echo "Health-Checking Automock Integration"
	make get_provider_automocked_endpoint | xargs -I{} curl {}/product/1 -s | jq .

test_provider_automocked_endpoint:
	@echo "\n========== STAGE: test ✅ ==========\n"
	@echo "Validating OpenAPI spec against Schema"
	swaggerhub api:get ${swagger_org}/${swagger_api_name}/${swagger_version} --json | jq -r '.servers[0].url' | xargs -I{} $(npm bin)/dredd --reporter markdown --output ./output/report.md ${OAS_FILE_PATH} {}

swaggerhub_delete_api:
	@echo "\n========== STAGE: destroy  ==========\n"
	swaggerhub api:delete ${swagger_org}/${swagger_api_name}

## ======================
## Misc
## ======================

.env:
	touch .env

.PHONY: all test clean
