const express = require('express');
const Habits = require('../model/habits');
const Goals = require('../model/goals');
const Rewards = require('../model/rewards');
const Slips = require('../model/slips');
const mongoose = require('mongoose');
const router = express.Router();

//Logger
router.use((req, res, next) => {
    console.log(`${req.method} api/habits${req.url} Time:`,Date.now());
    const allowedFields = ["userId","title", "description","gainingNew","isFeatured","currentStreak","longestStreak",
        "reward", "numberOfDays","goals","slips","notes"];
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
        let userId = {userId : req.query.userId};
        let habits= await Habits.find(userId);
        res.status(200).json(habits);
    }catch(err){
        console.error(err);
        res.status(500).json({Error:err.message});
    }
});

router.get("/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        let habit = await Habits.findById(id); 
        if (habit){ // update number of days each time you click on the habit
            let currentDate = new Date();
            let differenceMs = currentDate.getTime() - habit.dateCreated.getTime();
            let differenceDays = Math.ceil(differenceMs / (1000*60*60*24)); //change to floor after tomorrows testing
            console.log(differenceMs, differenceDays);
            if( habit.numberOfDays < differenceDays){
                let newHabit = await Habits.findByIdAndUpdate(id,{ 
                    numberOfDays: differenceDays
                }, {returnDocument : "after"});
                if (!newHabit){
                    res.status(404).json({Message: "this shouldn't ever get hit, but new habit not found"});
                }else{
                    res.status(200).json(newHabit);
                }
            }else{
                res.status(200).json(habit);
            }
        }else{
            res.status(404).json({Message:"Habit not found"});
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

//POST
router.post("/", async (req, res)=>{
    try{
        let newGoal = { goals : req.query.goal? [req.query.goal]: [] };
        let habit = new Habits({
            userId: req.body.userId,
            title: req.body.title,
            description: req.body.description,
            gainingNew: req.body.gainingNew,
            isFeatured: req.body.isFeatured,
            goals: newGoal.goals,
            reward: req.body.reward,
            notes: req.body.notes
        });
        await habit.save();
        res.status(201).json({Message:"created"});
    } catch(err){
        if (err.name == 'ValidationError'){ //422 is ValidationError
            if(err.errors){
                let emsg = {};
                for( var f in err.errors){
                    emsg[f] = err.errors[f].message;
                }
                console.log(emsg);//error messge done in class
            }
            res.status(422).json({Error: err.message });
        }else{
            console.error(err);
            res.status(500).json({Error: err.message });
        }
    }
});


//PUT
router.put("/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        let habit = await Habits.findById(id); 
        if (!habit){
            res.status(404).json({Message:"Habit not found"});
            return;
        }
        let updateHabitItems = {
            title: req.query.title,
            description: req.query.description,
            isFeatured: req.query.isFeatured,
            currentStreak: req.query.currentStreak,
            longestStreak: req.query.longestStreak,
            goal: req.query.goal,
            deleteGoal: req.query.deleteGoal,
            reward: req.query.reward,
            deleteReward: req.query.deleteReward,
            slip: req.query.slip,
            deleteSlip: req.query.deleteSlip,
            notes: req.query.notes,
        };
        let newTitle = updateHabitItems.title? updateHabitItems.title: habit.title;
        let newDescription = updateHabitItems.description? updateHabitItems.description: habit.description;
        let newIsFeatured = updateHabitItems.isFeatured? updateHabitItems.isFeatured: habit.isFeatured;
        let newCurrentStreak = updateHabitItems.currentStreak? updateHabitItems.currentStreak: habit.currentStreak;
        let newLongestStreak = updateHabitItems.longestStreak? updateHabitItems.longestStreak: habit.longestStreak;
        console.log(habit.goals);
        let newGoals = updateHabitItems.goal? [...habit.goals,updateHabitItems.goal]: habit.goals;
        console.log(newGoals);
        let newReward = updateHabitItems.reward? updateHabitItems.reward: habit.reward;
        let newSlips = updateHabitItems.slip? [...habit.slips,updateHabitItems.slip]: habit.slips;
        if (updateHabitItems.deleteGoal || updateHabitItems.deleteReward || updateHabitItems.deleteSlip){
            let errorMsg = "Cannot delete ";
            let exists = await Goals.findById(updateHabitItems.deleteGoal);
            ERR = false;
            if (exists){
                errorMsg += "goalId "
                ERR = true;
            }else{
                console.log(newGoals);
                newGoals = newGoals.filter((ID) => ID != updateHabitItems.deleteGoal);
                console.log(newGoals);
            }
            exists = await Rewards.findById(updateHabitItems.deleteReward);
            if (exists){
                errorMsg += "rewardId "
                ERR = true;
            }else{
                newReward = null;
            }
            exists = await Slips.findById(updateHabitItems.deleteSlip);
            if (exists){
                errorMsg += "slipId "
                ERR = true;
            }else{
                newSlips= newSlips.filter((ID) => ID !== updateHabitItems.deleteSlip);
            }
            if(ERR){
                errorMsg += "when the object(s) exist"
                res.status(409).json({Error: errorMsg});
                return;
            }
        }

        let newNotes = updateHabitItems.notes? updateHabitItems.notes: habit.notes;

        let newHabit = await Habits.findByIdAndUpdate(id,{
            title: newTitle,
            description: newDescription,
            isFeatured: newIsFeatured,
            currentStreak: newCurrentStreak,
            longestStreak: newLongestStreak,
            goals: newGoals,
            reward: newReward,
            slips: newSlips,
            notes: newNotes
        },{returnDocument: 'after'});
        if (!newHabit){
            res.status(404).json({Message: "this shouldn't ever get hit, but new habit not found"});
        }else{
            res.status(200).json(newHabit);
        }
    }catch(err){
        console.log(err);
        res.status(500).json({Error: err.message});
    }
});


                    


//DELETE
router.delete("/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        let habit = await Habits.findById(id);
        if (habit){
            if (habit.reward || habit.goals.length > 0 || habit.slips.length > 0){
                res.status(409).json({Error: "Cannot delete habit with reward or goals or slips attached"});
                return;
            }
        }
        let deleteHabit = await Habits.findByIdAndDelete(id);
        if (deleteHabit){
            res.status(200).json({Message:`${deleteHabit.title} was deleted`});
        }else{
            res.status(404).json({Message:"Habit not found"});
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
