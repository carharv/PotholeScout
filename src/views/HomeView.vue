<template>
  <div>
    <div id="text">
      <h1>Visualizations</h1>
      <h5>
        Below you will find the data from all reports represented on a heatmap
        and on a graph.
      </h5>
      <br />
    </div>
    <DisplayMap :mapCenter="mapCenter" />
    <br />
    <Graph v-bind:chartData="chartData" :key="childKey" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import DisplayMap from "../components/DisplayMap.vue";
import Graph from "../components/Graph.vue";
import { getAuth, Auth } from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  DocumentSnapshot,
  getDoc,
  getFirestore,
} from "firebase/firestore";
import { app } from "../firebaseConfig";

//Constants
const db: Firestore = getFirestore(app);
const userInfoColl: CollectionReference = collection(db, "users");
const allReports: DocumentReference = doc(db, "potholes", "allReports");

@Component({ components: { DisplayMap, Graph } })
export default class HomeView extends Vue {
  uid: string | undefined = "";
  userDoc!: DocumentReference;
  auth: Auth | null = null;
  childKey = 0;
  numReported = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  totalDays = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  mapCenter: Array<number> = [42.963, -85.668];
  chartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Average # of days to fix pothole",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };
  mounted() {
    this.auth = getAuth();
    this.uid = this.auth?.currentUser?.uid;
    this.userDoc = doc(userInfoColl, this.uid);
    this.getUserInfo();
  }

  beforeMount() {
    this.fillGraph();
  }

  // Function to fill the graph
  fillGraph() {
    getDoc(allReports).then((userData) => {
      if (userData.exists()) {
        var potholes = userData.data().potholeArray;
        for (let p of potholes) {
          if (p.dateRemoved) {
            const dateCreated = new Date(p.dateCreated);
            const dateRemoved = new Date(p.dateRemoved);
            // Get the days between the two dates
            const daysTook = Math.round(
              (dateRemoved.getTime() - dateCreated.getTime()) /
                (1000 * 60 * 60 * 24)
            );
            // Update number of potholes fixed for the month
            this.numReported[dateCreated.getMonth()]++;
            // Updated total amount of days taken to fix pothole for a month
            this.totalDays[dateCreated.getMonth()] += daysTook;
            // Updated main chart data to be average amount of days to fix a pothole
            this.chartData.datasets[0].data[dateCreated.getMonth()] =
              this.totalDays[dateCreated.getMonth()] /
              this.numReported[dateCreated.getMonth()];
          }
        }
        // Refresh child component
        this.childKey += 1;
      }
    });
  }

  getUserInfo() {
    getDoc(this.userDoc).then((userData: DocumentSnapshot) => {
      if (userData.exists()) {
        this.mapCenter = [
          parseFloat(userData.data().userInfo.lat),
          parseFloat(userData.data().userInfo.long),
        ];
      }
    });
  }
}
</script>

<style>
#text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h2 {
  padding-top: 50px;
}
</style>
