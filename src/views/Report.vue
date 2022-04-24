<template>
  <div>
    <ClickableMap />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ClickableMap from "../components/ClickableMap.vue";

@Component({ components: { ClickableMap } })
export default class Report extends Vue {}
</script>

<style></style>
