import { Command, Flags } from '@oclif/core';

import { exec } from 'child_process';
import fetch from 'cross-fetch';
import { getTokenFromCLI } from './clibased';

declare var global: any;
global.fetch = fetch;

class cognitocurl extends Command {
  static description = 'describe the command here';

  static flags = {
    version: Flags.version({ char: 'v' }),
    help: Flags.help(),
    userpool: Flags.string({
      description: 'Congito User Pool ID',
      default: 'ap-southeast-2_x0L1olP0D'
    }),
    cognitoclient: Flags.string({ description: 'Cognito Client App ID' }),
    reset: Flags.boolean({ description: 'Reset Cognito credentials' }),
    storage: Flags.string({
      description: "Persistent storage catalogue. Defaults to '/var/tmp'. "
    }),
    header: Flags.string({
      description: "Name HTTP header with cookie token. Defaults to 'cookie'"
    }),
    run: Flags.string({
      description: 'Curl ommand to be run and sign with -H cookie token'
    }),
    token: Flags.boolean({
      description: 'Token to stdout instead of running a curl command'
    }),
    username: Flags.string({ description: 'Cognito User name' }),
    password: Flags.string({ description: 'Cognito User password' })
  };

  static strict = false;

  async run() {
    const { flags } = await this.parse(cognitocurl);

    const cognitoSetup = {
      UserPoolId: flags.userpool,
      ClientId: flags.cognitoclient,
      reset: flags.reset,
      storage: flags.storage,
      Username: flags.username,
      Password: flags.password
    };

    const { run: command, header, token } = flags;

    try {
      const cognitoToken: {
        accessToken: string;
        idToken: string;
        refreshToken: string;
        cookie: string;
      } = await getTokenFromCLI(cognitoSetup);
      if (token) {
        // user requested to see stored tokens instead of running curl command
        this.log('your token is', cognitoToken);
        process.exit(0);
      } else {
        this.log('Running curl command', command);
        if (!command)
          console.log('please pass a command to run with --run "command"'),
            process.exit(1);
        const signedCommand = `${command} -H '${header}: ${
          header === 'cookie' ? cognitoToken.cookie : cognitoToken.idToken
        }' -s`;
        exec(signedCommand, (err, stdout, stderr) => {
          this.log(stdout, stderr);
          process.exit();
        });
      }
    } catch (error) {
      this.log(error);
      return true;
    }
  }
}

module.exports = cognitocurl;
