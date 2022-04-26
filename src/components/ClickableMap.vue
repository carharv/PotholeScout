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
    <div id="buttons">
      <button @click="submitReport">Submit Report</button>
      <button @click="toggleView">Toggle All Reports</button>
    </div>
    <div id="reportDiv" v-show="userTableArr[0]">
      <h2>My Pending Report</h2>
      <VTable :data="userTableArr">
        <template #head>
          <th>Date</th>
          <th>Lat</th>
          <th>Lng</th>
          <th>Image</th>
        </template>
        <template #body="{ rows }">
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.pothole.dateCreated }}</td>
            <td>{{ row.pothole.coordinates.lat.slice(0, 8) }}</td>
            <td>{{ row.pothole.coordinates.lng.slice(0, 8) }}</td>
            <td id="imageTD">
              <a :href="row.pothole.image" target="_blank">
                <img :src="row.pothole.image" />
              </a>
              <input
                type="file"
                ref="file"
                accept="image/png, image/jpeg"
                @change="addImage(row, $event.target.files[0])"
              />
            </td>
            <td><button @click="removeReport(row)">Remove</button></td>
            <image id="img"></image>
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
import { Pothole, PotholeContainer, ReportContainer } from "../datatypes";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  setDoc,
  DocumentSnapshot,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../firebaseConfig";

const db: Firestore = getFirestore(app);
const potholeCollection: CollectionReference = collection(db, "potholes");
const userInfoColl: CollectionReference = collection(db, "users");
const allReportsDoc: DocumentReference = doc(potholeCollection, "allReports");
const storage = getStorage();

@Component({ components: { LMap, LTileLayer, LMarker, LIcon, LCircleMarker } })
export default class ClickableMap extends Vue {
  //Pothole data variables
  displayPotholeArr: Array<Pothole> = [];
  userTableArr: Array<ReportContainer> = [];
  reportContainerArr: Array<ReportContainer> = [];
  allReports: any;
  showUserOnly = false;
  loadingUrl = "https://ik.imagekit.io/carharv/loadingGif.gif";

  //Firebase user variables
  uid = "";
  auth: Auth | null = null;
  userDoc!: DocumentReference;
  uidName = "";

  //Map variables
  mapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  mapAttribution =
    "&copy; <a target='_blank' href='http://osm.org/copyright'>OpenStreetMap</a>";
  mapCenter = [42.963, -85.668];
  geoPos: { lat?: number; lng?: number } = {};
  coneIcon = "https://ik.imagekit.io/carharv/coneIcon";
  potImage =
    "https://upload.wikimedia.org/wikipedia/commons/4/48/BLANK_ICON.png";

  mounted(): void {
    //Get auth and uid
    this.auth = getAuth();
    this.uid = this.auth?.currentUser!.uid;
    this.userDoc = doc(userInfoColl, this.uid);

    //Get the user's name so that it can be attached to the report
    this.getUserInfo();

    //Call the getPotholes function to load existing potholes and listen for updates
    this.getPotholes();
  }

  //This function gets the user's info so that the map can be centered to their location
  getUserInfo() {
    getDoc(this.userDoc).then((userData: DocumentSnapshot) => {
      if (userData.exists()) {
        this.uidName =
          userData.data().userInfo.fname + " " + userData.data().userInfo.lname;
        this.mapCenter = [
          parseFloat(userData.data().userInfo.lat),
          parseFloat(userData.data().userInfo.long),
        ];
      }
    });
  }

  //Function to load all potholes and listen for updates
  getPotholes(): void {
    onSnapshot(allReportsDoc, (data: DocumentSnapshot) => {
      if (data.exists()) {
        //First hold data in this variable
        this.allReports = data.data();

        //Loop through each report in the new allReports array
        //Then sort the data. Unfilled potholes are assigned the type "old" and filled potholes are assigned "filled"
        //Once they have been typed, push all reports into the reportContainerArr
        for (let report of this.allReports.potholeArray) {
          if (report.filled !== "Filled") {
            this.reportContainerArr.push({
              pothole: report,
              type: "old",
            });
          } else {
            this.reportContainerArr.push({ pothole: report, type: "filled" });
          }
        }

        //Create the display array and the user reports array
        this.createArrays();
      }
    });
  }

