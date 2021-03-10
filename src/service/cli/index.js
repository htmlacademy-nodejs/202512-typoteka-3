const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);
const server = require(`./server`);

const Cli = {
  [help.name]: help,
  [generate.name]: generate,
  [version.name]: version,
  [server.name]: server
};

module.exports = {
  Cli
};
