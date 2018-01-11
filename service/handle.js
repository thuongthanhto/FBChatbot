var request = require("request");
var Common = require("./common");

var common = new Common();

//  This is a Constructor  as the paramaters
function Handle() {

}

// Declare function
Handle.prototype.showSentenceFirstChatbot = showSentenceFirstChatbot;
Handle.prototype.showQuestionRecommend = showQuestionRecommend;
Handle.prototype.showGuidMe = showGuidMe;
Handle.prototype.showTypeProgram = showTypeProgram;
Handle.prototype.showLoanProgramFixed = showLoanProgramFixed;
Handle.prototype.showLoanProgramAdjustable = showLoanProgramAdjustable;
Handle.prototype.showCreditScoreRange = showCreditScoreRange;
Handle.prototype.showCreditScore740 = showCreditScore740;
Handle.prototype.showCreditScore700_739 = showCreditScore700_739;
Handle.prototype.showCreditScore640_699 = showCreditScore640_699;
Handle.prototype.showRefiPurpose = showRefiPurpose;
Handle.prototype.showPropertyType = showPropertyType;
Handle.prototype.showOccupancy = showOccupancy;
Handle.prototype.showHeloc = showHeloc;
Handle.prototype.showImpound = showImpound;
Handle.prototype.showAllDone = showAllDone;
Handle.prototype.showListRates = showListRates;
Handle.prototype.showSearchRates = showSearchRates;

// Implement function
function showSearchRates(userId) {
  common.getRate(userId, function(value) {
    var loanProgram = value.termProgram + "-" + value.typeProgram;
    var formData = {
      "loanAmount": parseInt(value.loanAmount),
      "downPayment": parseInt(value.propertyValue) - parseInt(value.loanAmount),
      "propertyValue": parseInt(value.propertyValue),
      "purpose": value.purpose,
      "zipCode": value.zipCode,
      "loanProgram": value.termProgram + "-" + value.typeProgram,
      "creditScore": parseInt(value.creditScore),
      "refiPurpose": parseInt(value.refiPurpose),
      "propertyType": value.propertyType,
      "occupancy": value.occupancy,
      "impound": parseInt(value.impound),
      "heloc": parseInt(value.heloc),
      "mortgageInsurance": "LPMI",
      "lender": "ALL",
      "type": "CONV"
    };
    console.log(formData);

    request({
      url: 'https://www.eratebook.com/get_quote',
      method: 'POST',
      json: formData
    }, function(error, response, body) {
      if (error) {
        return console.error('upload failed:', error);
      }
      if (body.sortedRates[loanProgram] != undefined) {
        var arrays = Object
          .keys(body["sortedRates"][loanProgram])
          .map(key => ({ key, value: body["sortedRates"][loanProgram][key] }));

        var arrayMessage = [];
        arrays.forEach(function(element) {
          var typePrice = "Price: ";
          if (parseInt(element.value['Lender Credits']) < 0) {
            typePrice = "Credit: ";
          }
          var objectButton = {
            "type": "web_url",
            "url": "https://www.eratebook.com/applyloan",
            "title": "Apply"
          }
          var objectElement = {
            title: "Rate: " + element.key + "%",
            subtitle: "Monthly Payment: " + "$" + element.value['Monthly Payment'] + "\nAPR: " + element.value['APR'] + "%" +
              "\nToday's " + typePrice + "$" + Math.abs(element.value['Lender Credits']),
            buttons: [objectButton]
          }
          console.log(objectButton);
          arrayMessage.push(objectElement);
        });

        var message = {
          attachment: {
            type: "template",
            payload: {
              template_type: "generic",
              elements: arrayMessage,
            }
          }
        };
        common.sendMessage(userId, message);
      } else {
        common.sendMessage(userId, { text: "No result found!" });
      }
    });
  });
}

