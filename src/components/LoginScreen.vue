<template>
  <div class="hello">
    <h1>Grand Rapids Pothole Reporting App</h1>
    <form action="">
        <h3>Login</h3>
        <label for="fname">Username: </label><br>
        <input type="text" id="fname" name="fname"><br>
        <label for="lname">Password: </label><br>
        <input type="text" id="lname" name="lname"><br><br>
        <input type="submit" value="Login">
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class LoginScreen extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
form {
    padding: 30px;
    width: 30%;
    max-width: 1500px;
    margin: 0 auto;
    height: 100%;
    background-color: #699EAD;
}
form input[type="submit"] {
  text-align: right;
}

.hello {
  background-color: #69AD9A;
}
</style>
