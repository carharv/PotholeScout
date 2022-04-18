<template>
  <div>
    <nav>
      <router-link to="/home">Home</router-link>
      <router-link to="/report">Report</router-link>
    </nav>
    <h1>This heading is from Report.vue</h1>
    <ClickableMap
      :mapCenter="mapCenter"
      :existingPotholeArr="existingPotholeArr"
      :uid="uid"
      @reportedArrUpdated="saveCoords"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import ClickableMap from "../components/ClickableMap.vue";
import { Pothole } from "@/datatypes";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  setDoc,
  getDocs,
  query,
  getDoc,
  DocumentSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";

const db: Firestore = getFirestore(app);
const userCollection: CollectionReference = collection(db, "Users");

@Component({ components: { ClickableMap } })
export default class Report extends Vue {
  //Replace this with the coordinates from the user's account info
  mapCenter = [42.93066, -85.655173];

  //Replace this with the array of potholes stored in firestore
  existingPotholeArr: Array<Pothole> = [
    {
      creatorUID: "testUID",
      coordinates: { lat: "42.93066", lng: "-85.655173" },
    },
  ];

  //This function gets called everytime the user clicks on the map
  saveCoords(reportedPotholeArr: Array<Pothole>): void {
    console.log("The user reported:", reportedPotholeArr);
    /*    const auth = getAuth();
    const user = auth.currentUser;
    if (user && auth.currentUser != null) {
      const userInfo = `${user.displayName}`;
      const uid = auth.currentUser.uid;

      // Use filesystem syntax for document path
      const uid_doc: DocumentReference = doc(userCollection, uid);
      // Add a new document with our own id
      setDoc(uid_doc, {
        userName: userInfo,
        userID: uid,
        potholeArray: this.potholeArr,
      });
    } */
  }
}
</script>

<style></style>
