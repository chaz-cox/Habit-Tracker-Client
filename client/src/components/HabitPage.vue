<template>
  <div class="background-habit">
    <div class= "habit-content-box">
        <div class="d-flex flex-row-reverse">
          <v-btn color="black" class="" @click="backToHome">back</v-btn>
          </div>
          <div class="mb-10" style="background-color:white; opacity:0.5;"> 
            <h1 class="text-h1 font-weight-medium">{{name}}</h1>
            <h2 class="text-h3 font-weight-medium" v-if="reward">Reward: {{reward}}</h2>
            <h2 class="text-h3 font-weight-medium mb-4" v-if="description" >Description: {{description}}</h2>
            <h2 >Streak: {{currentStreak}} days</h2>
            <h2>Number of days since start: {{days}} days</h2>
            <h2>Highest Streak: {{longestStreak}} days</h2>
            <h2>Over all Percentage: {{days > 0? (currentStreak / days)*100 : 0 }}%</h2> <!-- {{streak /days *100}} -->
          </div>
        <v-container>
          <v-row justify="center">
            <v-col>
            <v-card class="mx-auto " max-width="400">
                <v-card-title>Goals</v-card-title>
                <div v-for="goal in goals">
                    <v-card-text class="hover" @click="openDialog('goal'); setGoalInfo(goal)"> {{ goal.title }} </v-card-text>
                </div>
                <v-btn color="black" @click="openDialog('createGoal')">Create Goal</v-btn>
            </v-card>
            </v-col>
            <v-col>
            <v-card class="mx-auto" style="opacity:0;" max-width="400">
            </v-card>
            </v-col>
            <v-col>
            <v-card class="mx-auto" max-width="400" style="opacity:0;">
                <v-card-title>Slips</v-card-title>
                <v-btn color="black">Create Slip</v-btn>
            </v-card>
            </v-col>
           </v-row>
          </v-container>
          <v-col>
            <v-card class="mx-auto" max-width="1200">
                <v-card-title>Notes</v-card-title>
                {{notes}}
                <br />
                <v-btn color="black" @click="openDialog('editNotes')">Edit Notes</v-btn>
            </v-card>
          </v-col>
          <FormDialog 
              title="Create a Goal"
              :fields = "GoalFields"
              :visible="GoalDialog"
              :error="error"
              :clearOnClose="true"
              @close="closeDialog"
              @submit="submitDialog"
          />
          <FormDialog 
              title="Notes"
              :fields = "NotesField"
              :visible="NotesDialog"
              :error="error"
              :clearOnClose = "false"
              @close="closeDialog"
              @submit="submitDialog"
          />

          <InfoDialog
            title="Goal Info"
            :info = "GoalInfo"
            :visible = "GoalInfoDialog"
            :error="error"
            btn="Delete"
            @close = "closeDialog"
            @submit = "submitDialog"
          />
        <InfoDialog
            title="Are You Sure You Want To Delete This Goal?"
            :info = "GoalInfo"
            :visible = "DeleteGoalInfoDialog"
            :error="error"
            btn="Delete"
            @close = "closeDialog"
            @submit = "submitDialog"
          />

    </div>
  </div>
</template>

<style>
.background-habit {
  background-image: url('/montains.jpg'); /* Background image URL */
  background-size: cover; /* Cover the entire background */
  background-position: center; /* Center the background image */
  background-repeat: no-repeat; /* Prevent background image from repeating */
  width: 100%; /* Ensure the div covers the entire width of the viewport */
  height: 100vh; /* Set the height to cover the entire viewport height */
}
.habit-content-box{
    padding: 50px 100px;
    text-align: center;
}
.hover:hover{
    cursor: pointer;
    background-color: lightblue;
}
</style>

