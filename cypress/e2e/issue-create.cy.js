import { faker } from "@faker-js/faker";

function selectreporterBabyYoda() {
  cy.get('[data-testid="select:reporterId"]').click();
  cy.get('[data-testid="select-option:Baby Yoda"]').click();
}
function selectreporterPickleRick() {
  cy.get('[data-testid="select:reporterId"]').click();
  cy.get('[data-testid="select-option:Pickle Rick"]').click();
}
function selectassigneePickleRick() {
  cy.get('[data-testid="form-field:userIds"]').click();
  cy.get('[data-testid="select-option:Pickle Rick"]').click();
}
function selectassigneeLordGaben() {
  cy.get('[data-testid="form-field:userIds"]').click();
  cy.get('[data-testid="select-option:Lord Gaben"]').click();
}
function selectpriorityHighest() {
  cy.get('[data-testid="select:priority"]').click();
  cy.get('[data-testid="select-option:Highest"]').click();
}
function selectpriorityLow() {
  cy.get('[data-testid="select:priority"]').click();
  cy.get('[data-testid="select-option:Low"]').click();
}
beforeEach(() => {
  cy.visit("/");
  cy.url()
    .should("eq", `${Cypress.env("baseUrl")}project`)
    .then((url) => {
      cy.visit(url + "/board");
      cy.contains("This is an issue of type: Task.").click();
    });
});

it("Should create an issue and validate it successfully", () => {
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    cy.get(".ql-editor").type("TEST_DESCRIPTION");
    cy.get(".ql-editor").should("have.text", "TEST_DESCRIPTION");

    cy.get('input[name="title"]').type("TEST_TITLE");
    cy.get('input[name="title"]').should("have.value", "TEST_TITLE");
    cy.get('[data-testid="select:type"]').click();
    cy.get('[data-testid="select-option:Story"]')
      .wait(1000)
      .trigger("mouseover")
      .trigger("click");

    cy.get('[data-testid="icon:story"]').should("be.visible");

    selectreporterBabyYoda();
    selectassigneePickleRick();

    cy.get('button[type="submit"]').click();
  });

  cy.get('[data-testid="modal:issue-create"]').should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");

  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");

  cy.get('[data-testid="board-list:backlog"]')
    .should("be.visible")
    .within(() => {
      cy.get('[data-testid="list-issue"]')
        .should("have.length", "1")
        .first()
        .find("p")
        .contains("TEST_TITLE")
        .siblings()
        .within(() => {
          cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
          cy.get('[data-testid="icon:story"]').should("be.visible");
        });
    });
});

it("Should validate title is required field if missing", () => {
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    cy.get('button[type="submit"]').click();
    cy.get('[data-testid="form-field:title"]').should(
      "contain",
      "This field is required"
    );
  });
});

it("Should create a bug issue and validate it successfully", () => {
  cy.get('[data-testid="modal:issue-create"]').within(() => {
    cy.get(".ql-editor").type("My bug description");
    cy.get(".ql-editor").should("have.text", "My bug description");

    cy.get('input[name="title"]').type("Bug");
    cy.get('input[name="title"]').should("have.value", "Bug");

    cy.get('[data-testid="select:type"]').click();
    cy.get('[data-testid="select-option:Bug"]')
      .wait(1000)
      .trigger("mouseover")
      .trigger("click");

    cy.get('[data-testid="icon:bug"]').should("be.visible");

    selectreporterPickleRick();
    selectassigneeLordGaben();
    selectpriorityHighest();
    cy.get('[data-testid="icon:arrow-up"]').should("be.visible");

    cy.get('button[type="submit"]').click();
  });

  cy.get('[data-testid="modal:issue-create"]').should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");

  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");

  cy.get('[data-testid="board-list:backlog"]')
    .should("be.visible")
    .within(() => {
      cy.get('[data-testid="list-issue"]')
        .should("have.length.greaterThan", 0)
        .first()
        .find("p")
        .contains("Bug");
    });
});

it("Should create a new issue using the random data plugin", () => {
  const randomWord = faker.word.noun();
  const randomWords = faker.word.words(5);

  cy.get('[data-testid="modal:issue-create"]').within(() => {
    cy.get(".ql-editor").type(randomWords);
    cy.get(".ql-editor").should("have.text", randomWords);

    cy.get('input[name="title"]').type(randomWord);
    cy.get('input[name="title"]').should("have.value", randomWord);

    selectpriorityLow();
    selectreporterBabyYoda();

    cy.get('button[type="submit"]').click();
  });

  cy.get('[data-testid="modal:issue-create"]').should("not.exist");
  cy.contains("Issue has been successfully created.").should("be.visible");

  cy.reload();
  cy.contains("Issue has been successfully created.").should("not.exist");

  cy.get('[data-testid="board-list:backlog"]')
    .should("be.visible")
    .and("have.length", 1);

  cy.get('[data-testid="board-list:backlog"]')
    .should("be.visible")
    .and("have.length", 1)
    .within(() => {
      cy.get('[data-testid="list-issue"]')
        .should("have.length", 5)
        .first()
        .find("p")
        .contains(randomWord);
    });
});
