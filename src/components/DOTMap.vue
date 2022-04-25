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
          <VTh sortKey="pothole.dateCreated">Date Reported</VTh>
          <VTh sortKey="pothole.creatorName">Reported By</VTh>
          <th>Lat</th>
          <th>Lng</th>
          <th>Image</th>
        </template>
        <template #body="{ rows }">
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.pothole.dateCreated }}</td>
            <td>{{ row.pothole.creatorName }}</td>
            <td>{{ row.pothole.coordinates.lat.slice(0, 8) }}</td>
            <td>{{ row.pothole.coordinates.lng.slice(0, 9) }}</td>
            <td>
              <a :href="row.pothole.image" target="_blank">
                <img :src="row.pothole.image" width="10%" height="10%" />
              </a>
            </td>
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
import { Vue, Component, Prop } from "vue-property-decorator";
import { LMap, LTileLayer, LMarker, LIcon, LCircleMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
import { Pothole, PotholeContainer, user } from "../datatypes";
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
import {
  getAuth,
  onAuthStateChanged,
  User,
  Auth,
  signOut,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";

const db: Firestore = getFirestore(app);
const potholeCollection: CollectionReference = collection(db, "potholes");
const userInfoColl: CollectionReference = collection(db, "users");
const allReportsDoc: DocumentReference = doc(potholeCollection, "allReports");

@Component({ components: { LMap, LTileLayer, LMarker, LIcon, LCircleMarker } })
export default class DOTMap extends Vue {
  auth: Auth | null = null;
  uid: string | undefined = "";
  userDoc!: DocumentReference;
  userInfoObj!: user;
  mapCenter: Array<number> = [42.963, -85.668];
  geoPos: { lat?: number; lng?: number } = {};
  coneIcon = "https://ik.imagekit.io/carharv/coneIcon";
  allReportsArr: Array<Pothole> = [];
  displayArr: Array<Pothole> = [];
  potholeContainerArr: Array<PotholeContainer> = [];
  mapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  testVar = "";
  mapAttribution =
    "&copy; <a target='_blank' href='http://osm.org/copyright'>OpenStreetMap</a>";

  mounted() {
    this.auth = getAuth();
    this.uid = this.auth?.currentUser?.uid;
    this.userDoc = doc(userInfoColl, this.uid);

    this.getUserInfo();

    this.getPotholes();
  }

  //This function retrieves all unfilled potholes and listens for updates
  getPotholes() {
    onSnapshot(allReportsDoc, (reports: DocumentSnapshot) => {
      if (reports.exists()) {
        this.allReportsArr = reports.data().potholeArray;
        //Clear the displayArr and potholeContainerArr when the data is updated
        this.displayArr.splice(0);
        this.potholeContainerArr.splice(0);

        //Loop through the allReportsArr to find unfilled potholes
        for (let index in this.allReportsArr) {
          if (this.allReportsArr[index].filled !== "Filled") {
            //If the pothole is unfilled then psuh it to the displayArr and also
            //Push it to the potholeContainerArr to store the pothole's original index
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

  //This function is used to resolve a pothole report
  resolvePothole(index: string) {
    let indexNum = parseInt(index);

    //Update the pothole status to filled and remove it from the displayArr
    this.allReportsArr[indexNum].filled = "Filled";
    this.allReportsArr[indexNum].dateRemoved = Date().slice(0, 25);
    this.allReportsArr[indexNum].deletorEmpID = this.userInfoObj.dotID;
    this.displayArr.splice(indexNum, 1);

    //Save the array to firestore
    this.saveArray();
  }

  //This function simply saves the allReportsArr to firestore
  saveArray() {
    setDoc(allReportsDoc, { potholeArray: this.allReportsArr });
  }

  getUserInfo() {
    getDoc(this.userDoc).then((userData: DocumentSnapshot) => {
      if (userData.exists()) {
        this.userInfoObj = userData.data().userInfo;
        this.mapCenter = [
          parseFloat(this.userInfoObj.lat),
          parseFloat(this.userInfoObj.long),
        ];
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
