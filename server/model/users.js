const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    firstName : { type: String, default: "", required: true },
    lastName : {type: String, default: "", required: true },
    userName : {type: String, default: "", required: true, unique: true },
    password : {type: String, default: "", required: true },
});

const Users = mongoose.model("Users", usersSchema);
module.exports = Users;
