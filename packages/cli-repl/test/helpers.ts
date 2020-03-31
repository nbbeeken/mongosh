import { spawn } from 'child_process';
import path from 'path';
import stripAnsi from 'strip-ansi';

export async function eventually(fn, options: { frequency?: number, timeout?: number } = {}) {
  options = {
    frequency: 100,
    timeout: 10000,
    ...options
  };

  let attempts = Math.round(options.timeout / options.frequency);
  let err;

  while(attempts) {
    attempts--;

    try {
      await fn();
      return;
    } catch (e) {
      err = e;
    }

    await new Promise(resolve => setTimeout(resolve, options.frequency));
  }

  throw err;
}

const openShells = [];

export function startShell(...args) {
  const execPath = path.resolve(__dirname, '..', 'bin', 'mongosh.js');

  const shell = spawn('node', [execPath, ...args], {
    stdio: [ 'pipe', 'pipe', 'pipe' ]
  });

  const stdio = {
    stdin: shell.stdin,
    output: '',
    stdout: '',
    stderr: ''
  }

  shell.stdout.on('data', (chunk) => {
    const plainChunk = stripAnsi(chunk.toString());
    stdio.output += plainChunk;
    stdio.stdout += plainChunk;
  });

  shell.stderr.on('data', (chunk) => {
    const plainChunk = stripAnsi(chunk.toString());
    stdio.output += plainChunk;
    stdio.stderr += plainChunk;
  });

  openShells.push(shell);

  return {
    process: shell,
    stdio,
  };
}

export function killOpenShells() {
  while(openShells.length) {
    openShells.pop().kill();
  }
}