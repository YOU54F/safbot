import { parse } from '@boost/args';
import { Command, Program } from '@boost/cli';
import pkg from '../package.json';

// Remove node binary and script
const program = new Program({
  bin: 'saf',
  footer: 'Documentation: https://boostlib.dev',
  name: 'Safbot',
  version: pkg.version
});

export default class BuildCommand extends Command {
    static path: string = 'run';
    static description: string = 'Select a program of your choice';
  async run() {
    this.log('Starting process...');

    this.log('Process finished!');
  }
}

program
  .register(new BuildCommand())
  .runAndExit(process.argv.slice(2), async () => {
    // CLI code to bootstrap before running
    console.log('hello');
  });
