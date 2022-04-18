<template>
  <div>
    <nav>
      <router-link to="/home">Home</router-link>
      <router-link to="/report">Report</router-link>
    </nav>
    <h1>This heading is from HomeView.vue</h1>
  </div>
</template>

<script>
import { Vue } from "vue-property-decorator";

export default class HomeView extends Vue {}
</script>

<style></style>
