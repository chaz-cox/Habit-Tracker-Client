const express = require('express');
const Rewards = require('../model/rewards');
const router = express.Router();

//Logger
router.use((req, res, next) => {
    console.log(`${req.method} api/rewards${req.url} Time:`,Date.now());
    const allowedFields = ["title", "description"];
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
    try{
        let rewards = await Rewards.find();
        res.status(200).json(rewards);
    }catch(err){
        res.status(500).json({Error: err.message});
    }
});

router.get("/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        let reward = await Rewards.findById(id);
        if(reward){
            res.status(200).json(reward);
        }else{
            res.status(404).json({Message: "No reward found"});
        }
    }catch(err){
        if (err.name == "CastError"){
            res.status(400).json({Error:"Invalid format"});
        }else{
            res.status(500).json({Error:err.message});
        }
    }
});

//POST
router.post("/", async (req, res) =>{
    try{
        let reward = new Rewards({
            title: req.body.title,
            description: req.body.description,
        });
        await reward.save();
        res.status(201).json({Message: "Created"});
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
router.delete("/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        let reward = await Rewards.findByIdAndDelete(id);
        if(reward){
            res.status(200).json({Message:`${reward.title} was deleted`});
        }else{
            res.status(404).json({Message: "No reward found"});
        }
    }catch(err){
        if (err.name == "CastError"){
            res.status(400).json({Error:"Invalid format"});
        }else{
            res.status(500).json({Error:err.message});
        }
    }
});


module.exports = router;
