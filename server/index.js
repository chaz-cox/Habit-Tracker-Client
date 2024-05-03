const express = require('express');
const cors = require('cors');
const flags = require('flags');
const mongodb = require('./model/mongo');
const auth = require('./credentials');

const slipsRoute = require('./api/slipsRest');
const goalsRoute = require('./api/goalsRest');
const habitsRoute = require('./api/habitsRest');
const rewardsRoute = require('./api/rewardsRest');
const usersRoute = require('./api/usersRest');
const unexpectedRoute = require('./api/unexpectedRest');
const sessionsRoute= require('./api/sessionsRest');

const app = express();

flags.defineNumber("port",8080, "Ports of the http server");
flags.parse();

const PORT = flags.get('port') || auth.port;

mongodb.setUpConnectionHandlers( () =>{

    app.use(cors());
    // app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    //all the routes
    app.use('/api/slips', slipsRoute);
    app.use('/api/goals', goalsRoute);
    app.use('/api/habits', habitsRoute);
    app.use('/api/rewards', rewardsRoute);
    app.use('/api/users', usersRoute);
    app.use('/api/unexpected', unexpectedRoute);
    app.use('/api/sessions', sessionsRoute);

    app.listen(PORT, ()=>{
        console.log(`Server is listening on port ${PORT}`);
    });
});

mongodb.connect(auth.user, auth.password, auth.host, auth.port, auth.db);

