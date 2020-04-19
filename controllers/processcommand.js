var request = require("request");

module.exports = async (message, cb) => {
  const commandinformation = message.split(";");
  if (
    commandinformation[0] &&
    commandinformation[1] &&
    commandinformation[2] &&
    commandinformation.length === 3
  ) {
    command = commandinformation[2];
    if (command.startsWith("/stock=")) {
      stockinformation = command.split("=");
      if (stockinformation[1].trim().length > 0) {
        stockinformation.shift();
        stockcode = stockinformation.join("=");
        request.get(
          `https://stooq.com/q/l/?s=${stockcode}&f=sd2t2ohlcv&h&e=csv`,
          (error, response, body) => {
            if (error) {
              cb(
                `ERROR;The information is nor available;${commandinformation.join(
                  ";"
                )}`
              );
            }
            const rowResponse = body.split("\r\n")[1];
            const rowInformation = rowResponse.split(",");
            if (rowInformation[6] !== "N/D") {
              cb(
                `SUCCESS;${rowInformation[0]} quote is $${
                  rowInformation[6]
                } per share;${commandinformation.join(";")}`
              );
            } else {
              cb(
                `ERROR;No description for ${
                  rowInformation[0]
                };${commandinformation.join(";")}`
              );
            }
          }
        );
      } else {
        cb(
          `ERROR;Missing STOCK_CODE in the stock command;${commandinformation.join(
            ";"
          )}`
        );
      }
    } else {
      cb(
        `ERROR;Command not found in the financial bot;${commandinformation.join(
          ";"
        )}`
      );
    }
  } else {
    cb(`ERROR;The message is not well formed;${commandinformation.join(";")}`);
  }
};
