<template>
  <div>
    <nav>
      <router-link to="/home">Home</router-link>
      <router-link to="/report">Report</router-link>
      <router-link v-if="dotEmployee" to="/dot/review"
        >Review Reports</router-link
      >
      <router-link to="/account">Account</router-link>
    </nav>
    <DisplayMap />
    <h2>insert charts here</h2>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import DisplayMap from "../components/DisplayMap.vue";
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
import { app } from "../firebaseConfig";

//Constants
const db: Firestore = getFirestore(app);
const userInfoColl: CollectionReference = collection(db, "users");

@Component({ components: { DisplayMap } })
export default class HomeView extends Vue {
  dotEmployee = false;
  uid: string | undefined = "";
  userDoc!: DocumentReference;
  auth: Auth | null = null;

  mounted() {
    this.auth = getAuth();
    this.uid = this.auth?.currentUser?.uid;
    this.userDoc = doc(userInfoColl, this.uid);
    this.checkDotEmployee();
  }

  checkDotEmployee() {
    getDoc(this.userDoc).then((userData: DocumentSnapshot) => {
      if (userData.exists()) {
        this.dotEmployee = userData.data().userInfo.dotEmployee;
      }
    });
  }
}
</script>

<style></style>
