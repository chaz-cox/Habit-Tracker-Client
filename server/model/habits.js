const mongoose = require('mongoose');

const habitsSchema = mongoose.Schema({
    userId : { type: mongoose.Types.ObjectId, default: "", ref:"Users", required : [true, "userID is required"] },
    title : { type: String, default: "", required: [true, "title is required"] },
    description : {type: String, default: "" },
    gainingNew : {type: Boolean, default: true },//breaking old habit or gaining new habit
    isFeatured : {type: Boolean, default: false },
    currentStreak : {type: Number, default: 0, min:[0, "cannot have negative streak"] },// updated when clicked on dialog
    longestStreak : {type: Number, default: 0, min:[0, "cannot have a negative streak"] },// updated when currentStreak is greater
    numberOfDays : {type: Number, default: 0, min:[0, "cannot have a negative number days"] }, // not sure if I need this, with dateCreated
    goals : {type: [mongoose.Types.ObjectId], default: [], ref:"Goals" }, // sub weekly, daily, other, etc. 
    reward : {type: mongoose.Types.ObjectId, default: null, ref:"Rewards" }, // a reward for accomplishing habit
    slips: {type: [mongoose.Types.ObjectId], default: [], ref:"Slips" }, // a reward for accomplishing habit
    notes : {type: String, default: ""},
    dateCreated : { type: Date, default: new Date() }, // just a cool time stamp
});

const Habits = mongoose.model("Habits", habitsSchema);
module.exports = Habits;

