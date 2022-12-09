import { Command, Flags } from "@oclif/core";

import { exec } from "child_process";
import fetch from "cross-fetch";
import { getTokenFromCLI } from "./cognito";

declare var global: any;
global.fetch = fetch;

class pactflowcurl extends Command {
  static description = "describe the command here";

  static flags = {
    version: Flags.version({ char: "v" }),
    help: Flags.help(),
    login: Flags.boolean({ description: "Login Cognito credentials" }),
    cookie: Flags.boolean({ description: "Reset Cognito credentials" }),
    storage: Flags.string({
      description: "Cookie Store (SqlLite). Defaults to '/var/tmp'. ",
    }),
    getToken: Flags.boolean({
      description: "Returns your Pactflow RW token",
    }),
    downloadProject: Flags.string({
      description: "download a project",
      required: false,
      defaultHelp: JSON.stringify({
        consumer: "foo",
        provider: "bar",
        template: "javascript-node-consumer-jest",
        token: "env-var",
        createConsumer: false,
        createProvider: false,
        outputFolder: "templates",
      }),
    }),
    username: Flags.string({ description: "Pactflow User name" }),
    password: Flags.string({ description: "Pactflow User password" }),
  };

  static strict = false;

  async run() {
    const { flags } = await this.parse(pactflowcurl);
    console.log(flags);
    const cognitoSetup = {
      UserPoolId: "ap-southeast-2_x0L1olP0D",
      ClientId: "7t2s56arpg424kh7ou60apca8m",
      login: flags.login,
      storage: flags.storage,
      Username: flags.username,
      Password: flags.password,
    };
    interface DownloadProjectOpts {
      consumer: string;
      provider: string;
      template: string;
      token: string;
      createConsumer: boolean;
      createProvider: boolean;
      outputFolder: string;
    }
    const { downloadProject, getToken } = flags;

    try {
      const cognitoToken: {
        accessToken: string;
        idToken: string;
        refreshToken: string;
        cookie: string;
      } = await getTokenFromCLI(cognitoSetup);
      const signedCommand = (command: string) =>
        `${command} -H 'cookie: ${cognitoToken.cookie}' -s`;
      const getTokensCommand = "curl $PACT_BROKER_BASE_URL/settings/tokens";
      let downloadProjectCommand;
      if (downloadProject) {
        const downloadProjectDefaults: DownloadProjectOpts = {
          consumer: "foo",
          provider: "bar",
          template: "javascript-node-consumer-jest",
          token: "env-var",
          createConsumer: false,
          createProvider: false,
          outputFolder: "templates",
        };
        let projectOpts: DownloadProjectOpts;
        try {
          projectOpts = JSON.parse(downloadProject);
        } catch (err) {
          projectOpts = downloadProjectDefaults;
          console.log(downloadProject);
          console.log(
            "failed parse options downloading file with following opts",
            projectOpts
          );
        }
        downloadProjectCommand = `curl -v \
        --get \
        ${process.env.PACT_BROKER_BASE_URL}/generate-project.zip \
        --data-urlencode "consumer=${projectOpts.consumer}" \
        --data-urlencode "provider=${projectOpts.provider}" \
        --data-urlencode "template=${projectOpts.template}" \
        --data-urlencode "token=${projectOpts.token}" \
        --data-urlencode "createConsumer=${projectOpts.createConsumer}" \
        --data-urlencode "createProvider=${projectOpts.createProvider}" \
        -o ${projectOpts.outputFolder}/${projectOpts.template}.zip`;
      }

      const commandToRun = getToken
        ? getTokensCommand
        : downloadProject
        ? downloadProjectCommand
        : false;
      if (!commandToRun) {
        console.log(
          "please pass a command to run with --getToken or --downloadProject"
        ),
          process.exit(1);
      }
      exec(signedCommand(commandToRun), (err, stdout, stderr) => {
        this.log(stdout, stderr);
        process.exit();
      });
    } catch (error) {
      this.log(error);
      return true;
    }
  }
}

module.exports = pactflowcurl;
