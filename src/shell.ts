#!/usr/bin/env node
import shell from "shelljs";
const argv = process.argv.slice(2);
const path = require("path");

const runProgram = (argv: string[]) => {
  switch (argv[0]) {
    case "pactflow:curl":
      const shouldReset = argv[1] === "--reset";
      const displayHelp = argv[1] === "--help";
      const getToken = argv[1] === "--token" || argv[2] === "--token";
      const downloadTemplate =
        argv[1] === "--generate-project" || argv[2] === "--generate-project";

      if (displayHelp) {
        console.log("access your Pactflow broker from the CLI");
        console.log("Required: $PACTFLOW_USERNAME");
        console.log("Required: $PACTFLOW_PASSWORD");
        console.log(
          "Usage: pactflow:curl <curl opts> $PACT_BROKER_BASE_URL/<PATH>"
        );
        console.log(
          "Example: pactflow:curl -v $PACT_BROKER_BASE_URL/settings/tokens"
        );
        console.log("Reset and refetch credentials");
        console.log(
          "Example: pactflow:curl --reset $PACT_BROKER_BASE_URL/settings/tokens"
        );
        break;
      }
      const setResetFlag = shouldReset ? "--reset" : " ";

      const curlCommand =
        shouldReset || getToken || downloadTemplate
          ? argv.slice(2).join(" ")
          : argv.slice(1).join(" ");

      const curlArgs = [
        setResetFlag,
        "--header cookie",
        "--cognitoclient 7t2s56arpg424kh7ou60apca8m",
        "--userpool ap-southeast-2_x0L1olP0D",
        `--username=${process.env.PACTFLOW_USERNAME}`,
        `--password=${process.env.PACTFLOW_PASSWORD}`,
        "--run ",
      ].join(" ");

      const cognitoRunnerPath = path.join(__dirname, "cognitocli/runner.js");
      const cognitoRunCommand = `node ${cognitoRunnerPath} ${curlArgs}`;
      const cognitoCurlCommand = `"curl ${curlCommand}"`;
      const cognitoDefaultRunCommand = [
        cognitoRunCommand,
        cognitoCurlCommand,
      ].join(" ");
      const tokensUrl = process.env.PACT_BROKER_BASE_URL + "/settings/tokens";
      const generateProjectUrl =
        process.env.PACT_BROKER_BASE_URL + "/generate-project.zip";
      const tokenRunCommand = [
        cognitoRunCommand,
        `"curl ${curlCommand} ${tokensUrl}"`,
      ].join(" ");
      if (getToken) {
        shell.exec(tokenRunCommand);
        break;
      }
      if (downloadTemplate) {
        const allowableProjects = [
          "javascript-node-consumer-mocha",
          "javascript-node-consumer-jest",
          "java-gradle-consumer-junit",
          "java-gradle-consumer-junit5",
          "javascript-node-provider-mocha",
          "javascript-node-provider-jest",
          "java-gradle-provider-spring_junit",
          "java-gradle-provider-spring_junit5",
        ];
        if (!allowableProjects.includes(curlCommand)) {
          console.log("provide one of the following options");
          console.log(allowableProjects);
          break;
        }
        const downloadTemplateArgs = [
          "--get",
          `--data-urlencode consumer=${process.env.PACTFLOW_CONSUMER}`,
          `--data-urlencode provider=${process.env.PACTFLOW_PROVIDER}`,
          `--data-urlencode template=${curlCommand}`,
          `--data-urlencode token=${"env-var"}`,
          `--data-urlencode createConsumer=false`,
          `--data-urlencode createProvider=false`,
        ].join(" ");
        const downloadTemplateCommand = [
          cognitoRunCommand,
          `"curl -s --output ${curlCommand}.zip ${downloadTemplateArgs} ${generateProjectUrl}"`,
        ].join(" ");

        shell.exec(downloadTemplateCommand);
        break;
      } else {
        shell.exec(cognitoDefaultRunCommand);
        break;
      }

      break;
    default:
      console.log("pactflow:curl");
      break;
  }
};

runProgram(argv);
