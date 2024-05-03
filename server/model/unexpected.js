const mongoose = require('mongoose');

const unexpectedSchema = mongoose.Schema({
    title : { type: String, default: "" },
    description : {type: String, default: "" },
    notes : {type: String, default: ""},
    isEmergency: {type: Boolean, default: false},
    freezeStreak: {type: Boolean, default: false},
    replacementGoal : {type: mongoose.Types.ObjectId, default: "", ref:"Goals" }, // for unexpected plans, vacations, emergency, etc. 
    date: {type: Date, default: Date.now()},
    startDate: {type: Date, default: Date.now()},
    endDate: {type: Date, default: Date.now()},
});

const Unexpected = mongoose.model("Unexpected", unexpectedSchema);
module.exports = Unexpected;