<script lang="ts">
export default {
  data() {
    return {
        name: "",
        description: "",
        currentStreak: null,
        goalIds: [],
        goals: [],
        isFeatured: false,
        longestStreak: 0,
        notes: "",
        days: 0,
        rewardId: "",
        reward: "", 
        slipIds: [],
        error: "",
        currentGoalId: "",
        GoalDialog: false,
        NotesDialog: false,
        GoalInfoDialog: false,
        DeleteGoalInfoDialog: false,
        GoalInfo: [],
        GoalFields: [
            {
                id: "title",
                title: "Goal title",
                type: "text",
                required: true,
                hint: "pick a good one!"
            },
            {
                id: "description",
                title: "Description",
                type: "text",
                required: true,
                hint: "yep, this is required too"
            },
            {
                id: "howManyDays",
                title: "How many days until you achieve your goal?",
                type: "number",
                required: false,
                hint: "leave this blank and you will have this goal forever...",
            },
            {
                id: "notes",
                title: "notes on this goal",
                type: "text",
                required: false,
                hint: "Hey thanks for putting extra thought into this",
            },
            {
                id: "repeats",
                title: "Daily Reminder? (for featured habits)",
                type: "bool",
                required: false,
                value: false,
            }
        ],

   };
  },
  created: function(){
      this.getHabit();
  },
  computed: {
    NotesField: function() {
        return [{
                id: "notes",
                title: "new notes...",
                type: "text",
                value: this.notes,
        }];
    }
  },
  methods: {
      getHabit: async function (){
          let habitId = localStorage.getItem("selectedHabitId");
          let res = await fetch(`${this.$URL}/habits/${habitId}`);
          if(res.status == 200){
              let info = await res.json();
              this.name = info.title;
              this.description = info.description;
              this.currentStreak = info.currentStreak;
              this.goalIds = info.goals;
              this.isFeatured = info.isFeatured;
              this.longestStreak = info.longestStreak;
              this.notes = info.notes;
              this.days = info.numberOfDays;
              this.rewardId = info.reward;
              this.slipIds = info.slips;
              this.getGoals(habitId);
          }
      },
      getGoals: async function(habitId){
          let res = await fetch(`${this.$URL}/goals?habitId=${habitId}`);
          if (res.status == 200){
              let info = await res.json();
              this.goals = info;
          }
      },
      setGoalInfo(goal){
          this.currentGoalId = goal._id;
          this.GoalInfo = [
          {
              subtitle: goal.title,
              description: goal.description,
          },
          {
              subtitle : goal.howManyDays > 0 ? "Days left" : "",
              description : goal.howManyDays > 0 ? goal.howManyDays : "",
          },
          {
              subtitle : "Notes",
              description: goal.notes,
          },
          ];
      },
      backToHome(){
        localStorage.setItem("selectedHabitId","");
        this.$router.push("/home");
      },
      createGoal: async function(data){
          let habitId = localStorage.getItem("selectedHabitId");
          data["habitId"] = habitId;
          console.log(data);
          let res = await fetch(`${this.$URL}/goals`,{
              method: "POST",
              body: JSON.stringify(data),
              headers: {
                  "Content-Type" : "application/json",
              },
          });
          if (res.status == 201){
              let info = await res.json();
              let goalId = info.goalId;
              let res2 = await fetch(`${this.$URL}/habits/${habitId}?goal=${goalId}`,{
                  method: "PUT",
              });
              if(res2.status == 200){
                  this.getHabit();
              }
          }
      },
      editNotes: async function(data){
          let habitId = localStorage.getItem("selectedHabitId");
          let newNotes = data.notes;
          let res = await fetch(`${this.$URL}/habits/${habitId}?notes=${newNotes}`,{
              method: "PUT",
          });
          if(res.status == 200){
              this.getHabit();
          }
      },
      deleteGoal: async function(){
          let res = await fetch(`${this.$URL}/goals/${this.currentGoalId}`,{
          method: "DELETE"
          });
          if (res.status == 200){
              this.getHabit();
          }else{
              let err = await res.json();
              this.error = err.Error; 
          }
      },
      openDialog(dialog: string){
          if (dialog == "createGoal"){
              this.GoalDialog = true;
          }else if(dialog == "goal"){
              this.GoalInfoDialog = true;
          }else if( dialog == "editNotes"){
              this.NotesDialog = true;
          }else if( dialog == "deleteGoal"){
              this.DeleteGoalInfoDialog = true;
          }
      },
      submitDialog(data){
          if(this.GoalDialog){
              this.createGoal(data);
          }else if (this.NotesDialog){
              this.editNotes(data);
          }else if (this.DeleteGoalInfoDialog){
              console.log(data);
              this.deleteGoal();
          }else if(this.GoalInfoDialog){
              this.openDialog("deleteGoal");
              return;
          }
          this.closeDialog();
      },
      closeDialog(){
          this.GoalDialog = false;
          this.GoalInfoDialog = false;
          this.NotesDialog = false;
          this.DeleteGoalInfoDialog = false;
      },

  }
};
</script>

