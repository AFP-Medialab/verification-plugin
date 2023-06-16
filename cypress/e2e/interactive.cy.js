describe("Interactive", () => {
  it("Interactive Forensic", () => {
    cy.get("#scrollable-force-tab-3").click();
    cy.url().should("include", "app/interactive");
    cy.get(
      ':nth-child(2) > .mui-ac5y0l-MuiGrid-root > :nth-child(2) > [data-testid="interactive-forensic"]'
    ).click();
  });
});
