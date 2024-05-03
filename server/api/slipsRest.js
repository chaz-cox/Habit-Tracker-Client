const express = require('express');
const Slips = require('../model/slips');
const router = express.Router();

//Logger
router.use((req, res, next) => {
    console.log(`${req.method} api/slips${req.url} Time:`,Date.now());
    const allowedFields = ["title", "description", "tools", "triggers", "restriction","restrictionBreakStreak","notes"];
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
        let slips = await Slips.find();
        res.status(200).json(slips);
    }catch{
        console.log(err);
        res.status(500).json({Error: err.message});
    }
});

router.get("/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        let slip = await Slips.findById(id);
        if(slip){
            res.status(200).json(slip);
        }else{
            res.status(404).json({Message:"No slip found"});
        }
    }catch{
        if (err.name == "CastError"){
            res.status(400).json({Error:"Invalid format"});
        }else{
            console.log(err);
            res.status(500).json({Error:err.message});
        }
    }
});

//POST
router.post("/", async (req, res) =>{
    try{
        let slip = new Slips({
            title: req.body.title,
            description: req.body.description,
            tools: req.body.tools,
            triggers: req.body.triggers,
            restriction: req.body.restriction,
            restrictionBreakStreak: req.body.restrictionBreakStreak,
            notes: req.body.notes
        });
        await slip.save();
        res.status(201).json({Message:"created"});
    }catch(err){
        if (err.name == 'ValidationError'){
            res.status(400).json({Error: err.message });
        }else{
            console.log(err);
            res.status(500).json({Error: err.message });
        }
    }
});

//PUT

//DELETE
router.delete("/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        let slip= await Slips.findByIdAndDelete(id);
        if(slip){
            res.status(200).json({Message:`${slip.title} was deleted`});
        }else{
            res.status(404).json({Message: "No reward found"});
        }
    }catch(err){
        if (err.name == "CastError"){
            res.status(400).json({Error:"Invalid format"});
        }else{
            console.error(err);
            res.status(500).json({Error:err.message});
        }
    }
});

module.exports = router;
