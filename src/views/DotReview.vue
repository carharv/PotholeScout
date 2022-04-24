<template>
  <div>
    <DOTMap />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import DOTMap from "../components/DOTMap.vue";

@Component({ components: { DOTMap } })
export default class DotReview extends Vue {}
</script>

<style></style>
