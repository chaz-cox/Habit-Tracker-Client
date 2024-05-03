<template>
  <v-app>
    <v-main>
        <router-view></router-view>
    <v-footer>
        <p>Images made by Vecteezey from vecteezey.com Icon made by nakarkOrn from flaticon.com </p>
    </v-footer>
    </v-main>
  </v-app>
</template>

<style>
</style>

<script setup lang="ts">
  import {useRoute} from 'vue-router';
</script>
