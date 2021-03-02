const help = require(`./help`);
const version = require(`./version`);
const generate = require(`./generate`);

const Cli = {
  [help.name]: help,
  [generate.name]: generate,
  [version.name]: version
};

module.exports = {
  Cli
};
