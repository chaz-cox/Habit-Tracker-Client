const express = require('express');
const Users = require('../model/users');
const router = express.Router();

//Logger
router.use((req, res, next) => {
    console.log(`${req.method} api/users${req.url} Time:`,Date.now());
    const allowedFields = ["firstName", "lastName", "userName", "password"];
    const keys = Object.keys(req.body);
    const extraFields = keys.filter(key => !allowedFields.includes(key));
    if (extraFields.length > 0){
        res.status(400).json({Error: `Fields are not allowed: ${extraFields}`});
    }else{
        next();
    }

});


//GET
router.get("/check-username", async (req, res)=>{
    try{
        userNameSearch = {userName: req.query.username}
        let user = await Users.findOne(userNameSearch);
        if (!user){
            res.status(200).json({Message: "the username is available",Available: true});
        }else{
            res.status(409).json({Message:"the username is taken", Available:false}) 
        }
    }catch(err){
        res.status(500).json({Message:err.message});
    }
});

router.get("/:id/name", async (req, res)=>{
    try{
        let id = req.params.id;
        let user = await Users.findById(id);
        if(user){
            res.status(200).json({Name: user.firstName});
        }else{
            res.status(404).json({Message: "User not found"});
        }
    }catch(err){
        console.error(err);
        res.status(500).json({Message:"Server error"});
    }
});

//POST
router.post("/",async (req, res)=>{
    try{
        let user = new Users({ 
           firstName: req.body.firstName,
           lastName: req.body.lastName,
           userName: req.body.userName,
           password: req.body.password
        });
        await user.save();
        res.status(201).json({Message:"created"});
    }catch(err){
        if (err.name == 'ValidationError'){
            res.status(400).json({Error: err.message });
        }else{
            res.status(500).json({Error: err.message });
        }
    }
});

//PUT

//DELETE


module.exports = router;
