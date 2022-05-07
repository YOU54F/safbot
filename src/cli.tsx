import { ArgList } from '@boost/args';
import { Arg, Command, Config, Program } from '@boost/cli';
import pkg from '../package.json';
import WriteConfig from './components/WriteConfig';
import React from 'react';

const program = new Program({
  bin: 'saf',
  footer: 'Documentation: https://you54f.com',
  name: 'Safbot',
  version: pkg.version
});

@Config('config', 'Manage configuration files')
export class ConfigCommand extends Command {
  @Arg.Params({
    description: 'Path to file',
    type: 'string',
    required: true
  })
  async run(path: string) {
    const data = { a: '1' };
    await this.render(<WriteConfig data={data} path={path} />);
  }
}

@Config('scaffold:controller', 'Scaffold a controller')
class ScaffoldControllerCommand extends Command {
  static path: string = 'run';
  static description: string = 'Select a program of your choice';
  async run() {
    this.log('Starting process...');

    this.log('Process finished!');
  }
}

@Config('scaffold:model', 'Scaffold a model')
class ScaffoldModelCommand extends Command {
  static path: string = 'run';
  static description: string = 'Select a program of your choice';
  async run() {
    this.log('Starting process...');

    this.log('Process finished!');
  }
}

@Config('scaffold', 'Scaffold a template')
class ScaffoldCommand extends Command {
  run(...params: ArgList) {
    console.log('ScaffoldCommand, try --help', ...params);
  }
  constructor() {
    super();

    this.register(new ScaffoldControllerCommand());
    this.register(new ScaffoldModelCommand());
  }
}

export default class RunCommand extends Command {
  static path: string = 'run';
  static description: string = 'Select a program of your choice';
  async run() {
    this.log('Starting BuildCommand...');

    this.log('BuildCommand finished!');
  }
}

program
  .register(new RunCommand())
  .register(new ScaffoldCommand())
  .register(new ConfigCommand())
  .runAndExit(process.argv.slice(2), async () => {
    // CLI code to bootstrap before running
    console.log('hello');
  });
