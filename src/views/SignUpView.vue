<template>
  <form>
    <div class="formWrapper">
      <h2>Sign Up</h2>
      <label for="fname">First Name</label>
      <input type="text" id="fname" v-model="fname" />
      <label for="lname">Last Name</label>
      <input type="text" id="lname" v-model="lname" />
      <label for="email">Email</label>
      <input type="text" id="email" v-model="email" />
      <label for="phone">Phone</label>
      <input type="text" id="phone" v-model="phone" />
      <label for="password">Password</label>
      <input type="text" id="password" v-model="password" />
      <label for="retypePassword">Retype Password</label>
      <input type="text" id="retypePassword" v-model="retypePassword" />
      <button :disabled="!isValidInput" @click="createUser">
        Create Account
      </button>
      <p v-if="inputErrors.length">
        <b>Please Correct the Following Error(s):</b>
        <ul>
            <li v-for="(error,pos) in inputErrors" :key="pos">{{error}}</li>
        </ul>
      </p>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  getAuth,
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

@Component
export default class SignUpView extends Vue {
  fname = "";
  lname = "";
  email = "";
  phone = "";
  password = "";
  retypePassword = "";
  inputErrors: string[] = [];

  auth: Auth | null = null;

  get isValidInput(): boolean {
    this.inputErrors.splice(0)
    let checksPassed = 0;

    if (!this.checkForBlankFields) {
      checksPassed++;
    }

    if (this.matchingPasswords) {
      checksPassed++;
    }

    if (this.validEmail) {
      checksPassed++;
    }

    if (this.validPhone) {
      checksPassed++;
    }

    return checksPassed === 4;
  }

  get checkForBlankFields(): boolean {
    let blankFields = 6;

    if (!this.fname) {
      this.inputErrors.push("First Name is Required");
    } else {
      blankFields--;
    }

    if (!this.lname) {
      this.inputErrors.push("Last Name is Required");
    } else {
      blankFields--;
    }

    if (!this.email) {
      this.inputErrors.push("Email is Required");
    } else {
      blankFields--;
    }

    if (!this.phone) {
      this.inputErrors.push("Phone is Required");
    } else {
      blankFields--;
    }

    if (!this.password) {
      this.inputErrors.push("Password is Required");
    } else {
      blankFields--;
    }

    if (!this.retypePassword) {
      this.inputErrors.push("Please Retype Password");
    } else {
      blankFields--;
    }

    return blankFields !== 0;
  }

  get matchingPasswords(): boolean {
      let passed = false
      if(this.password === this.retypePassword){
          passed=true
      }
      else{
          this.inputErrors.push("Passwords Do Not Match")
      }
    return passed;
  }

  get validEmail(): boolean {
    let passed = false;

    if (!this.email.includes("@")) {
      this.inputErrors.push("Invalid Email");
    } else {
      passed = true;
    }
    return passed;
  }

  get validPhone(): boolean {
    let passed = false;

    if (this.phone.length !== 10) {
      this.inputErrors.push("Invalid Phone - Please Enter Just 10 Digits");
    } else {
      passed = true;
    }
    return passed;
  }

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
