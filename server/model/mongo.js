const mongoose = require('mongoose');
const db = mongoose.connection;

function connect(user, password, host, port, db){
    const connectionString = `mongodb+srv://${user}:${password}@cluster0.s04ylrn.mongodb.net/${db}?retryWrites=true&w=majority`;
    mongoose.connect(connectionString).catch( (err) => console.log(err.reason));
}

function setUpConnectionHandlers(callback){
    db.once("connecting",() =>{
        console.log("Connecting to MongoDB");
    });
    db.once("connected",() =>{
        console.log("Connected to MongoDB");
    });
    db.once("open", () =>{
        console.log("Open Connection to MongoDB");
        callback();
    });
    db.once("error", (err) =>{
        console.log("Error Connection to MongoDB", err);
    });
}

module.exports={
    connect: connect,
    setUpConnectionHandlers: setUpConnectionHandlers,
};
