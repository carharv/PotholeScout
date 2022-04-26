<template>
  <div>
    <div id="text">
      <h1>Make a New Report</h1>
      <h5>
        To start, click anywhere on the map to drop a cone. You can drop
        multiple cones in the same report. Below the map you will find a list of
        pending reports with the option to upload a photo for each pothole.
      </h5>
      <br />
    </div>
    <ClickableMap />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ClickableMap from "../components/ClickableMap.vue";

@Component({ components: { ClickableMap } })
export default class Report extends Vue {}
</script>

<style>
#text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h5 {
  width: 80%;
}
</style>
