<template>
  <div>
    <h1>This is from ClickableMap.vue Component</h1>

    <div id="map">
      <h4>Single Point View</h4>
      <LMap
        style="height: 500px; width: 800px"
        :zoom="13"
        :center="mapCenter"
        @click="onMapClicked"
      >
        <LTileLayer :url="mapUrl" :attribution="mapAttribution"></LTileLayer>
        <LMarker
          v-for="pothole in displayPotholeArr"
          :key="pothole.id"
          :lat-lng="pothole.coordinates"
        >
          <LIcon iconUrl="https://ik.imagekit.io/carharv/coneIcon"> </LIcon>
          ></LMarker
        >
      </LMap>
    </div>
    <button @click="saveCoords">Save Locations</button>
    <div id="tableDiv" v-show="reportedPotholeArr[0]">
      <h2>Reported Potholes</h2>
      <VTable :data="reportedPotholeArr">
        <template #head>
          <th>Date</th>
          <th>UID</th>
          <th>lat</th>
          <th>lng</th>
        </template>
        <template #body="{ rows }">
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.dateCreated }}</td>
            <td>{{ row.creatorUID }}</td>
            <td>{{ row.coordinates.lat.slice(0, 8) }}</td>
            <td>{{ row.coordinates.lng.slice(0, 8) }}</td>
          </tr>
        </template>
      </VTable>
    </div>
  </div>
</template>

<script lang="ts">
/* 
To use this component you must first import the component

import ClickableMap from "../components/ClickableMap.vue";
@Component({ components: { ClickableMap } })

Then you must supply the component with the following props: uid, existingPotholeArr, mapCenter

In return, this component will emit the full reportedPotholeArr each time a user clicks the map.
Use @reportedArrUpdated in the params when using this component
*/

import { Vue, Component, Prop } from "vue-property-decorator";
import { LMap, LTileLayer, LMarker, LIcon, LCircleMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import { Pothole } from "../datatypes";
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
const userCollection: CollectionReference = collection(db, "potholes");

@Component({ components: { LMap, LTileLayer, LMarker, LIcon, LCircleMarker } })
export default class ClickableMap extends Vue {
  mapCenter = [42.963, -85.668];
  geoPos: { lat?: number; lng?: number } = {};
  coneIcon = "https://ik.imagekit.io/carharv/coneIcon";
  reportedPotholeArr: Array<Pothole> = [];
  displayPotholeArr: Array<Pothole> = [];
  mapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  mapAttribution =
    "&copy; <a target='_blank' href='http://osm.org/copyright'>OpenStreetMap</a>";

  mounted(): void {
    const auth = getAuth();
    const user = auth.currentUser;
      if (user && auth.currentUser != null) {
 
        const uid = auth.currentUser.uid;
 
        // Use filesystem syntax for document path
        const uid_doc : DocumentReference = doc(userCollection, uid);
 
        // Pushes only personal potholes into array
        getDoc(uid_doc).then((userSnapshot: DocumentSnapshot) => {
          if (userSnapshot.exists()){
            this.displayPotholeArr = userSnapshot.data().potholeArray;
            this.reportedPotholeArr = userSnapshot.data().potholeArray;
          }
        });
       
      }
   
  }

  addCoords(geoPos: { lat: number; lng: number }): void {
    // When the user pans the map left/right the longitude
    // angle can be out of the [-180,+180] range
    while (geoPos.lng > 180) geoPos.lng -= 360;
    while (geoPos.lng < -180) geoPos.lng += 360;
    this.geoPos = { ...geoPos };
    const auth = getAuth();
    const user = auth.currentUser;
      if (user && auth.currentUser != null) {
        const uid = auth.currentUser.uid;
 
        // this is to keep a seperate list of personal potholes.
        this.displayPotholeArr.push({
          creatorUID: uid,
          dateCreated: Date(),
          coordinates: {
            lng: this.geoPos.lng!.toString(),
            lat: this.geoPos.lat!.toString(),
          },
        });

        // this is to keep a seperate list of personal potholes.
        this.reportedPotholeArr.push({
          creatorUID: uid,
          dateCreated: Date(),
          coordinates: {
            lng: this.geoPos.lng!.toString(),
            lat: this.geoPos.lat!.toString(),
          },
        });
      }
  }


  onMapClicked(e: any): void {
    this.addCoords(e.latlng);
  }

  saveCoords(): void {
    const auth = getAuth();
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
        potholeArray: this.reportedPotholeArr,
      });
    }
  }

  /* removeMarker(index: number) {
    this.markersArr.splice(index, 1);
  } */

}
</script>

<style scoped>
#map {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#tableDiv {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

table {
  margin-top: 8px;
}
table tr:nth-child(odd) {
  background-color: #697cad;
}
table tr:nth-child(even) {
  background-color: #699ead;
}

table tr > td {
  padding: 0.5em;
}
</style>
