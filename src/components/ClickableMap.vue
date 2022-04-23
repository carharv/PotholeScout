<template>
  <div>
    <div id="map">
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
    <button @click="submitReport">Submit Report</button>
    <button @click="toggleView">Toggle all reports</button>
    <div id="tableDiv" v-show="userReportsArr[0]">
      <h2>My Pending Report</h2>
      <VTable :data="userReportsArr">
        <template #head>
          <th>Date</th>
          <th>Lat</th>
          <th>Lng</th>
        </template>
        <template #body="{ rows }">
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.dateCreated }}</td>
            <td>{{ row.coordinates.lat.slice(0, 8) }}</td>
            <td>{{ row.coordinates.lng.slice(0, 8) }}</td>
            <td><button @click="removeReport(row)">Remove</button></td>
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
  setDoc,
  getDoc,
  DocumentSnapshot,
  onSnapshot,
} from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";

const db: Firestore = getFirestore(app);
const potholeCollection: CollectionReference = collection(db, "potholes");
const allReportsDoc: DocumentReference = doc(potholeCollection, "allReports");

@Component({ components: { LMap, LTileLayer, LMarker, LIcon, LCircleMarker } })
export default class ClickableMap extends Vue {
  mapCenter = [42.963, -85.668];
  geoPos: { lat?: number; lng?: number } = {};
  coneIcon = "https://ik.imagekit.io/carharv/coneIcon";
  initialPotholeArr: Array<Pothole> = [];
  userReportsArr: Array<Pothole> = [];
  allReportsArr: Array<Pothole> = [];
  displayPotholeArr: Array<Pothole> = [];
  allReports: any;
  showUserOnly = false;
  initialArrLen = 0;
  initialLoad = true;

  uid = "";
  auth: Auth | null = null;

  mapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  mapAttribution =
    "&copy; <a target='_blank' href='http://osm.org/copyright'>OpenStreetMap</a>";

  mounted(): void {
    this.auth = getAuth();
    this.uid = this.auth?.currentUser!.uid;

    this.getPotholes();

    if (this.showUserOnly) {
      this.displayPotholeArr = this.userReportsArr;
    } else {
      this.displayPotholeArr = this.allReportsArr;
    }
  }

  getPotholes(): void {
    onSnapshot(allReportsDoc, (data: DocumentSnapshot) => {
      if (data.exists()) {
        this.allReports = data.data();

        this.handleUserReports();

        for (var report of this.allReports.potholeArray) {
          if (report.filled !== "Filled") {
            this.allReportsArr.push(report);
          }
        }

        this.initialArrLen = this.initialPotholeArr.length;
      }
    });
  }

  handleUserReports() {
    if (this.initialLoad) {
      this.allReports.potholeArray.forEach((obj: Pothole) =>
        this.initialPotholeArr.push(Object.assign({}, obj))
      );
      this.initialLoad = false;
    }
  }

  newUserReport(geoPos: { lat: number; lng: number }): void {
    // When the user pans the map left/right the longitude
    // angle can be out of the [-180,+180] range
    while (geoPos.lng > 180) geoPos.lng -= 360;
    while (geoPos.lng < -180) geoPos.lng += 360;
    this.geoPos = { ...geoPos };

    this.userReportsArr.push({
      creatorUID: this.uid,
      dateCreated: Date().slice(0, 25),
      coordinates: {
        lng: this.geoPos.lng!.toString(),
        lat: this.geoPos.lat!.toString(),
      },
      filled: "Not Filled",
    });

    this.allReportsArr.push({
      creatorUID: this.uid,
      dateCreated: Date(),
      coordinates: {
        lng: this.geoPos.lng!.toString(),
        lat: this.geoPos.lat!.toString(),
      },
      filled: "Not Filled",
    });
  }

  onMapClicked(e: any): void {
    this.newUserReport(e.latlng);
  }

  submitReport(): void {
    setDoc(allReportsDoc, { potholeArray: this.allReportsArr });

    this.pushToHome();
  }

  pushToHome(): void {
    this.$router.push({ name: "home" });
  }

  removeReport(row: Pothole): void {
    let userIndex = this.userReportsArr.indexOf(row);
    let allIndex = this.userReportsArr.indexOf(row) + this.initialArrLen;
    this.userReportsArr.splice(userIndex, 1);
    this.allReportsArr.splice(allIndex, 1);
  }

  toggleView() {
    if (!this.showUserOnly) {
      this.displayPotholeArr = this.userReportsArr;
      this.showUserOnly = true;
    } else {
      this.displayPotholeArr = this.allReportsArr;
      this.showUserOnly = false;
    }
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
