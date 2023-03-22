const selectTestsWithGrep = require("cypress-select-tests/grep");

module.exports = (on, config) => {
  on("file:preprocessor", selectTestsWithGrep(config));
  config.baseUrl = config.env.baseUrl;
  config.language = config.env.language;
  return config;
};
