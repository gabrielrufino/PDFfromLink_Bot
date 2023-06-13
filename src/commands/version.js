import module from 'node:module';

const require = module.createRequire(import.meta.url);
const { version: VERSION } = require('../../package.json');

export const version = (context) => context.reply(VERSION);