  //Create the array of potholes to be displayed
  createDisplayArr() {
    //First clear the array
    this.displayPotholeArr.splice(0);

    //If the user only wants to see their pending reports
    if (this.showUserOnly) {
      for (let report of this.reportContainerArr) {
        //Only push potholes that are typed "new" to the display array
        if (report.type === "new") {
          this.displayPotholeArr.push(report.pothole);
        }
      }
    } else if (!this.showUserOnly) {
      //If the user wants to see all unfilled reports
      //Push both old unfilled potholes and new pending potholes to the display array
      for (let report of this.reportContainerArr) {
        if (report.type === "old") {
          this.displayPotholeArr.push(report.pothole);
        } else if (report.type === "new") {
          this.displayPotholeArr.push(report.pothole);
        }
      }
    }
  }

  //Crate the array that will be used in the pending report table
  createUserTableArr() {
    //First clear the array
    this.userTableArr.splice(0);

    //Then push just the new pending reports to the array
    for (let report of this.reportContainerArr) {
      if (report.type === "new") {
        this.userTableArr.push(report);
      }
    }
  }

  //Call both create functions
  createArrays() {
    this.createDisplayArr();
    this.createUserTableArr();
  }

  //This function creates a new user report
  newUserReport(geoPos: { lat: number; lng: number }): void {
    // When the user pans the map left/right the longitude
    // angle can be out of the [-180,+180] range
    while (geoPos.lng > 180) geoPos.lng -= 360;
    while (geoPos.lng < -180) geoPos.lng += 360;
    this.geoPos = { ...geoPos };

    //First push the report to the reportContainerArr
    this.reportContainerArr.push({
      pothole: {
        creatorUID: this.uid,
        dateCreated: Date().slice(0, 25),
        coordinates: {
          lng: this.geoPos.lng!.toString(),
          lat: this.geoPos.lat!.toString(),
        },
        filled: "Not Filled",
        creatorName: this.uidName,
        image: this.potImage,
      },
      //It is typed as "new"
      type: "new",
    });

    //After a new pothole is added refresh the arrays
    this.createArrays();
  }

  //This function is called when a user clicks on the map and triggers a new report
  onMapClicked(e: any): void {
    this.newUserReport(e.latlng);
  }

  //This function saves all reports to firestore
  submitReport(): void {
    let allReports: Array<Pothole> = [];

    for (let report of this.reportContainerArr) {
      allReports.push(report.pothole);
    }

    setDoc(allReportsDoc, { potholeArray: allReports });

    this.pushToHome();
  }

  //This function is used to remove a user's report before they submit it
  removeReport(row: ReportContainer): void {
    //First get the index to remove
    let removalIndex = this.reportContainerArr.indexOf(row);
    //Remove it
    this.reportContainerArr.splice(removalIndex, 1);
    //Refresh arrays
    this.createArrays();
  }

  //This function uploads an image to firebase storage and returns the url
  addImage(row: ReportContainer, file: File): void {
    //Create the firestore path with the hash from the image blob url
    let uploadLocation: string =
      "images/" + URL.createObjectURL(file).toString().slice(27);
    let storageRef = ref(storage, uploadLocation);
    let uploadURL: string;
    let reportIndex = this.reportContainerArr.indexOf(row);

    //While uploading show hte loading gif
    this.reportContainerArr[reportIndex].pothole.image = this.loadingUrl;
    //Upload the image to firebase storage
    uploadBytes(storageRef, file).then(() => {
      //Get the download url using the storage ref we just made
      getDownloadURL(storageRef)
        .then((url) => (uploadURL = url))
        .then(() => {
          //Add the url to the pothole object
          this.reportContainerArr[reportIndex].pothole.image = uploadURL;
        })
        //Finally refresh the arrays
        .finally(() => this.createArrays());
    });
  }

  //This function is used to toggle between showing all potholes including the user's pending reports
  //and just the user's pending reports
  toggleView() {
    if (!this.showUserOnly) {
      this.showUserOnly = true;
    } else {
      this.showUserOnly = false;
    }
    //Only need to make a new display array
    this.createDisplayArr();
  }

  pushToHome(): void {
    this.$router.push({ name: "home" });
  }
}
</script>

<style>
#buttons {
  flex-direction: initial;
  white-space: nowrap;
}

#map {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#imageTD {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#reportDiv {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 2em;
}

table th {
  white-space: nowrap;
}

table {
  margin-top: 8px;
  margin: auto;
}

table tr:nth-child(odd) {
  background-color: #697cad;
}

table tr:nth-child(even) {
  background-color: #699ead;
}

table td {
  border: 0.01em solid;
}

table tr > td {
  padding: 0.5em;
}
</style>
