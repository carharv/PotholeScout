<template>
  <div id="main">
    <div id="form" class="hello">
      <div id="signup">
        <h4>Are you new here?</h4>
        <input
          class="button"
          type="button"
          value="Sign Up"
          @click="pushToSignup"
        />
      </div>
      <div class="form-wrapper">
        <label for="uname">Email: </label><br />
        <input type="text" id="email" v-model="email" /><br />
        <label for="password">Password: </label><br />
        <input
          type="password"
          id="password"
          @keydown.enter="emailLogin"
          v-model="password"
        /><br /><br />
        <button v-if="email" class="button" @click="resetPass">
          Reset Password
        </button>
        <input type="submit" value="Login" @click="emailLogin" />
      </div>
      <span id="msgbox" v-show="message.length > 0">{{ message }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  getAuth,
  Auth,
  UserCredential,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

@Component
export default class LoginScreen extends Vue {
  @Prop() private msg!: string;

  email = "";
  password = "";
  message = "";
  auth: Auth | null = null;

  mounted(): void {
    this.auth = getAuth();
  }

  showMessage(txt: string) {
    this.message = txt;

    // The message will automatically disappear after 5 seconds
    setTimeout(() => {
      this.message = "";
    }, 5000);
  }

  pushToHome(): void {
    this.$router.push({ name: "home" });
  }

  pushToSignup(): void {
    this.$router.push({ name: "signup" });
  }

  emailLogin(): void {
    signInWithEmailAndPassword(this.auth!, this.email, this.password)
      .then(async (cr: UserCredential) => {
        if (cr.user.emailVerified) {
          this.pushToHome();
        } else {
          this.showMessage("You must first verify your email");
          await signOut(this.auth!);
        }
      })
      .catch((err: any) => {
        this.showMessage(`Unable to login ${err}`);
      });
  }

  resetPass(): void {
    sendPasswordResetEmail(this.auth!, this.email)
      .then(() => {
        this.showMessage(
          `A Password Reset Link Has Been Sent To ${this.email}`
        );
      })
      .catch((err: any) => {
        this.showMessage("Unable to reset password ${err}");
      });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main {
  margin: 2em;
}

.form-wrapper label {
  float: left;
  font-size: 20px;
}

.form-wrapper {
  min-width: 200px;
  max-width: 400px;
  margin: 0 auto;
}

#form {
  padding: 1em;
  width: 30%;
  max-width: 1000px;
  min-width: 300px;
  margin: 0 auto;
  height: 100%;
  background-color: #699ead;
  text-align: center;
  border-radius: 10px;
}

#form input[type="submit"] {
  float: right;
  width: 100px;
  color: #699ead;
  background-color: white;
  font-size: 20px;
  font-weight: bold;
  border: none;
  padding: 0.25em;
  border-radius: 10px;
  padding-right: 0;
  transition: all 0.4s;
}

#form input[type="submit"]:hover,
.button:hover {
  transform: scale(1.2);
}

#form input[type="text"],
#form input[type="password"] {
  width: 100%;
  border-radius: 5px;
  border: none;
  padding-right: 0;
  padding-left: 0;
  border: 2px solid #699ead;
  transition: all 0.2s;
}

#form input[type="text"]:focus,
#form input[type="password"]:focus {
  border: 2px solid white;
  outline: none;
}

.hello {
  height: 100%;
  color: white;
  font-weight: bold;
}

#signup {
  display: flex;
  align-items: center;
  justify-content: center;
}

h4 {
  display: inline;
  margin: 0;
  padding: 0.5em;
}

.button {
  width: 130px;
  color: #699ead;
  font-size: 15px;
  font-weight: bold;
  border: none;
  padding: 5px;
  margin: 1em !important;
  height: 40px;
  border-radius: 10px;
  padding-right: 0;
  transition: all 0.4s;
}
</style>
