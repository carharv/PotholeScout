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
  //Pothole data variables
  initialPotholeArr: Array<Pothole> = [];
  userReportsArr: Array<Pothole> = [];
  allReportsArr: Array<Pothole> = [];
  displayPotholeArr: Array<Pothole> = [];
  allReports: any;
  showUserOnly = false;
  initialArrLen = 0;
  initialLoad = true;

  //Firebase user variables
  uid = "";
  auth: Auth | null = null;

  //Map variables
  mapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  mapAttribution =
    "&copy; <a target='_blank' href='http://osm.org/copyright'>OpenStreetMap</a>";
  mapCenter = [42.963, -85.668];
  geoPos: { lat?: number; lng?: number } = {};
  coneIcon = "https://ik.imagekit.io/carharv/coneIcon";

  mounted(): void {
    //Get auth and uid
    this.auth = getAuth();
    this.uid = this.auth?.currentUser!.uid;

    //Call the getPotholes function to load existing potholes and listen for updates
    this.getPotholes();

    //Display allReports by default
    this.displayPotholeArr = this.allReportsArr;
  }

  //Function to load all potholes and listen for updates
  getPotholes(): void {
    onSnapshot(allReportsDoc, (data: DocumentSnapshot) => {
      if (data.exists()) {
        this.allReports = data.data();

        this.handleUserReports();

        //Loop through each report in the newly updated array
        //If the report isn't filled then show it on the map to discourage duplicate reports
        for (var report of this.allReports.potholeArray) {
          if (report.filled !== "Filled") {
            this.allReportsArr.push(report);
          }
        }

        //Store the length of the inital array
        this.initialArrLen = this.initialPotholeArr.length;
      }
    });
  }

  //This function is designed to help keep track of user reports when a realtime update happens
  handleUserReports() {
    //If this is the first time loading the data and not just getting an update
    if (this.initialLoad) {
      //Put all reports into the initialPotholeArr
      this.allReports.potholeArray.forEach((obj: Pothole) =>
        this.initialPotholeArr.push(Object.assign({}, obj))
      );
      //No longer initial load after running this function
      this.initialLoad = false;
    }
  }

  //This function creates a new user report
  newUserReport(geoPos: { lat: number; lng: number }): void {
    // When the user pans the map left/right the longitude
    // angle can be out of the [-180,+180] range
    while (geoPos.lng > 180) geoPos.lng -= 360;
    while (geoPos.lng < -180) geoPos.lng += 360;
    this.geoPos = { ...geoPos };

    //Push the user's report to the userReportsArr
    this.userReportsArr.push({
      creatorUID: this.uid,
      dateCreated: Date().slice(0, 25),
      coordinates: {
        lng: this.geoPos.lng!.toString(),
        lat: this.geoPos.lat!.toString(),
      },
      filled: "Not Filled",
    });

    //Also push the user's report to the allReportsArr
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

  //This function is called when a user clicks on the map and triggers a new report
  onMapClicked(e: any): void {
    this.newUserReport(e.latlng);
  }

  //This function saves the allReportsArr
  submitReport(): void {
    setDoc(allReportsDoc, { potholeArray: this.allReportsArr });

    this.pushToHome();
  }

  //This function is used to remove a user's report before they submit it
  removeReport(row: Pothole): void {
    //Since the target report in userReportsArr and allReportsArr have different indexes
    //we need use the initialArrLen variable to keep track
    let userIndex = this.userReportsArr.indexOf(row);
    let allIndex = this.userReportsArr.indexOf(row) + this.initialArrLen;
    this.userReportsArr.splice(userIndex, 1);
    this.allReportsArr.splice(allIndex, 1);
  }

  //This function is used to toggle between showing all potholes including the user's pending reports
  //and just the user's pending reports
  toggleView() {
    if (!this.showUserOnly) {
      this.displayPotholeArr = this.userReportsArr;
      this.showUserOnly = true;
    } else {
      this.displayPotholeArr = this.allReportsArr;
      this.showUserOnly = false;
    }
  }

  pushToHome(): void {
    this.$router.push({ name: "home" });
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
