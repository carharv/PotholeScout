<template>
  <div id="app">
    <LoginScreen />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';
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
</style>
