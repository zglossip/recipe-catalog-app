<template>
  <div id="app">
    <Toast />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Toast from "primevue/toast";
</script>
