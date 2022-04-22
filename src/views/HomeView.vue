<template>
  <div>
    <nav>
      <router-link to="/home">Home</router-link>
      <router-link to="/map">Map</router-link>
      <router-link to="/account">Account</router-link>
    </nav>
    <h1>This heading is from HomeView.vue</h1>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

export default class HomeView extends Vue {}
</script>

<style></style>
