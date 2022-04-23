<template>
  <div>
    <h1>This is from ClickableMap.vue Component</h1>

    <div id="map">
      <h4>Single Point View</h4>
      <LMap
        style="height: 500px; width: 800px"
        :zoom="13"
        :center="mapCenter"
      >
        <LTileLayer :url="mapUrl" :attribution="mapAttribution"></LTileLayer>
        <LMarker
          v-for="p in displayPotholeArr"
          :key="p.id"
          :lat-lng="p.coordinates"
        >
          <LIcon iconUrl="https://ik.imagekit.io/carharv/coneIcon"> </LIcon>
          ></LMarker
        >
      </LMap>
    </div>
    <div id="tableDiv">
      <h2>Reported Potholes</h2>
      <VTable :data="displayPotholeArr">
        <template #head>
          <th>Date</th>
          <th>UID</th>
          <th>lat</th>
          <th>lng</th>
          <th>Fill Status</th>
        </template>
        <template #body="{ rows }">
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.dateCreated }}</td>
            <td>{{ row.creatorUID }}</td>
            <td>{{ row.coordinates.lat.slice(0, 8) }}</td>
            <td>{{ row.coordinates.lng.slice(0, 8) }}</td>
            <td>{{row.filled}}</td>
            <td><button @click="resolveCoords(row)">Resolve</button></td>
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
  getDoc,
  updateDoc,
  query,
  getDocs,
  DocumentSnapshot,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";

@Component({ components: { LMap, LTileLayer, LMarker, LIcon, LCircleMarker } })
export default class DOTMap extends Vue {
  db: Firestore = getFirestore(app);
  userCollection: CollectionReference = collection(this.db, "potholes");
  mapCenter = [42.963, -85.668];
  geoPos: { lat?: number; lng?: number } = {};
  coneIcon = "https://ik.imagekit.io/carharv/coneIcon";
  displayPotholeArr: Array<Pothole> = [];
  mapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  mapAttribution =
    "&copy; <a target='_blank' href='http://osm.org/copyright'>OpenStreetMap</a>";

  async mounted(): Promise<void> {
    const q = query(collection(this.db, "potholes"));
    let temp : Array<Pothole> = [];

    // pushes all potholes into an array
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        temp.push(...doc.data().potholeArray);
    });

    // doc.data() is never undefined for query doc snapshots
        temp.forEach( value => {
            if(value.filled != "Resolved"){
                this.displayPotholeArr.push(value);
            }
        });

  }

  async resolveCoords( p : Pothole): Promise<void> {


    const s: string = p.creatorUID;

    const docRef: DocumentReference = doc(this.db, "potholes", s);

    getDoc(docRef).then((docSnap: DocumentSnapshot) => {

      if (docSnap.exists()) {
        let arr : Array<Pothole> = docSnap.data().potholeArray;
        arr.forEach((potDoc: Pothole) => {
          if(potDoc.dateCreated === p.dateCreated) {
            potDoc.filled = "Resolved";
          }
        });

        // doc(this.db, "potholes", p.creatorUID).update({potholeArray : arr});
        updateDoc(docRef, {potholeArray: arr});

        console.log(arr);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
    });



    let index = this.displayPotholeArr.indexOf(p);
    this.displayPotholeArr.splice(index,1);
  }

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