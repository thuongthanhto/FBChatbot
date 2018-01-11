var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var StepSchema = new Schema({
  user_id: {type: String},
  current_Step: {type: String},
});

module.exports = mongoose.model("Step", StepSchema);
