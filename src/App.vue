<template>
  <div id="app">
    <h1>Pothole Scout</h1>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/map">Map</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">

import { Component, Vue } from "vue-property-decorator";
import LoginScreen from './components/LoginScreen.vue';

@Component({
  components: {
    LoginScreen
  },

})

export default class App extends Vue {}
</script>

<style>
#app {

}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 1em;
}
</style>
