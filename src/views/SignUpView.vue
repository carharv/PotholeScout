<template>
  <form>
    <div class="formWrapper">
      <h2>Sign Up</h2>
      <label for="fname">First Name</label>
      <input type="text" id="fname" name="fname" />
      <label for="lname">Last Name</label>
      <input type="text" id="lname" name="lname" />
      <label for="email">Email</label>
      <input type="text" id="email" name="email" />
      <label for="phone">Phone</label>
      <input type="text" id="phone" name="phone" />
      <label for="password">Password</label>
      <input type="text" id="password" name="password" />
      <label for="retypePassword">Retype Password</label>
      <input type="text" id="retypePassword" name="retypePassword" />
      <input type="button" value="Create Account" @click="createUser" />
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SignUpView extends Vue {
  createUser() {
    //Code to create user account and store their details in firestore
    this.pushToHome();
  }

  pushToHome(): void {
    this.$router.push({ name: "home" });
  }
}
</script>

<style></style>
