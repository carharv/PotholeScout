<template>
  <div>
    <nav>
      <router-link to="/home">Home</router-link>
      <router-link to="/map">Map</router-link>
      <router-link to="/account">Account</router-link>
    </nav>
    <h1>This heading is from AccountView.vue</h1>
    <div id="accountTabs">
      <b-tabs pills vertical>
        <b-tab title="Test" active>
          <b-card-text>{{ uid }}</b-card-text>
        </b-tab>
        <b-tab title="Test2"
          ><b-card-text>{{ testVar }}</b-card-text></b-tab
        >
      </b-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { BTab, BTabs } from "bootstrap-vue";
import { app } from "../firebaseConfig";
import {
  getAuth,
  onAuthStateChanged,
  User,
  Auth,
  signOut,
  deleteUser,
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

  mounted() {
    this.auth = getAuth();
    this.uid = this.auth?.currentUser?.uid;
    this.userDoc = doc(userColl, this.uid);
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
