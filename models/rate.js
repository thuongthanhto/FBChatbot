var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RateSchema = new Schema({
  user_id: {type: String},
  purpose: {type: String},
  loanAmount: {type: String},
  propertyValue: {type: String},
  zipCode: {type: String},
  typeProgram: {type: String},
  termProgram: {type: String},
  creditScore: {type: String},
  refiPurpose: {type: String},
  propertyType: {type: String},
  occupancy: {type: String},
  heloc: {type: String},
  helocBalance: {type: String},
  impound: {type: String},
});

module.exports = mongoose.model("Rate", RateSchema);
