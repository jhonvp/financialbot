const path = require("path");
const chai = require("chai");
const expect = chai.expect;
const processCommand = require(path.join(
  __dirname,
  "..",
  "controllers",
  "processcommand"
));

describe("Testing the financial bot", function () {
  this.timeout(10000);
  it("Send a valid command and stock code and receive the response", (done) => {
    processCommand(`userid;room;/stock=aapl.us`, (response) => {
      expect(response).to.be.a("string");
      expect(response).to.include("SUCCESS;AAPL.US quote is");
      done();
    });
  });

  it("Send a valid command, an invalid stock code and receive the response", (done) => {
    processCommand(`userid;room;/stock=aaplXXXXX.us`, (response) => {
      expect(response).to.be.a("string");
      expect(response).to.include("ERROR;No description for AAPLXXXXX.US");
      done();
    });
  });

  it("Send an invalid command and receive the response", (done) => {
    processCommand(`userid;room;/NOCOMMAND=aaplXXXXX.us`, (response) => {
      expect(response).to.be.a("string");
      expect(response).to.include(
        "ERROR;Command not found in the financial bot"
      );
      done();
    });
  });

  it("Send an invalid message", (done) => {
    processCommand(`/NOCOMMAND=aaplXXXXX.us`, (response) => {
      expect(response).to.be.a("string");
      expect(response).to.include("ERROR;The message is not well formed");
      done();
    });
  });
});
