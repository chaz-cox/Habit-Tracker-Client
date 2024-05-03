const express = require('express');
const Unexpected = require('../model/unexpected');
const router = express.Router();
//Logger
router.use((req, res, next) => {
    console.log(`${req.method} api/unexpected${req.url} Time:`,Date.now());
    next();
});


//GET
router.get("/", async (req, res)=>{
    let unexpected = await Unexpected.find();
    res.status(200).json(unexpected);
});
//POST

//PUT

//DELETE


module.exports = router;
