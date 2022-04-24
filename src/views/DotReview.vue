<template>
  <div>
    <div id="text">
      <h1>Review Pothole Reports</h1>
      <h5>
        To mark a pothole as filled simply click the pothole's resolve button in
        the table below
      </h5>
      <br />
    </div>
    <DOTMap />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import DOTMap from "../components/DOTMap.vue";

@Component({ components: { DOTMap } })
export default class DotReview extends Vue {}
</script>

<style>
#text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