function showListRates(userId) {
  var formData = {
    "loanAmount": 400000,
    "downPayment": 400000,
    "propertyValue": 800000,
    "purpose": "Refinance",
    "zipCode": "95111",
    "loanProgram": "30-FIXED",
    "creditScore": 800,
    "refiPurpose": 0,
    "propertyType": "SFR",
    "occupancy": "PRI",
    "impound": 0,
    "heloc": 0,
    "mortgageInsurance": "LPMI",
    "lender": "ALL",
    "type": "CONV"
  };

  request({
    url: 'https://www.eratebook.com/get_quote',
    method: 'POST',
    json: formData
  }, function(error, response, body) {
    if (error) {
      return console.error('upload failed:', error);
    }
    var arrays = Object
      .keys(body["sortedRates"]["30-FIXED"])
      .map(key => ({ key, value: body["sortedRates"]["30-FIXED"][key] }));

    var arrayMessage = [];
    arrays.forEach(function(element) {
      var typePrice = "Price: ";
      if (parseInt(element.value['Lender Credits']) < 0) {
        typePrice = "Credit: ";
      }
      var objectButton = {
        "type": "web_url",
        "url": "https://www.eratebook.com/applyloan",
        "title": "Apply"
      }
      var objectElement = {
        title: "Rate: " + element.key + "%",
        subtitle: "Monthly Payment: " + "$" + element.value['Monthly Payment'] + "\nAPR: " + element.value['APR'] + "%" +
          "\nToday's " + typePrice + "$" + Math.abs(element.value['Lender Credits']),
        buttons: [objectButton]
      }
      arrayMessage.push(objectElement);
    });

    var message = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: arrayMessage,
        }
      }
    };
    common.sendMessage(userId, message);
  });
}

function showAllDone(userId) {
  var message = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "All Done!",
        "buttons": [{
          "type": "postback",
          "title": "Search now!",
          "payload": "SearchNow"
        }]
      }
    }
  }
  common.sendMessage(userId, message);
}

function showImpound(userId) {
  var message = {
    "text": "Good! Would you like to have mortgage and insurance paid together?",
    "quick_replies": [{
      "content_type": "text",
      "title": "Yes",
      "payload": "Yes"
    }, {
      "content_type": "text",
      "title": "No",
      "payload": "Yes"
    }]
  }
  common.sendMessage(userId, message);
}

function showHeloc(userId) {
  var message = {
    "text": "Good! Do you have a second mortgage?",
    "quick_replies": [{
      "content_type": "text",
      "title": "Yes",
      "payload": "Yes"
    }, {
      "content_type": "text",
      "title": "No",
      "payload": "No"
    }]
  }
  common.sendMessage(userId, message);
}

function showOccupancy(userId) {
  var message = {
    "text": "Good! How will your property be used?",
    "quick_replies": [{
      "content_type": "text",
      "title": "Primary Residence",
      "payload": "30"
    }, {
      "content_type": "text",
      "title": "Second Home",
      "payload": "15"
    }, {
      "content_type": "text",
      "title": "Investment",
      "payload": "15"
    }]
  }
  common.sendMessage(userId, message);
}


function showPropertyType(userId) {
  var message = {
    "text": "Good! What is your property type?",
    "quick_replies": [{
      "content_type": "text",
      "title": "Single Family Residence",
      "payload": "Single Family Residence"
    }, {
      "content_type": "text",
      "title": "Condo Attached",
      "payload": "Condo Attached"
    }, {
      "content_type": "text",
      "title": "Site Condo",
      "payload": "Site Condo"
    }, {
      "content_type": "text",
      "title": "Townhouse",
      "payload": "Townhouse"
    }, {
      "content_type": "text",
      "title": "Duplex",
      "payload": "Duplex"
    }, {
      "content_type": "text",
      "title": "Triplex",
      "payload": "Triplex"
    }, {
      "content_type": "text",
      "title": "Fouplex",
      "payload": "Fouplex"
    }]
  }
  common.sendMessage(userId, message);
}

function showSentenceFirstChatbot(userId) {
  var message = {
    "text": "Hello! How would you like to search your rates?",
    "quick_replies": [{
      "content_type": "text",
      "title": "Guid Me",
      "payload": "GuidMe"
    }, {
      "content_type": "text",
      "title": "Explore on my own",
      "payload": "Explore"
    }]
  }

  common.sendMessage(userId, message);
};

