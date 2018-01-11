var request = require("request");
var Step = require("./../models/step");
var Rate = require("./../models/rate");
var mongoose = require("mongoose");
var db = mongoose.connect(process.env.MONGODB_URI);

//  This is a Constructor
function Common() {}

// Declare function
Common.prototype.sendMessage = sendMessage;
Common.prototype.getCurrentStep = getCurrentStep;
Common.prototype.setNextStep = setNextStep;
Common.prototype.setRate = setRate;
Common.prototype.getLoanAmount = getLoanAmount;
Common.prototype.getRate = getRate;
Common.prototype.getPropertyValue = getPropertyValue;

// Implement function
function setRate(userId, currentStep, value) {
  switch (currentStep) {
    case "purpose":
      var update = {
        user_id: userId,
        purpose: value
      };
      break;
    case "loanAmount":
      var update = {
        user_id: userId,
        loanAmount: value
      };
      break;
    case "propertyValue":
      var update = {
        user_id: userId,
        propertyValue: value
      };
      break;
    case "zipCode":
      var update = {
        user_id: userId,
        zipCode: value
      };
      break;
    case "typeProgram":
      var update = {
        user_id: userId,
        typeProgram: value
      };
      break;
    case "termProgram":
      var update = {
        user_id: userId,
        termProgram: value
      };
      break;
    case "creditScore":
      var update = {
        user_id: userId,
        creditScore: value
      };
      break;
    case "refiPurpose":
      var update = {
        user_id: userId,
        refiPurpose: value
      };
      break;
    case "propertyType":
      var update = {
        user_id: userId,
        propertyType: value
      };
      break;
    case "occupancy":
      var update = {
        user_id: userId,
        occupancy: value
      };
      break;
    case "heloc":
      var update = {
        user_id: userId,
        heloc: value
      };
      break;
    case "helocBalance":
      var update = {
        user_id: userId,
        helocBalance: value
      };
      break;
    case "impound":
      var update = {
        user_id: userId,
        impound: value
      };
      break;
  }
  var query = {
    user_id: userId
  };

  var options = {
    upsert: true
  };
  Rate.findOneAndUpdate(query, update, options, function(err, mov) {
    if (err) {
      console.log("Database error: " + err);
    } else {}
  });
}

function getLoanAmount(userId, callback) {
  Rate.findOne({
    user_id: userId
  }, function(err, rate) {
    if (err) {
      callback('Get rate error');
    } else {
      callback(rate['loanAmount']);
    }
  });
}

function getPropertyValue(userId, callback) {
  Rate.findOne({
    user_id: userId
  }, function(err, rate) {
    if (err) {
      callback('Get rate error');
    } else {
      callback(rate['propertyValue']);
    }
  });
}

function getRate(userId, callback) {
  Rate.findOne({
    user_id: userId
  }, function(err, rate) {
    if (err) {
      callback('Get rate error');
    } else {
      callback(rate);
    }
  });
}

function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {
      access_token: process.env.PAGE_ACCESS_TOKEN
    },
    method: "POST",
    json: {
      recipient: {
        id: recipientId
      },
      message: message
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    }
  });

};

function getCurrentStep(userId, callback) {
  Step
    .findOne({
      user_id: userId
    }, function(err, step) {
      if (err) {
        callback('Get step error');
      } else {
        callback(step['current_Step']);
      }
    });
}

function setNextStep(userId, currentStep) {
  var query = {
    user_id: userId
  };
  var update = {
    user_id: userId,
    current_Step: currentStep
  };
  var options = {
    upsert: true
  };
  Step.findOneAndUpdate(query, update, options, function(err, mov) {
    if (err) {
      console.log("Database error: " + err);
    } else {}
  });
}

module.exports = Common;