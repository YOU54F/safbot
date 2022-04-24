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
    userpool: Flags.string({ description: 'Congito User Pool ID' }),
    cognitoclient: Flags.string({ description: 'Cognito Client App ID' }),
    reset: Flags.boolean({ description: 'Reset Cognito credentials' }),
    storage: Flags.string({
      description: "Persistent storage catalogue. Defaults to '/var/tmp'. "
    }),
    header: Flags.string({
      description:
        "Name HTTP header with authorization token. Defaults to 'Authorization'"
    }),
    run: Flags.string({
      description: 'Command to be runned and  sign with -H Autorization token'
    }),
    token: Flags.boolean({
      description: 'Token to stdout instead of running a curl command'
    }),
    username: Flags.string({ description: 'Congito User name' }),
    password: Flags.string({ description: 'Congito User password' })
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

    const { run: command, header = 'cookie', token } = flags;

    if (!command)
      console.log('please pass a command to run with --run "command"'),
        process.exit(1);
    try {
      const cognitoToken: {
        accessToken: string;
        idToken: string;
        refreshToken: string;
      } = await getTokenFromCLI(cognitoSetup);
      if (token) {
        this.log(
          'if we got a token from the user just exit? no valid check. hmmm...',
          token
        );
        process.exit(0);
      } else {
        this.log(
          'if a token wasnt passed again. whut...',
          header,
          cognitoToken,
          command
        );
        const cookie =
          header +
          `: id_token=${cognitoToken.idToken};access_token=${cognitoToken.accessToken};refresh_token=${cognitoToken.refreshToken};`;
        const signedCommand = `${command} -H '${cookie}: ${cognitoToken}' -s`;
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