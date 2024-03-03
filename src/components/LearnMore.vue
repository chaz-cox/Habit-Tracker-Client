<template>
  <v-container 
  class="learning-background pt-16 h-50 rounded-tl-lg rounded-b-lg"
  fluid
  >
  <v-row class="justify-center px-auto py-5 mt-16">
    <v-col
      v-for="section in learn_more"
      :key="section.title"
      cols="12"
      md="3"
    >
      <v-card class="elevation-12 ma-7">
        <v-card-title>{{ section.title }}</v-card-title>
        <v-card-text>{{ section.body }}</v-card-text>
      </v-card>
    </v-col>
  </v-row>
</v-container>
</template>

<style>
    .learning-background{
        background-image: linear-gradient(to right,#FCE7CC, #e88015c7,#000);
    }
</style>

<script setup lang="ts">
  interface LearnMore{
      title: string;
      body: string;
  }

  const learn_more: LearnMore[] = [
      {
          title: "Track Progress",
          body: "Monitor daily habits to see your progress visually."
      },
      {
          title: "Build Streaks",
          body: "Stay motivated by tracking a consecutive days of habit completion."
      },
      {
          title: "Rewards",
          body: "Celebrate weekly and monthly streaks to reinforce positive behavior."
      },
      {
          title: "Flexibility",
          body: "Easily add, remove, or modify habits to adapt to changing goals."
      },
      {
          title: "Stay Accountable",
          body: "Use the tracker as a reminder and stay committed to your goals."
      },
      {
          title: "Gain Insights",
          body: "Analyze data to understand patterns and optimize habits."
      },
      {
          title: "Personal Growth",
          body: "Cultivate better habits for improved well-being and productivity."
      },
      {
          title: "Take Notes",
          body: "Additional insights, or other notes can be taken with each given habit."
      },
      {
          title: "Keep Your Streak",
          body: "If something unexpected happens, you can keep your steak and explain why!"
      },
      {
          title: "Stay Focused",
          body: "Have only a select few of your habits to be featured, and focused on."
      },
      {
          title: "Restrict yourself",
          body: "If you are plaining on breaking a habit, set restrictions when you fall short"
      },
      {
          title: "Have fun",
          body: "Just have fun and do your best!"
      },
  ];
</script>

