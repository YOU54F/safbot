"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@oclif/core");
const child_process_1 = require("child_process");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const clibased_1 = require("./clibased");
global.fetch = cross_fetch_1.default;
class cognitocurl extends core_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            const { flags } = yield this.parse(cognitocurl);
            const cognitoSetup = {
                UserPoolId: flags.userpool,
                ClientId: flags.cognitoclient,
                reset: flags.reset,
                storage: flags.storage,
                Username: flags.username,
                Password: flags.password,
            };
            const { run: command, header, token } = flags;
            try {
                const cognitoToken = yield (0, clibased_1.getTokenFromCLI)(cognitoSetup);
                if (token) {
                    // user requested to see stored tokens instead of running curl command
                    this.log("your token is", cognitoToken);
                    process.exit(0);
                }
                else {
                    // this.log("Running curl command", command);
                    if (!command)
                        console.log('please pass a command to run with --run "command"'),
                            process.exit(1);
                    const signedCommand = `${command} -H '${header}: ${header === "cookie" ? cognitoToken.cookie : cognitoToken.idToken}' -s`;
                    (0, child_process_1.exec)(signedCommand, (err, stdout, stderr) => {
                        this.log(stdout, stderr);
                        process.exit();
                    });
                }
            }
            catch (error) {
                this.log(error);
                return true;
            }
        });
    }
}
cognitocurl.description = "describe the command here";
cognitocurl.flags = {
    version: core_1.Flags.version({ char: "v" }),
    help: core_1.Flags.help(),
    userpool: core_1.Flags.string({
        description: "Cognito User Pool ID",
        default: "",
    }),
    cognitoclient: core_1.Flags.string({ description: "Cognito Client App ID" }),
    reset: core_1.Flags.boolean({ description: "Reset Cognito credentials" }),
    storage: core_1.Flags.string({
        description: "Persistent storage catalogue. Defaults to '/var/tmp'. ",
    }),
    header: core_1.Flags.string({
        description: "Name HTTP header with cookie token. Defaults to 'cookie'",
    }),
    run: core_1.Flags.string({
        description: "Curl command to be run and sign with -H cookie token",
    }),
    token: core_1.Flags.boolean({
        description: "Token to stdout instead of running a curl command",
    }),
    username: core_1.Flags.string({ description: "Cognito User name" }),
    password: core_1.Flags.string({ description: "Cognito User password" }),
};
cognitocurl.strict = false;
module.exports = cognitocurl;
