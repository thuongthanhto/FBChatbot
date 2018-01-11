// Add lib
var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

// Declare variable
var db = mongoose.connect(process.env.MONGODB_URI);
var Step = require("./models/step");
var Rate = require("./models/rate");
var Common = require("./service/common");
var Handle = require("./service/handle");
var ProcessController = require("./controller/processController");

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

var common = new Common();
var handle = new Handle();
var processController = new ProcessController();

// Server index page
app.get("/", function(req, res) {
  res.send("Deployed!");
  getListRates();
});

// Facebook Webhook Used for verification
app.get("/webhook", function(req, res) {
  if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});

// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function(req, res) {
  // Make sure this is a page subscription
  if (req.body.object == "page") {
    if (req.body.entry !== undefined) {
      // Iterate over each entry There may be multiple entries if batched
      req.body.entry.forEach(function(entry) {
        if (entry.messaging !== undefined) {
          // Iterate over each messaging event
          entry.messaging.forEach(function(event) {
            console.log(req.body.entry);
            if (event.postback) {
              processPostback(event);
            } else if (event.message) {
              processMessage(event);
            }
          });
        }
      });
    }

    res.sendStatus(200);
  }
});

// Two main function of chatbot
function processPostback(event) {
  var senderId = event.sender.id;
  var payload = event.postback.payload;

  processController.processPostback(senderId, payload);
}

function processMessage(event) {
  if (!event.message.is_echo) {
    var message = event.message;
    var senderId = event.sender.id;

    if (message.text) {
      var formattedMsg = message.text.toLowerCase().trim();

      processController.processMessage(formattedMsg, senderId);
    } else if (message.attachments) {
      common.sendMessage(senderId, { text: "Sorry, I don't understand your request." });
    }
  }
}