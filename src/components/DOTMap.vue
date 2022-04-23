<template>
  <div>
    <div id="map">
      <LMap style="height: 500px; width: 800px" :zoom="13" :center="mapCenter">
        <LTileLayer :url="mapUrl" :attribution="mapAttribution"></LTileLayer>
        <LMarker v-for="p in displayArr" :key="p.id" :lat-lng="p.coordinates">
          <LIcon iconUrl="https://ik.imagekit.io/carharv/coneIcon"> </LIcon>
          ></LMarker
        >
      </LMap>
    </div>
    <div id="tableDiv">
      <h2>Unfilled Potholes</h2>
      <VTable :data="potholeContainerArr">
        <template #head>
          <th>Date</th>
          <th>UID</th>
          <th>lat</th>
          <th>lng</th>
          <th>Fill Status</th>
        </template>
        <template #body="{ rows }">
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.pothole.dateCreated }}</td>
            <td>{{ row.pothole.creatorUID }}</td>
            <td>{{ row.pothole.coordinates.lat.slice(0, 8) }}</td>
            <td>{{ row.pothole.coordinates.lng.slice(0, 8) }}</td>
            <td>{{ row.pothole.filled }}</td>
            <td>
              <button @click="resolvePothole(row.originalIndex)">
                Resolve
              </button>
            </td>
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
  query,
  getDocs,
  DocumentSnapshot,
  onSnapshot,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";

const db: Firestore = getFirestore(app);
const potholeCollection: CollectionReference = collection(db, "potholes");
const allReportsDoc: DocumentReference = doc(potholeCollection, "allReports");

type PotholeContainer = {
  pothole: Pothole;
  originalIndex: string;
};

@Component({ components: { LMap, LTileLayer, LMarker, LIcon, LCircleMarker } })
export default class DOTMap extends Vue {
  mapCenter = [42.963, -85.668];
  geoPos: { lat?: number; lng?: number } = {};
  coneIcon = "https://ik.imagekit.io/carharv/coneIcon";
  allReportsArr: Array<Pothole> = [];
  displayArr: Array<Pothole> = [];
  potholeContainerArr: Array<PotholeContainer> = [];
  mapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  mapAttribution =
    "&copy; <a target='_blank' href='http://osm.org/copyright'>OpenStreetMap</a>";

  mounted() {
    this.getPotholes();
  }

  getPotholes(): void {
    onSnapshot(allReportsDoc, (reports: DocumentSnapshot) => {
      if (reports.exists()) {
        this.allReportsArr = reports.data().potholeArray;
        this.displayArr.splice(0);
        this.potholeContainerArr.splice(0);

        for (let index in this.allReportsArr) {
          if (this.allReportsArr[index].filled !== "Filled") {
            this.displayArr.push(this.allReportsArr[index]);

            this.potholeContainerArr.push({
              pothole: this.allReportsArr[index],
              originalIndex: index,
            });
          }
        }

        console.log("Pothole Array has been updated");
      }
    });
  }

  resolvePothole(index: string) {
    let indexNum = parseInt(index);
    this.allReportsArr[indexNum].filled = "Filled";
    this.displayArr.splice(indexNum, 1);

    this.saveArray();
  }

  saveArray() {
    setDoc(allReportsDoc, { potholeArray: this.allReportsArr });
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
