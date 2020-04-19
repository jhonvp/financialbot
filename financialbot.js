const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://localhost:4883");
const path = require("path");
const log = require(path.join(__dirname, "utils", "logConfiguration"));
const processcommand = require(path.join(
  __dirname,
  "controllers",
  "processcommand"
));

client.on("connect", function () {
  client.subscribe("financialcommand", function (err) {
    if (!err) {
      log.error(`The mqqt financialcommand subscribe throw and error.`);
      log.error(err);
    }
  });
});

client.on("message", function (topic, message) {
  processcommand(message.toString(), (response) => {
    client.publish("financialcommandresponse", response);
  });
});
