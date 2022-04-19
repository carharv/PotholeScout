<template>
  <div>
    <nav>
      <router-link to="/home">Home</router-link>
      <router-link to="/report">Report</router-link>
    </nav>
    <h1>This heading is from Report.vue</h1>
    <ClickableMap
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ClickableMap from "../components/ClickableMap.vue";

@Component({ components: { ClickableMap } })
export default class Report extends Vue {
  
}
</script>

<style></style>
