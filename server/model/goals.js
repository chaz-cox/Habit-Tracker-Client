const mongoose = require('mongoose');

const goalsSchema = mongoose.Schema({
    habitId : { type: mongoose.Types.ObjectId, default: "", ref:"Habit", required : [true, "habitId is required"] },
    title : { type: String, default: "", required: true },
    description : {type: String, default: "", required: true },
    rewards : {type: [mongoose.Types.ObjectId], default: [], ref:"Rewards" }, // a reward for accomplishing habit
    howManyDays: {type: Number, default: -1, min: -1 }, //how often
    repeats : {type: Boolean, default: false },
    notes : {type: String, default: ""},
});

const Goals = mongoose.model("Goals", goalsSchema);
module.exports = Goals;

