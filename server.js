var express = require("express");
var cors = require("cors");
var app = express();
app.use(cors());

app.use(express.static("public")); //Procedure to set public folder contain process files (css,image,.js,..)
app.set("view engine", "ejs"); // Use ejs instead of html
app.set("views", "./views"); // view folder contain .ejs files

// variable declaration
var librarySensorOne = {
  "humidity": 53.98102,
  "temperature": 23.12009,
  "isAvailable": 1,
  "co2": 895.259,
  "isFake": true,
};
var librarySensorTwo = {
  "humidity": 53.98102,
  "temperature": 23.12009,
  "isAvailable": 0,
  "co2": 3387.259,
  "isFake": true,
};
var librarySensorThree = {
  "humidity": 53.98102,
  "temperature": 23.12009,
  "isAvailable": 1,
  "co2": 3387.259,
  "isFake": true,
};
var librarySensorFour = {
  "humidity": 53.98102,
  "temperature": 23.12009,
  "isAvailable": 0,
  "co2": 3387.259,
  "isFake": true,
};
var librarySensorFive = {
  "humidity": 53.98102,
  "temperature": 23.12009,
  "isAvailable": 0,
  "co2": 3387.259,
  "isFake": true,
};

// Parse URL-encoded bodies (as sent by HTML forms)
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Create server
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3001, () => {
  console.log("listening on PORT:3001");
});

// MQTT setup
var mqtt = require("mqtt");
var options = {
  port: 1883,
  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
  username: "pp-wt-2021-2022@ttn",
  password:
    "NNSXS.Z6J2KNLNTRMULY6FZEER7TC3FD6AN3S5J4XGA4Y.F4PQGGGIJJF7W3HJFDMJBH6V4JI34S4FVZVZYTA3S3R2XUCF7AFA",
  keepalive: 60,
  reconnectPeriod: 1000,
  protocolId: "MQIsdp",
  protocolVersion: 3,
  clean: true,
  encoding: "utf8",
};
var client = mqtt.connect("https://eu1.cloud.thethings.network", options);

// Global variable to save data
var globalMQTT = 0;

// SOCKET
io.on("connection", function (socket) {
  console.log("Client connected: " + socket.id);

  socket.on("disconnect", function () {
    console.log(socket.id + " disconnected");
  });

  socket.on("REQUEST_GET_DATA", function () {
    socket.emit("SEND_DATA", globalMQTT);
  });

  function intervalFunc() {
    socket.emit("SEND_DATA", globalMQTT);
  }
  setInterval(intervalFunc, 2000);
});

// MQTT setup
client.on("connect", function () {
  console.log("Client connected to TTN");
  client.subscribe("#");
});

client.on("error", function (err) {
  console.log(err);
});

client.on("message", function (topic, message) {
  topic = topic.split("/");
  if (topic[3] === "unikoblenz-pynode-89") {
    var getDataFromTTN = JSON.parse(message);
    if (getDataFromTTN.uplink_message.frm_payload !== undefined) {
      var getFrmPayload = getDataFromTTN.uplink_message.frm_payload;
      globalMQTT = Buffer.from(getFrmPayload, "base64").toString();
      console.log(typeof globalMQTT);
      if (globalMQTT.isAvailable == 0) {
        globalMQTT.isAvailable = true;
      } else {
        globalMQTT.isAvailable = false;
      }
      console.log(globalMQTT);
      librarySensorOne = JSON.parse(globalMQTT);
    }
  } else if (topic[3] === "unikoblenz-pynode-1000") {
    //second study room sensor's id goes here
    var getDataFromTTN = JSON.parse(message);
    if (getDataFromTTN.uplink_message.frm_payload !== undefined) {
      var getFrmPayload = getDataFromTTN.uplink_message.frm_payload;
      globalMQTT = Buffer.from(getFrmPayload, "base64").toString();
      console.log(typeof globalMQTT);
      librarySensorTwo = globalMQTT;
    }
  } else if (topic[3] === "unikoblenz-pynode-1000") {
    //third study room sensor's id goes here
    var getDataFromTTN = JSON.parse(message);
    if (getDataFromTTN.uplink_message.frm_payload !== undefined) {
      var getFrmPayload = getDataFromTTN.uplink_message.frm_payload;
      globalMQTT = Buffer.from(getFrmPayload, "base64").toString();
      console.log(globalMQTT);
      librarySensorThree = globalMQTT;
    }
  } else if (topic[3] === "unikoblenz-pynode-1000") {
    //fourth study room sensor's id goes here
    var getDataFromTTN = JSON.parse(message);
    if (getDataFromTTN.uplink_message.frm_payload !== undefined) {
      var getFrmPayload = getDataFromTTN.uplink_message.frm_payload;
      globalMQTT = Buffer.from(getFrmPayload, "base64").toString();
      console.log(globalMQTT);
      librarySensorFour = globalMQTT;
    }
  } else if (topic[3] === "unikoblenz-pynode-1000") {
    //fifth study room sensor's id goes here
    var getDataFromTTN = JSON.parse(message);
    if (getDataFromTTN.uplink_message.frm_payload !== undefined) {
      var getFrmPayload = getDataFromTTN.uplink_message.frm_payload;
      globalMQTT = Buffer.from(getFrmPayload, "base64").toString();
      console.log(globalMQTT);
      librarySensorFive = globalMQTT;
    }
  }
});

// Setup load ejs file to display on Browsers
app.get("/get-library-data", function (req, res) {
  res.send([
    librarySensorOne,
    librarySensorTwo,
    librarySensorThree,
    librarySensorFour,
    librarySensorFive,
  ]);
});
