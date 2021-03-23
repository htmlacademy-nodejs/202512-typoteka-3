const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const ExitCode = {
  success: 0,
  exception: 1
};

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401
};
const ORANGE = `#ffa500`;
const MAX_ID_LENGTH = 6;
const ENCODING = `utf-8`;

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  ORANGE,
  MAX_ID_LENGTH,
  ENCODING,
  ExitCode,
  HttpCode
};
