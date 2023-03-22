export default class ProgressPage {
  getTitleHeader() {
    return cy.get(".progress__page-title");
  }

  getFiltersContainer() {
    return cy.get(".progress__filters");
  }

  getRankingContainers() {
    return cy.get(".progress__ranking-display");
  }

  getClassPieChartContainer() {
    return cy.get(".pie-chart");
  }

  getColumnChartContainer() {
    return cy.get(".column-chart");
  }
}
