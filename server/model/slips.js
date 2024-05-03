const mongoose = require('mongoose');

const slipsSchema = mongoose.Schema({
    title : { type: String, default: "", required: true }, // missed due date for assignment 1
    description : {type: String, default: "" }, // forgot to set alarm and slept in 
    tools : {type: String, default: ""}, // what are somethings done for this not to happen again.
    triggers : {type: String, default: ""}, // how did this happen?
    restriction : {type: String, default: ""},
    restrictionBreakStreak : {type: Number, default:0},
    notes: {type: String, default: ""},
    date: {type: Date, default: Date.now()},
});

const Slips = mongoose.model("Slips", slipsSchema);
module.exports = Slips;

