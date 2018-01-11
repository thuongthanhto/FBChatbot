var Common = require("./../service/common");
var Handle = require("./../service/handle");

var common = new Common();
var handle = new Handle();

//  This is a Constructor
function ProcessController() {}

// Declare function
ProcessController.prototype.processMessage = processMessage;
ProcessController.prototype.processPostback = processPostback;

// Implement function
function processPostback(senderId, payload) {
  switch (payload) {
    case "Greeting":
      //handle.showDetail(senderId);
      handle.showQuestionRecommend(senderId);
      break;
    case "SearchNow":
      handle.showSearchRates(senderId);
  }
}

function processMessage(formattedMsg, senderId) {
  console.log("This is a message" + formattedMsg)
  switch (formattedMsg) {
    case "quote rates":
      handle.showSentenceFirstChatbot(senderId);
      break;
    case "guid me":
      common.setNextStep(senderId, 'purpose');
      handle.showGuidMe(senderId);
      break;
    case "explore on my own":
      common.setNextStep(senderId, 'explore');
      handle.showListRates(senderId);
      break;
    case "refinace":
      common.setRate(senderId, "purpose", "Refinace")
      common.setNextStep(senderId, 'loanAmount');
      common.sendMessage(senderId, { text: "Great! How much would you like to borrow?" });
      break;
    case "purchase":
      common.setRate(senderId, "purpose", "Purchase")
      common.setNextStep(senderId, 'downPayment');
      common.sendMessage(senderId, { text: "Excellent! What is your down payment?" });
      break;
    case "fixed":
      common.setRate(senderId, "typeProgram", "FIXED");
      common.setNextStep(senderId, 'timeProgram');
      handle.showLoanProgramFixed(senderId);
      break;
    case "adjustable":
      common.setRate(senderId, "typeProgram", "ARM");
      common.setNextStep(senderId, 'adjustable');
      handle.showLoanProgramAdjustable(senderId);
      break;
    case "30":
    case "15":
      common.setRate(senderId, "termProgram", formattedMsg);
      common.setNextStep(senderId, 'creditScoreRange');
      handle.showCreditScoreRange(senderId);
      break;
    case "10/1":
    case "5/1":
    case "3/1":
      common.setRate(senderId, "termProgram", formattedMsg);
      common.setNextStep(senderId, 'creditScoreRange');
      handle.showCreditScoreRange(senderId);
      break;
    case "excellent (740+)":
      common.setNextStep(senderId, 'creditScore');
      handle.showCreditScore740(senderId);
      break;
    case "good (700-739)":
      common.setNextStep(senderId, 'creditScore');
      handle.showCreditScore700_739(senderId);
      break;
    case "fair (640-699)":
      common.setNextStep(senderId, 'creditScore');
      handle.showCreditScore640_699(senderId);
      break;
    case "800+":
    case "780-799":
    case "760-779":
    case "740-759":
    case "720-739":
    case "700-719":
    case "680-699":
    case "660-679":
    case "660-679":
    case "640-659":
      common.setRate(senderId, "creditScore", formattedMsg.substring(0, 3));
      common.setNextStep(senderId, 'refiPurpose');
      handle.showRefiPurpose(senderId);
      break;
    case "yes":
    case "no":
      common.getCurrentStep(senderId, function(msg) {
        switch (msg) {
          case "refiPurpose":
            if (formattedMsg == 'yes') {
              common.setRate(senderId, "refiPurpose", "1");
            } else {
              common.setRate(senderId, "refiPurpose", "0");
            }
            common.setNextStep(senderId, 'propertyType');
            handle.showPropertyType(senderId);
            break;
          case "impound":
            if (formattedMsg == 'yes') {
              common.setRate(senderId, "impound", "1");
            } else {
              common.setRate(senderId, "impound", "0");
            }
            common.setNextStep(senderId, 'allDone');
            handle.showAllDone(senderId);
            break;
          case "heloc":
            if (formattedMsg == 'yes') {
              common.setRate(senderId, "heloc", "1")
              common.setNextStep(senderId, 'helocBalance');
              common.sendMessage(senderId, { text: "Good! What is your current heloc balance?" });
            } else {
              common.setRate(senderId, "heloc", "0")
              common.setNextStep(senderId, 'impound')
              handle.showImpound(senderId);
            }
            break;
        }
      })
      break;
    case "single family reside...":
      common.setRate(senderId, "propertyType", "SFR");
      common.setNextStep(senderId, 'occupancy');
      handle.showOccupancy(senderId);
      break;
    case "condo attached":
      common.setRate(senderId, "propertyType", "CONDO_ATTACH");
      common.setNextStep(senderId, 'occupancy');
      handle.showOccupancy(senderId);
      break;
    case "site condo":
      common.setRate(senderId, "propertyType", "CON");
      common.setNextStep(senderId, 'occupancy');
      handle.showOccupancy(senderId);
      break;
    case "townhouse":
      common.setRate(senderId, "propertyType", "TOW");
      common.setNextStep(senderId, 'occupancy');
      handle.showOccupancy(senderId);
      break;
    case "duplex":
      common.setRate(senderId, "propertyType", "DUP");
      common.setNextStep(senderId, 'occupancy');
      handle.showOccupancy(senderId);
      break;
    case "triplex":
      common.setRate(senderId, "propertyType", "TRI");
      common.setNextStep(senderId, 'occupancy');
      handle.showOccupancy(senderId);
      break;
    case "fouplex":
      common.setRate(senderId, "propertyType", "FOU");
      common.setNextStep(senderId, 'occupancy');
      handle.showOccupancy(senderId);
      break;
    case "primary residence":
      common.setRate(senderId, "occupancy", "PRI");
      common.setNextStep(senderId, 'heloc');
      handle.showHeloc(senderId);
      break;
    case "second home":
      common.setRate(senderId, "occupancy", "SEC");
      common.setNextStep(senderId, 'heloc');
      handle.showHeloc(senderId);
      break;
    case "investment":
      common.setRate(senderId, "occupancy", "INV");
      common.setNextStep(senderId, 'heloc');
      handle.showHeloc(senderId);
      break;
    default:
      {
        common.getCurrentStep(senderId, function(msg) {
          switch (msg) {
            case "loanAmount":
              if (isNaN(formattedMsg) || (parseInt(formattedMsg) < 50000)) {
                common.sendMessage(senderId, { text: "Value must be a number and bigger 50000." });
              } else {
                common.setRate(senderId, "loanAmount", formattedMsg);
                common.setNextStep(senderId, 'propertyValue');
                common.sendMessage(senderId, { text: "Excellent! What is your estimated property value?" });
              }
              break;
            case "propertyValue":
              common.getLoanAmount(senderId, function(value) {
                if (isNaN(formattedMsg) || (parseInt(formattedMsg) < parseInt(value))) {
                  common.sendMessage(senderId, { text: "Value must be a number and bigger loan amount." });
                } else {
                  common.setRate(senderId, "propertyValue", formattedMsg);
                  common.setNextStep(senderId, 'zipCode');
                  common.sendMessage(senderId, { text: "Excellent! What is your zip code?" });
                }
              });
              break;
            case "purchaseOffer":
              if (isNaN(formattedMsg) || (parseInt(formattedMsg) < 50000)) {
                common.sendMessage(senderId, { text: "Value must be a number and bigger 50000." });
              } else {
                common.setRate(senderId, "propertyValue", formattedMsg);
                common.setNextStep(senderId, 'zipCode');
                common.sendMessage(senderId, { text: "Excellent! What is your zip code?" });
              }
              break;
            case "zipCode":
              common.setRate(senderId, "zipCode", formattedMsg)
              common.setNextStep(senderId, 'typeProgram');
              handle.showTypeProgram(senderId);
              break;
            case "heloc":
              common.setNextStep(senderId, 'typeProgram');
              handle.showTypeProgram(senderId);
              break;
            case "downPayment":
              common.setNextStep(senderId, 'purchaseOffer');
              common.sendMessage(senderId, { text: "Excellent! How much are you paying to buy the house?" });
              break;
            case "helocBalance":
              common.getPropertyValue(senderId, function(value) {
                if (isNaN(formattedMsg) || (parseInt(formattedMsg) < parseInt(value))) {
                  common.sendMessage(senderId, { text: "Value must be a number and bigger property value." });
                } else {
                  common.setRate(senderId, "helocBalance", formattedMsg)
                  common.setNextStep(senderId, 'impound');
                  handle.showImpound(senderId);
                }
              });
              break;
          }
        })
      }

  }
}

module.exports = ProcessController;