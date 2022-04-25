<template>
  <div id="app">
    <h1>Pothole Scout</h1>
    <nav v-if="this.$route.name !== 'login' && this.$route.name !== 'signup'">
      <router-link to="/home">Home</router-link>
      <router-link to="/report">Report</router-link>
      <router-link v-if="employeeStatus" to="/dot/review"
        >Review Reports</router-link
      >
      <router-link to="/account">Account</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getAuth, Auth } from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  DocumentSnapshot,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { app } from "./firebaseConfig";

//Constants
const db: Firestore = getFirestore(app);
const userInfoColl: CollectionReference = collection(db, "users");

@Component({})
export default class App extends Vue {
  uid: string | undefined = "";
  userDoc!: DocumentReference;
  auth: Auth | null = null;
  employeeStatus = false;

  mounted() {
    this.auth = getAuth();
    this.uid = this.auth?.currentUser?.uid;
    this.userDoc = doc(userInfoColl, this.uid);
    this.checkEmployeeStatus();
  }

  updated() {
    this.auth = getAuth();
    this.uid = this.auth?.currentUser?.uid;
    this.userDoc = doc(userInfoColl, this.uid);
    this.checkEmployeeStatus();
  }

  checkEmployeeStatus() {
    getDoc(this.userDoc).then((userData: DocumentSnapshot) => {
      if (userData.exists()) {
        this.employeeStatus = userData.data().userInfo.dotEmployee;
      }
    });
  }
}
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
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  padding: 1em;
}
</style>
