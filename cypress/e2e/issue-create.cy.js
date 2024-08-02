describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type value to description input field
      cy.get(".ql-editor").type("TEST_DESCRIPTION");
      cy.get(".ql-editor").should("have.text", "TEST_DESCRIPTION");

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type("TEST_TITLE");
      cy.get('input[name="title"]').should("have.value", "TEST_TITLE");

      // Open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:story"]').should("be.visible");

      // Select Baby Yoda from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      // Select Baby Yoda from assignee dropdown
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("TEST_TITLE")
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
            cy.get('[data-testid="icon:story"]').should("be.visible");
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains("TEST_TITLE")
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
        cy.get('[data-testid="icon:story"]').should("be.visible");
      });
  });

  it("Should validate title is required field if missing", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should(
        "contain",
        "This field is required"
      );
    });
  });
});

//Test Case 1: Custom Issue Creation//

function clickselectoptionPickleRick() {
  cy.get('[data-testid="select-option:Pickle Rick"]').click();
}
function clickselectoptionLordGaben() {
  cy.get('[data-testid="select-option:Lord Gaben"]').click();
}
function clickselectHighest() {
  cy.get('[data-testid="select-option:Highest"]');
}

it("Should create a Bug issue and validate it successfully", () => {
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    cy.get(".ql-editor").type("My bug description");
    cy.get(".ql-editor").should("have.text", "My bug description");

    cy.get('input[name="title"]').type("Bug");
    cy.get('input[name="title"]').should("have.value", "Bug");

    //Open issue type dropdown and choose Bug
    cy.get('[data-testid="select:type"]').click();
    cy.get('[data-testid="select-option:Bug"]')
      .wait(1000)
      .trigger("mouseover")
      .trigger("click");
    cy.get('[data-testid="icon:Bug"]').should("be.visible");

    // Select Pickle Rick from reporter dropdown
    cy.get('[data-testid="select:reporterId"]').click();
    clickselectoptionPickleRick();

    // Select Lord Gaben from assignee dropdown
    cy.get('[data-testid="form-field:userIds"]').click();
    clickselectoptionLordGaben();

    // Select Highest from Priority dropdown
    cy.get('[data-testid="select:Priority"]').click();
    clickselectHighest();

    // Click on button "Create issue"
    cy.get('button[type="Submit"]').click();

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains("Bug")
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
            cy.get('[data-testid="icon:Bug"]').should("be.visible");
          });

        cy.get('[data-testid="board-list:backlog"]')
          .contains("Bug")
          .within(() => {
            // Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
            cy.get('data-testid="icon:bug"]').should("be.visible");
          });
      });
  });
});

//Test Case 2: Random Data Plugin Issue Creation//

import { faker } from "@faker-js/faker"; // Import faker for generating random data

// Generate random data for title and description
const randomWord = faker.word.noun(); // Single word for title//
const randomWords = faker.word.words(5); // Several words for description//

function clickselectoptionLow() {
  cy.get('[data-testid="select-option:Low"]').click();
}
function clickselectreporterBabyYoda() {
  cy.get('[data-testid="reporterId:Baby Yoda"]').click();
}

it.only("Should create a new issue using the random data plugin", () => {
  // Open the issue creation modal and enter details
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    // Enter random description and title
    cy.get(".ql-editor").type(randomwords);
    cy.get(".ql-editor").should("have.text", randomwords);
    cy.get('input[name="title"]').type(randomword);
    cy.get('input[name="title"]').should("have.value", randomword);

    // Select issue type "Task"
    cy.get('[data-testid="select:type"]').click();
    cy.get('[data-testid="select-option:Task"]').click();
    cy.get('[data-testid="icon:task"]').should("be.visible");

    // Select priority "Low"
    cy.get('[data-testid="select:Priority"]').click();
    clickselectoptionLow(); // Assuming this is the correct selector

    // Select reporter "Baby Yoda"
    cy.get('[data-testid="select:Reporter"]').click();
    clickselectreporterBabyYoda();
    cy.get('[data-testid="avatar:Baby Yoda"]').should("be.visible");

    // Click on "Create issue"
    cy.get('button[type="submit"]').click();
  });

  // Assert that modal is closed and the success message is displayed
  cy.get('[data-testid="modal:issue-create"]').should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");

  // Reload the page to see the newly created issue
  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");

  // Verify that the new issue is displayed on the board
  cy.get('[data-testid="board-list:backlog"]')
    .should("be.visible")
    .within(() => {
      cy.get('[data-testid="list-issue"]')
        .should("have.length", 5)
        .first()
        .find("p")
        .contains(randomword)
        .siblings()
        .within(() => {
          cy.get('[data-testid="avatar:Baby Yoda"]').should("be.visible");
          cy.get('[data-testid="icon:task"]').should("be.visible");
        });
    });
});

it("Should validate title is required field if missing", () => {
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    // Try to click create issue button without filling any data
    cy.get('button[type="submit"]').click();

    // Assert that the correct error message is visible
    cy.get('[data-testid="form-field:title"]').should(
      "contain",
      "This field is required"
    );
  });
});
