const mongoose = require('mongoose');

const rewardsSchema = mongoose.Schema({
    title : { type: String, default: "", required: true },
    description : {type: String, default: "" },
});

const Rewards = mongoose.model("Rewards", rewardsSchema);
module.exports = Rewards;
