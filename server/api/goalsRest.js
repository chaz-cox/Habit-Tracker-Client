const express = require('express');
const Goals = require('../model/goals');
const Rewards = require('../model/rewards');
const router = express.Router();

//Logger
router.use((req, res, next) => {
    console.log(`${req.method} api/goals${req.url} Time:`,Date.now());
    const allowedFields = ["habitId","title", "description", "rewards", "howManyDays", "repeats","notes"];
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
        let habitId= { habitId: req.query.habitId };
        let goals = await Goals.find(habitId);
        res.status(200).json(goals);
    }catch(err){
        res.status(500).json({Error:err.message});
    }
});

router.get("/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        let goal = await Goals.findById(id);
        if (goal){
            res.status(200).json(goal);
        }else{
            res.status(404).json({Message:"Goal not found"});
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
router.post("/", async (req, res)=>{
    try{
        let newReward = { rewards : req.query.reward? [req.query.reward]: [] };
        let goal = new Goals({
            habitId: req.body.habitId,
            title: req.body.title,
            description: req.body.description,
            rewards: newReward.rewards,
            howManyDays: req.body.howManyDays,
            repeats: req.body.repeats,
            notes: req.body.notes,
        });
        await goal.save();
        res.status(201).json({Message:"created", goalId:goal._id});
    } catch(err){
        if (err.name == 'ValidationError'){
            res.status(422).json({Error: err.message });
        }else{
            res.status(500).json({Error: err.message });
        }
    }
});

//PUT
router.put("/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        let goal = await Goals.findById(id);
        if (!goal){
            res.status(404).json({Message:"Goal not found"});
            return;
        }
        let updateGoalItems = {
            title: req.query.title,
            description: req.query.description,
            reward: req.query.reward,
            deleteReward: req.query.deleteReward,
            howManyDays: req.query.howManyDays,
            repeats: req.query. repeats,
            notes: req.query.notes
        };
        let newTitle = updateGoalItems.title? updateGoalItems.title: goal.title;
        let newDescription = updateGoalItems.description? updateGoalItems.description: goal.description;
        let newRewards = updateGoalItems.reward? [...goal.rewards, updateGoalItems.reward]: goal.rewards;
        if (updateGoalItems.deleteReward){
            let exists = await Rewards.findById(updateGoalItems.deleteReward);
            if (!exists){
                newRewards = newRewards.filter((ID) => ID !== updateGoalItems.deleteReward);
            }else{
                res.status(409).json({Error: "Cannot delete reward id when reward exists"});
                return;
            }
        }
        let newHowManyDays = updateGoalItems.howManyDays? updateGoalItems.howManyDays: goal.howManyDays;
        let newRepeats = updateGoalItems.repeats? updateGoalItems.repeats: goal.repeats;
        let newNotes = updateGoalItems.notes? updateGoalItems.notes: goal.notes;

        let newGoal = await Goals.findByIdAndUpdate(id,{
            title: newTitle,
            description: newDescription,
            rewards: newRewards,
            howManyDays: newHowManyDays,
            repeats: newRepeats,
            notes: newNotes
        });
        if(!newGoal){
            res.status(404).json({Message: "this shouldn't ever get hit, but new goal not found"});
        }else{
            res.status(200).json(newGoal);
        }
    } catch(err){
        console.log(err);
        res.status(500).json({Error: err.message});
    }
});



//DELETE
router.delete("/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        let goal = await Goals.findById(id);
        if (goal){
            if (goal.rewards.length > 0){
                res.status(409).json({Error: "Cannot delete goal with rewards attached"});
                return;
            }
        }
        let deleteGoal = await Goals.findByIdAndDelete(id);
        if (deleteGoal){
            res.status(200).json({Message:`${deleteGoal.title} was deleted`});
        }else{
            res.status(404).json({Message:"Goal not found"});
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
