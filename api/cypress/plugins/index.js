const { JsonSchemaValidation } = require("@jc21/cypress-jsonschema-validation");
const selectTestsWithGrep = require("cypress-select-tests/grep");

module.exports = (on, config) => {
  on("task", JsonSchemaValidation(config));
  on("file:preprocessor", selectTestsWithGrep(config));
  config.baseUrl = config.env.baseUrl;
  return config;
};
