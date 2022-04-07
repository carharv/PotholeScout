<template>
  <div class="hello">
    <form action="">
      <h3>Login</h3>
      <div class="form-wrapper">
        <label for="fname">Username: </label><br />
        <input type="text" id="fname" name="fname" /><br />
        <label for="lname">Password: </label><br />
        <input type="text" id="lname" name="lname" /><br /><br />
        <input type="submit" value="Login" />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class LoginScreen extends Vue {
  @Prop() private msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form-wrapper label {
  float: left;
  padding-top: 20px;
  font-size: 20px;
}

.form-wrapper {
  min-width: 200px;
  max-width: 400px;
  margin: 0 auto;
}

form {
  padding: 30px;
  width: 30%;
  max-width: 1000px;
  min-width: 300px;
  margin: 0 auto;
  height: 100%;
  background-color: #699ead;
  text-align: center;
  height: 300px;
  margin-top: 150px;
  border-radius: 10px;
}

form input[type="submit"] {
  float: right;
  width: 100px;
  color: #699ead;
  background-color: white;
  font-size: 20px;
  font-weight: bold;
  border: none;
  padding: 5px;
  border-radius: 10px;
  padding-right: 0;
  transition: all 0.4s;
}

form input[type="submit"]:hover {
  transform: scale(1.2);
}

form input[type="text"] {
  width: 100%;
  border-radius: 5px;
  border: none;
  padding: 5px;
  margin-top: 5px;
  padding-right: 0;
  padding-left: 0;
  border: 2px solid #699ead;
  transition: all 0.2s;
}

form input[type="text"]:focus {
  border: 2px solid white;
  outline: none;
}

.hello {
  height: 100%;
  color: white;
  font-weight: bold;
}

h1 {
  margin-top: 0;
  padding-top: 20px;
  text-align: center;
  color: white;
  font-size: 36px;
}

h3 {
  font-size: 24px;
}
</style>
