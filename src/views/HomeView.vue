<template>
  <div>
    <nav>
      <router-link to="/home">Home</router-link>
      <router-link to="/report">Report</router-link>
    </nav>
    <h1>This heading is from HomeView.vue</h1>
    <DisplayMap/>
  </div>
</template>

<script>

import { Component, Vue } from "vue-property-decorator";
import DisplayMap from "../components/DiplayMap.vue";

@Component ({ components: { DisplayMap } })
export default class HomeView extends Vue {}
</script>

<style></style>
