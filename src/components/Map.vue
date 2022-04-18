<template>
  <div>
    <nav>
      <router-link to="/home">Home</router-link>
      <router-link to="/map">Map</router-link>
    </nav>
    <h1>This is from Map.vue Component</h1>

    <div id="map">
      <h3>Map editable with click? {{ canEditMap }}</h3>
      <h4>Heatmap View</h4>
      <LMap style="height: 500px; width: 800px" :zoom="13" :center="mapCenter">
        <LTileLayer :url="mapUrl" :attribution="mapAttribution"></LTileLayer>
        <LCircleMarker
          v-for="pothole in potholeArrAll"
          :key="pothole.id"
          :lat-lng="pothole.coordinates"
          :fillOpacity="0.5"
          :fillColor="`#ffa500`"
          :color="`#ffa500`"
          :radius="100"
        >
          <LIcon iconUrl="../assets/coneIcon.png"> </LIcon
        ></LCircleMarker>
      </LMap>
      <h4>Single Point View</h4>
      <LMap
        style="height: 500px; width: 800px"
        :zoom="13"
        :center="mapCenter"
        @click="onMapClicked"
      >
        <LTileLayer :url="mapUrl" :attribution="mapAttribution"></LTileLayer>
        <LMarker
          v-for="pothole in potholeArrAll"
          :key="pothole.id"
          :lat-lng="pothole.coordinates"
        >
          <LIcon
            iconUrl="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fpaomedia%2Fsmall-n-flat%2F1024%2Fcone-icon.png&f=1&nofb=1"
          >
          </LIcon
        ></LMarker>
      </LMap>
    </div>
    <button @click="saveCoords">Save Locations</button>
    <div id="tableDiv" v-show="potholeArr[0]">
      <h2>Reported Coordinates</h2>
      <VTable :data="potholeArr">
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
import { Vue, Component } from "vue-property-decorator";
import { LMap, LTileLayer, LMarker, LIcon, LCircleMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
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
import {
  getAuth,
  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";

const db: Firestore = getFirestore(app);
const userCollection: CollectionReference = collection(db,"Users")

type Coordinate = {
  lat: string;
  lng: string;
};

type Pothole = {
  creatorUID: string;
  deletorUID?: string;
  dateCreated?: string;
  dateRemoved?: Date;
  coordinates: Coordinate;
};

@Component({ components: { LMap, LTileLayer, LMarker, LIcon, LCircleMarker } })
export default class Map extends Vue {
  geoPos: { lat?: number; lng?: number } = {};
  coneIcon =
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ficons.iconarchive.com%2Ficons%2Fpaomedia%2Fsmall-n-flat%2F1024%2Fcone-icon.png&f=1&nofb=1";
  potholeArr: Array<Pothole> = [];
  potholeArrAll: Array<Pothole> = [];
  mapCenter = [42.963, -85.668];
  mapUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  mapAttribution =
    "&copy; <a target='_blank' href='http://osm.org/copyright'>OpenStreetMap</a>";
  canEditMap = true;

  onMapClicked(e: any): void {
    if (this.canEditMap) {
      this.addCoords(e.latlng);
    }
  }

  async mounted(): Promise<void> {
    const auth = getAuth();
    const user = auth.currentUser;
      if (user && auth.currentUser != null) {

        const q = query(collection(db, "Users"));

        // pushes all potholes into an array
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          this.potholeArrAll.push(doc.data().potholeArray);
        });

        const uid = auth.currentUser.uid;

        // Use filesystem syntax for document path
        const uid_doc : DocumentReference = doc(userCollection, uid);

        // Pushes only personal potholes into array
        const current = doc(db, "Users", uid);
        getDoc(current).then((userSnapshot: DocumentSnapshot) => {
          if (userSnapshot.exists()){
            this.potholeArr = userSnapshot.data().potholeArray;
          }
        });
        
      }
    
  }

  /* removeMarker(index: number) {
    this.markersArr.splice(index, 1);
  } */

  addCoords(geoPos: { lat: number; lng: number }): void {
    // When the user pans the map left/right the longitude
    // angle can be out of the [-180,+180] range
    while (geoPos.lng > 180) geoPos.lng -= 360;
    while (geoPos.lng < -180) geoPos.lng += 360;
    this.geoPos = { ...geoPos };
    // this is to keep a seperate list of personal potholes.
    this.potholeArr.push({
      creatorUID: "testUID",
      dateCreated: Date(),
      coordinates: {
        lng: this.geoPos.lng!.toString(),
        lat: this.geoPos.lat!.toString(),
      },
    });
    // This is to show a coords on map.
    this.potholeArrAll.push({
      creatorUID: "testUID",
      dateCreated: Date(),
      coordinates: {
        lng: this.geoPos.lng!.toString(),
        lat: this.geoPos.lat!.toString(),
      },
    });
  }

  saveCoords() :void {
    const auth = getAuth();
    const user = auth.currentUser;
      if (user && auth.currentUser != null) {
        const userInfo = `${user.displayName}`;
        const uid = auth.currentUser.uid;

        // Use filesystem syntax for document path
        const uid_doc : DocumentReference = doc(userCollection, uid);
        // Add a new document with our own id
        setDoc(uid_doc, {
          userName: userInfo,
          userID:uid,
          potholeArray: this.potholeArr,
        });
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
