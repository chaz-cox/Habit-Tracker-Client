const express = require('express');
const Users = require('../model/users');
const router = express.Router();

//Logger
router.use((req, res, next) => {
    console.log(`${req.method} api/sessions${req.url} Time:`,Date.now());
    const allowedFields = ["userName", "password"];
        const keys = Object.keys(req.body);
        const extraFields = keys.filter(key => !allowedFields.includes(key));
        if (extraFields.length > 0){
            res.status(400).json({Error: `Fields are not allowed: ${extraFields}`});
        }else{
            next();
        }
});


//GET
router.get("/", async (req, res)=>{
    let user = await Users.find();
    res.status(200).json(user);
});
//POST
router.post("/",async (req, res)=>{
    // Need to update this later with encryption and local storage
    try{
        let login = {
            userName: req.body.userName,
            password: req.body.password
        };
        let user = await Users.findOne(login);
        if (!user){
            res.status(401).json({Message: "Invalid username or password"});
        }else{
            let correctPassword = req.body.password == user.password;
            if (!correctPassword){
                res.status(401).json({Message: "Invalid username or password"});
            }else{
                res.status(200).json({Message: "Login Verified", UserId: user._id});
            }
        }
    }catch(err){
        console.log(err);
        res.status(500).json({Message: err.message});
    }
});


//PUT

//DELETE


module.exports = router;