function showQuestionRecommend(userId) {
  var message = {
    "text": "How can we help you?",
    "quick_replies": [{
      "content_type": "text",
      "title": "Quote Rates",
      "payload": "Quote Rates"
    }, {
      "content_type": "text",
      "title": "Apply Loan",
      "payload": "Apply Loan"
    }, {
      "content_type": "text",
      "title": "Get Pre-Approved",
      "payload": "Get Pre-Approved"
    }, {
      "content_type": "text",
      "title": "Schedule Appointment",
      "payload": "Schedule Appointment"
    }]
  }
  common.sendMessage(userId, message);
}

function showGuidMe(userId) {
  var message = {
    "text": "Great! What is your loan purpose?",
    "quick_replies": [{
      "content_type": "text",
      "title": "Refinace",
      "payload": "Refinace"
    }, {
      "content_type": "text",
      "title": "Purchase",
      "payload": "Purchase"
    }]
  }
  common.sendMessage(userId, message);
}

function showTypeProgram(userId) {
  var message = {
    "text": "Excellent! Which loan program would you like?",
    "quick_replies": [{
      "content_type": "text",
      "title": "Fixed",
      "payload": "Fixed"
    }, {
      "content_type": "text",
      "title": "Adjustable",
      "payload": "Adjustable"
    }]
  }
  common.sendMessage(userId, message);
}

function showLoanProgramFixed(userId) {
  var message = {
    "text": "Excellent! Please pick years of loan?",
    "quick_replies": [{
      "content_type": "text",
      "title": "30",
      "payload": "30"
    }, {
      "content_type": "text",
      "title": "15",
      "payload": "15"
    }]
  }
  common.sendMessage(userId, message);
}

function showLoanProgramAdjustable(userId) {
  var message = {
    "text": "Excellent! Please pick your adjustable program?",
    "quick_replies": [{
      "content_type": "text",
      "title": "10/1",
      "payload": "10/1"
    }, {
      "content_type": "text",
      "title": "5/1",
      "payload": "5/1"
    }, {
      "content_type": "text",
      "title": "3/1",
      "payload": "3/1"
    }]
  }
  common.sendMessage(userId, message);
}

function showCreditScoreRange(userId) {
  var message = {
    "text": "Excellent! How is your credit score range?",
    "quick_replies": [{
      "content_type": "text",
      "title": "Excellent (740+)",
      "payload": "30"
    }, {
      "content_type": "text",
      "title": "Good (700-739)",
      "payload": "15"
    }, {
      "content_type": "text",
      "title": "Fair (640-699)",
      "payload": "15"
    }]
  }
  common.sendMessage(userId, message);
}

function showCreditScore740(userId) {
  var message = {
    "text": "Excellent! What is your credit score?",
    "quick_replies": [{
      "content_type": "text",
      "title": "800+",
      "payload": "30"
    }, {
      "content_type": "text",
      "title": "780-799",
      "payload": "15"
    }, {
      "content_type": "text",
      "title": "760-779",
      "payload": "15"
    }, {
      "content_type": "text",
      "title": "740-759",
      "payload": "15"
    }]
  }
  common.sendMessage(userId, message);
}


function showCreditScore700_739(userId) {
  var message = {
    "text": "Excellent! What is your credit score?",
    "quick_replies": [{
      "content_type": "text",
      "title": "720-739",
      "payload": "720-739"
    }, {
      "content_type": "text",
      "title": "700-719",
      "payload": "700-719"
    }]
  }
  common.sendMessage(userId, message);
}

function showCreditScore640_699(userId) {
  var message = {
    "text": "Excellent! What is your credit score?",
    "quick_replies": [{
      "content_type": "text",
      "title": "680-699",
      "payload": "680-699"
    }, {
      "content_type": "text",
      "title": "660-679",
      "payload": "660-679"
    }, {
      "content_type": "text",
      "title": "640-659",
      "payload": "640-659"
    }]
  }
  common.sendMessage(userId, message);
}

function showRefiPurpose(userId) {
  var message = {
    "text": "Good! Do you want to borrow more than what you owe?",
    "quick_replies": [{
      "content_type": "text",
      "title": "Yes",
      "payload": "Yes"
    }, {
      "content_type": "text",
      "title": "No",
      "payload": "Yes"
    }]
  }
  common.sendMessage(userId, message);
}

module.exports = Handle;