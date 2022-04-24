<template>
  <div>
    <div id="map">
      <div id="heatmap" v-show="heatmapMode">
        <LMap
          style="height: 500px; width: 800px"
          :zoom="12"
          :minZoom="12"
          :center="mapCenter"
        >
          <LTileLayer :url="mapUrl" :attribution="mapAttribution"></LTileLayer>
          <LCircleMarker
            v-for="pothole in displayPotholeArr"
            :key="pothole.id"
            :lat-lng="pothole.coordinates"
            :fillOpacity="0.5"
            :fillColor="`#ffa500`"
            :color="`#ffa500`"
            :radius="8"
            :stroke="false"
          >
          </LCircleMarker>
        </LMap>
      </div>
      <div id="singlePointView" v-show="!heatmapMode">
        <LMap
          style="height: 500px; width: 800px"
          :zoom="13"
          :center="mapCenter"
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
    </div>
    <div id="tableDiv" v-show="displayPotholeArr[0] && showReportedCoords">
      <h2>Reported Coordinates</h2>
      <VTable :data="displayPotholeArr">
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
  DocumentSnapshot,
  onSnapshot,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";

const db: Firestore = getFirestore(app);
const potholeCollection: CollectionReference = collection(db, "potholes");
const allReportsDoc: DocumentReference = doc(potholeCollection, "allReports");

@Component({ components: { LMap, LTileLayer, LMarker, LIcon, LCircleMarker } })
export default class DisplayMap extends Vue {
  @Prop() mapCenter!: Array<number>;

  geoPos: { lat?: number; lng?: number } = {};
  displayPotholeArr: Array<Pothole> = [];
  heatmapMode = true;
  mapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  mapAttribution =
    "&copy; <a target='_blank' href='http://osm.org/copyright'>OpenStreetMap</a>";
  canEditMap = false;
  coneIcon = "https://ik.imagekit.io/carharv/coneIcon";

  mounted() {
    this.getPotholes();
  }

  //This function listens for updates
  getPotholes(): void {
    onSnapshot(allReportsDoc, (reports: DocumentSnapshot) => {
      if (reports.exists()) {
        this.displayPotholeArr = reports.data().potholeArray;
        console.log("Pothole Array has been updated");
      }
    });
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
