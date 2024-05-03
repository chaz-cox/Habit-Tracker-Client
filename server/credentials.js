const dotenv = require('dotenv');
dotenv.config();
const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const host = process.env.MONGO_HOST; 
const db = process.env.MONGO_DB;
const port = process.env.MONGO_PORT;

module.exports={
    user: user,
    password: password,
    host: host,
    db: db,
    port: port,
}
