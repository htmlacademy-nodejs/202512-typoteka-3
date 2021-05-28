const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const ExitCode = {
  SUCCESS: 0,
  EXCEPTION: 1
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  SUCCESS: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const ORANGE = `#ffa500`;

const MAX_ID_LENGTH = 6;

const ENCODING = `utf-8`;

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ORANGE,
  MAX_ID_LENGTH,
  ENCODING,
  ExitCode,
  HttpCode,
  Env
};
