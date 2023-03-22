const PATH_TO_SCHEMAS = "./cypress/support/schemas";

export function validateSchema(body, schemaPath) {
  cy.task("validateJsonSchema", {
    data: body,
    verbose: true,
    schemaFile: PATH_TO_SCHEMAS + schemaPath,
  }).should("equal", null);
}
