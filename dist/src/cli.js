"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.ConfigCommand = void 0;
const cli_1 = require("@boost/cli");
const package_json_1 = __importDefault(require("../package.json"));
const WriteConfig_1 = __importDefault(require("./components/WriteConfig"));
const react_1 = __importDefault(require("react"));
const program = new cli_1.Program({
    bin: 'saf',
    footer: 'Documentation: https://you54f.com',
    name: 'Safbot',
    version: package_json_1.default.version
});
let ConfigCommand = class ConfigCommand extends cli_1.Command {
    run(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = { a: '1' };
            yield this.render(react_1.default.createElement(WriteConfig_1.default, { data: data, path: path }));
        });
    }
};
__decorate([
    cli_1.Arg.Params({
        description: 'Path to file',
        type: 'string',
        required: true
    })
], ConfigCommand.prototype, "run", null);
ConfigCommand = __decorate([
    (0, cli_1.Config)('config', 'Manage configuration files')
], ConfigCommand);
exports.ConfigCommand = ConfigCommand;
let ScaffoldControllerCommand = class ScaffoldControllerCommand extends cli_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Starting process...');
            this.log('Process finished!');
        });
    }
};
ScaffoldControllerCommand.path = 'run';
ScaffoldControllerCommand.description = 'Select a program of your choice';
ScaffoldControllerCommand = __decorate([
    (0, cli_1.Config)('scaffold:controller', 'Scaffold a controller')
], ScaffoldControllerCommand);
let ScaffoldModelCommand = class ScaffoldModelCommand extends cli_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Starting process...');
            this.log('Process finished!');
        });
    }
};
ScaffoldModelCommand.path = 'run';
ScaffoldModelCommand.description = 'Select a program of your choice';
ScaffoldModelCommand = __decorate([
    (0, cli_1.Config)('scaffold:model', 'Scaffold a model')
], ScaffoldModelCommand);
let ScaffoldCommand = class ScaffoldCommand extends cli_1.Command {
    run(...params) {
        console.log('ScaffoldCommand, try --help', ...params);
    }
    constructor() {
        super();
        this.register(new ScaffoldControllerCommand());
        this.register(new ScaffoldModelCommand());
    }
};
ScaffoldCommand = __decorate([
    (0, cli_1.Config)('scaffold', 'Scaffold a template')
], ScaffoldCommand);
class RunCommand extends cli_1.Command {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            this.log('Starting BuildCommand...');
            this.log('BuildCommand finished!');
        });
    }
}
exports.default = RunCommand;
RunCommand.path = 'run';
RunCommand.description = 'Select a program of your choice';
program
    .register(new RunCommand())
    .register(new ScaffoldCommand())
    .register(new ConfigCommand())
    .runAndExit(process.argv.slice(2), () => __awaiter(void 0, void 0, void 0, function* () {
    // CLI code to bootstrap before running
    console.log('hello');
}));
