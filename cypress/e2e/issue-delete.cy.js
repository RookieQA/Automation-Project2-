const issuetitle = "This is an issue of type: Task.";
const DELETE_CONFIRMATION_MESSAGE =
  "Are you sure you want to delete this issue?";
const DELETE_WARNING_MESSAGE = "Once you delete, it's gone for good.";

describe("Delete Issue", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issuetitle).click();
      });
  });

  it("Should delete an issue from the board", () => {
    // Assert that the issue detail view modal is visible
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");

    // Click on the delete icon
    cy.get('[data-testid="icon:trash"]').click();

    // Assert that the confirmation dialog is visible
    cy.get('[data-testid="modal:confirm"]')
      .should("be.visible")
      .within(() => {
        // Assert the presence of confirmation and warning message
        cy.contains(DELETE_CONFIRMATION_MESSAGE).should("be.visible");
        cy.contains(DELETE_WARNING_MESSAGE).should("be.visible");

        // Click the delete button
        cy.contains("button", "Delete issue").should("be.visible").click();
      });

    // Wait for the deletion process to complete if necessary
    cy.wait(2000);

    // Assert that the confirmation dialog is not visible
    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    // Assert that the issue is no longer displayed on the board
    cy.get('[data-testid="list-issue"]').should("not.contain", issuetitle);
  });

  it("Should initiate issue deletion and then cancel it", () => {
    // Assert that the issue detail view modal is visible
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");

    // Click on the delete icon
    cy.get('[data-testid="icon:trash"]').click();

    // Assert that the confirmation dialog is visible
    cy.get('[data-testid="modal:confirm"]')
      .should("be.visible")
      .within(() => {
        // Assert the presence of confirmation and warning message
        cy.contains(DELETE_CONFIRMATION_MESSAGE).should("be.visible");
        cy.contains(DELETE_WARNING_MESSAGE).should("be.visible");

        cy.contains("button", "Cancel").should("be.visible").click();
      });

    // Assert that the confirmation dialog is not visible
    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    // Assert that the issue is still displayed on the board
    cy.get('[data-testid="list-issue"]').should("contain", issuetitle);
  });
});
