/// <reference types="Cypress" />

describe("Product API", () => {
  it("should Create a product", () => {
    cy.request({ method: "post", url: "http://localhost:3000/products" }).then(
      (response) => {
        // Assertions here
        expect(response.status).to.equal(200);
      }
    );
  });

  it("should List all products", () => {
    cy.request({ method: "get", url: "http://localhost:3000/products" }).then(
      (response) => {
        // Assertions here
        expect(response.status).to.equal(200);
      }
    );
  });

  it("should Find product by ID", () => {
    cy.request({
      method: "get",
      url: "http://localhost:3000/product/{id}",
    }).then((response) => {
      // Assertions here
      expect(response.status).to.equal(200);
    });
  });
});

