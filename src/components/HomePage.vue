<template>
    <!-- Header with user's name and greeting -->
    <v-toolbar color="#975acc" class="thicker-toolbar" dark>
      <v-toolbar-title class="text-h3 fit-thicker-toolbar">Hey {{ firstName }}, let's take a look at your habits!</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-btn color="white" @click="logout">Logout</v-btn>
    </v-toolbar>
  <div class="background-container">

    <!-- Featured Habit card -->
    <v-container v-for="habit in featuredHabits">
      <v-card class="cursor-pointer pa-5" @click="storeHabit(habit._id)">
        <v-icon>mdi-star</v-icon>
        <v-card-title>{{ habit.title }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <div>Description: {{ habit.description}}</div>
              <div>Streak: {{ habit.currentStreak}}</div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container> -->

    <!-- Arrows to navigate through habits -->
    <v-container v-if="habits.length > 0">
      <v-row justify="center">
        <v-col class="flex-space-btn">
          <v-btn icon @click="previousHabit()">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
        </v-col>
        <v-col class="flex-space">
        <v-card class="mx-auto cursor-pointer pa-5" max-width="400" @click="storeHabit(habits[i]._id)">
            <v-card-title> {{ habits[i].title }} </v-card-title>
            <div> {{habits[i].description}} </div>
        </v-card>
        </v-col>
        <v-col class="flex-space">
        <v-card class="mx-auto cursor-pointer pa-5" max-width="400" v-if="habits.length>1" @click="storeHabit(habits[i+1]._id)">
            <v-card-title> {{ habits[i+1].title}} </v-card-title>
            <div> {{habits[i+1].description}} </div>
        </v-card>
        </v-col>
        <v-col class="flex-space">
        <v-card v-if="habits.length >2" class ="cursor-pointer pa-5" @click="storeHabit(habits[i+2]._id)">
            <v-card-title> {{ habits[i+2].title}} </v-card-title>
            <div> {{habits[i+2].description}} </div>
        </v-card>
        </v-col>

        <v-col class="flex-space-btn">
          <v-btn icon @click="nextHabit">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-col>
        <v-col class="flex-space-btn" v-show="showCreate">
          <v-btn @click="openDialog('createHabit')" color="primary">Add New Habit</v-btn>
            
        </v-col>
      </v-row>
    </v-container>
  <v-btn v-if= "habits.length == 0" @click="openDialog('createHabit')" color="primary" class="mx-auto">Create Habit</v-btn>
    <FormDialog 
      title="Create Habit"
      :fields = "CreateHabitFields"
      :visible="CreateHabitDialog"
      :clearOnClose="true"
      @close="closeDialog"
      @submit="submitDialog"
      />

  </div>
</template>

<style>
.thicker-toolbar{
    height: 160px !important;
}
.fit-thicker-toolbar{
    min-width: auto !important;
    line-height: normal !important;
    padding-top: 110px !important;
    color: white;
}
.background-container {
  background-image: url('/nightsky3.png'); /* Background image URL */
  background-size: cover; /* Cover the entire background */
  background-position: center; /* Center the background image */
  background-repeat: no-repeat; /* Prevent background image from repeating */
  width: 100%; /* Ensure the div covers the entire width of the viewport */
  height: 100vh; /* Set the height to cover the entire viewport height */
}
.flex-space{
    flex: 0 3.3333333%;
    margin: 20px;
    width: auto;
}
.flex-space-btn{
    flex: 0 0 0 !important;
    margin: 20px;
}
</style>

<script lang="ts">
export default {
  data() {
    return {

      firstName: '', 
      featuredHabits:[],
      showCreate: false,
      CreateHabitDialog:  false,
      habits: [],
      CreateHabitFields: [
        {
            id:"title",
            title: "Habit title",
            type: "text",
            required: true,
        },
        {
            id:"description",
            title: "Habit description",
            type: "text",
            required: false,
            hint: "not required, but recommended",
        },
        {
            id:"notes",
            title: "Additional notes?",
            type: "text",
            required: false,
            hint: "More is better",
        },
        {
            id:"gainingNew",
            title: "New Habit? (or old habit)",
            type: "bool",
            required: false,
            value: true,
            hint: "",
        },
        {
            id:"isFeatured",
            title:"Featured Habit?",
            type: "bool",
            required: false,
            value: false,
            hint: "",
        },
                    
      ],
      i: 0,
    };
  },
  created: function() {
      let userId = localStorage.getItem("userId");
      this.getName(userId);
      this.getHabits(userId);
      
  },
  methods: {
    getName: async function (userId: string){
        let res = await fetch(`${this.$URL}/users/${userId}/name`);
        if (res.status == 200){
            let info = await res.json();
            this.firstName = info.Name;
        }
    },
    getHabits: async function (userId: string){
        this.featuredHabits = [];
        this.habits = [];
        console.log(userId);
        let res = await fetch(`${this.$URL}/habits?userId=${userId}`);
        if (res.status == 200){
            let loadingHabits = await res.json();
            loadingHabits.forEach((habit)=>{
                if (habit.isFeatured  && this.featuredHabits.length < 3){
                    console.log(habit, habit.isFeatured);
                    this.featuredHabits.push(habit);
                }else{
                    console.log(habit, habit.isFeatured);
                    this.habits.push(habit);
                }
            });
        }
        if (this.habits.length == 0 && this.featuredHabits.length == 0){
          this.CreateHabitDialog = true;
          console.log(this.CreateHabitDialog);
        }
    },
    storeHabit(habitId: string){
        localStorage.setItem("selectedHabitId",habitId);
        this.$router.push("/habit");
    },
    createHabit: async function(data){
        //create a goal then do it... but for now just 
        let res = await fetch( `${this.$URL}/habits`, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type" : "application/json",
            },
        });
        if (res.status == 201){
            //go to habit page with this habit
            this.closeDialog();
            this.getHabits(data.userId);
        }
    },
    logout() {
        localStorage.clear();
        this.$router.push('/');
        console.log("logout");
    },
    openDialog(dialog: string) {
        if (dialog == "createHabit"){
            this.CreateHabitDialog = true;
        }
    },
    closeDialog(){
        this.CreateHabitDialog = false;
    },
    submitDialog(inputs){
        let data = inputs;
        data["userId"] = localStorage.getItem("userId"); 
        this.createHabit(data);

        this.closeDialog();
    },
    previousHabit() {
      this.showCreate = false;
      if (this.i-3 >= 0) {
        this.i -= 3;
      }else if (this.i-2 >= 0) {
          this.i -=2;
      }else if (this.i-1 >= 0) {
          this.i--;
      }else{
          this.showCreate = true;
      }
    },
    nextHabit() {
      this.showCreate = false;
      if (this.i+6 <= this.habits.length) {
        this.i += 3;
      }else if (this.i+5 <= this.habits.length) {
          this.i +=2;
      }else if (this.i+4 <= this.habits.length) {
          this.i++;
      }else{
          this.showCreate = true;
      }
    }
  }
};
</script>

