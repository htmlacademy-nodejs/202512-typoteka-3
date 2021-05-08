const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);
const server = require(`./server`);
const fill = require(`./fill`);

const Cli = {
  [help.name]: help,
  [generate.name]: generate,
  [version.name]: version,
  [server.name]: server,
  [fill.name]: fill,
};

module.exports = {
  Cli
};
