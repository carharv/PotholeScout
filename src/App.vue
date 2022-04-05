<template>
  <div id="app">
    <h1>Pothole Scout</h1>
    <div id="map">
      <Map />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Map from "./components/Map.vue";

@Component({
  components: {
    Map,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#map {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
