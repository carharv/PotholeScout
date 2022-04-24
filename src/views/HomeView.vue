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
    <h1>This heading is from HomeView.vue</h1>
    <DisplayMap :mapCenter="mapCenter" />
    <Graph />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import DisplayMap from "../components/DisplayMap.vue";
import Graph from "../components/Graph.vue";
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

@Component({ components: { DisplayMap, Graph } })
export default class HomeView extends Vue {
  dotEmployee = false;
  uid: string | undefined = "";
  userDoc!: DocumentReference;
  auth: Auth | null = null;
  mapCenter: Array<number> = [42.963, -85.668];

  mounted() {
    this.auth = getAuth();
    this.uid = this.auth?.currentUser?.uid;
    this.userDoc = doc(userInfoColl, this.uid);
    this.getUserInfo();
  }

  getUserInfo() {
    getDoc(this.userDoc).then((userData: DocumentSnapshot) => {
      if (userData.exists()) {
        this.dotEmployee = userData.data().userInfo.dotEmployee;
        this.mapCenter = [
          parseInt(userData.data().userInfo.lat),
          parseInt(userData.data().userInfo.long),
        ];
      }
    });
  }
}
</script>

<style></style>
