<template>
  <div>
    <nav>
      <router-link to="/home">Home</router-link>
      <router-link to="/map">Map</router-link>
      <router-link to="/account">Account</router-link>
    </nav>
    <h1 v-show="userInfoLoaded">Welcome, {{ userInfoObj.fname }}</h1>
    <span id="msgbox" v-show="message.length > 0">{{ message }}</span>
    <div id="accountTabs">
      <b-tabs pills vertical>
        <b-tab title="Settings" active>
          <b-card-text>
            <button @click="resetPassword">Reset Password</button>
            <button @click="signOut">Sign Out</button>
            <button @click="deleteAcct">Delete Account</button>
          </b-card-text>
        </b-tab>
        <b-tab title="My Reports"
          ><b-card-text
            >This will show a table of the user's previous reports and their
            status</b-card-text
          ></b-tab
        >
      </b-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { BTab, BTabs } from "bootstrap-vue";
import { app } from "../firebaseConfig";
import { geoPos, user } from "@/datatypes";
import {
  getAuth,
  onAuthStateChanged,
  User,
  Auth,
  signOut,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  DocumentSnapshot,
  getDoc,
  getFirestore,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

//Constants
const db: Firestore = getFirestore(app);
const userColl: CollectionReference = collection(db, "users");

@Component({ components: { BTab, BTabs } })
export default class AccountView extends Vue {
  testVar = "This is from the testVar";
  uid: string | undefined = "";
  userDoc!: DocumentReference;
  auth: Auth | null = null;
  userInfoObj: user = {
    fname: "",
    lname: "",
    dotEmployee: false,
    dotID: "",
    email: "",
    phone: "",
    zipcode: "",
    lat: "",
    long: "",
    locality: "",
  };
  message = "";
  userInfoLoaded = false;

  mounted() {
    this.auth = getAuth();
    this.uid = this.auth?.currentUser?.uid;
    this.userDoc = doc(userColl, this.uid);

    this.getUserInfo();
  }

  getUserInfo() {
    getDoc(this.userDoc).then((userData: DocumentSnapshot) => {
      if (userData.exists()) {
        this.userInfoObj = userData.data().userInfo;
      }
    });
    this.userInfoLoaded = true;
  }

  resetPassword() {
    console.log("Sening password reset");
    sendPasswordResetEmail(this.auth!, this.userInfoObj.email)
      .then(() => {
        this.showMessage(
          `A password reset link has been sent to ${this.userInfoObj.email}`
        );
      })
      .catch((err: any) => {
        this.showMessage("Unable to reset password ${err}");
      });
  }

  //Function to sign user out
  signOut(): void {
    if (this.auth) signOut(this.auth);

    // Back to login page
    this.$router.push({ name: "login" });
  }

  //Function to delete a user account and their data
  deleteAcct(): void {
    var dltUser = this.auth!.currentUser;
    if (dltUser) {
      deleteDoc(this.userDoc);
      deleteUser(dltUser);
      // Back to login page
      this.$router.push({ name: "login" });
    }
  }

  showMessage(txt: string) {
    this.message = txt;

    // The message will automatically disappear after 5 seconds
    setTimeout(() => {
      this.message = "";
    }, 5000);
  }
}
</script>

<style>
#accountTabs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
