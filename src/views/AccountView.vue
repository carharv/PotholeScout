<template>
  <div>
    <h1 v-show="userInfoLoaded">Welcome, {{ userInfoObj.fname }}</h1>
    <h2 v-if="userInfoObj.dotEmployee">
      DOT Employee ID# {{ userInfoObj.dotID }}
    </h2>
    <span id="msgbox" v-show="message.length > 0">{{ message }}</span>
    <div id="accountTabs">
      <b-tabs pills justified align="center">
        <b-tab title="Profile" active>
          <b-card-text>
            <div class="tab">
              <h3>Update your profile and then click Save</h3>
              <label for="fname">First Name</label>
              <input type="text" id="fname" v-model.lazy="userInfoObj.fname" />
              <label for="lname">Last Name</label>
              <input type="text" id="lname" v-model="userInfoObj.lname" />
              <label for="phone">Phone</label>
              <input type="text" id="phone" v-model="userInfoObj.phone" />
              <label for="zipcode">Zipcode</label>
              <input type="text" id="zipcode" v-model="userInfoObj.zipcode" />
              <label for="email">Email</label>
              <input type="text" id="email" v-model="userInfoObj.email" />
              <button @click="storeUserInfo">Save</button>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab title="Settings">
          <b-card-text>
            <div class="tab">
              <button @click="resetPassword">Reset Password</button>
              <button @click="signOut">Sign Out</button>
              <button @click="deleteAcct">Delete Account</button>
            </div>
          </b-card-text>
        </b-tab>
        <b-tab title="My Reports"
          ><b-card-text>
            <VTable :data="userReportArr">
              <template #head>
                <tr>
                  <VTh sortKey="filled">Status</VTh>
                  <VTh sortKey="dateCreated">Date Reported</VTh>
                  <VTh sortKey="dateRemoved">Date Filled</VTh>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Image</th>
                </tr>
              </template>
              <template #body="{ rows }">
                <tr v-for="row in rows" :key="row.id">
                  <td>{{ row.filled }}</td>
                  <td>{{ row.dateCreated }}</td>
                  <td>{{ row.dateRemoved }}</td>
                  <td>{{ row.coordinates.lat.slice(0, 6) }}</td>
                  <td>{{ row.coordinates.lng.slice(0, 6) }}</td>
                  <td>
                    <a :href="row.image" target="_blank">
                      <img :src="row.image" width="50%" height="50%" />
                    </a>
                  </td>
                </tr>
              </template>
            </VTable> </b-card-text
        ></b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { BTab, BTabs } from "bootstrap-vue";
import { app } from "../firebaseConfig";
import { user, Pothole } from "@/datatypes";
import {
  getAuth,
  Auth,
  signOut,
  deleteUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  Firestore,
  DocumentSnapshot,
  getDoc,
  getFirestore,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

//Constants
const db: Firestore = getFirestore(app);
const userInfoColl: CollectionReference = collection(db, "users");
const potholeCollection: CollectionReference = collection(db, "potholes");
const allReportsDoc: DocumentReference = doc(potholeCollection, "allReports");

@Component({ components: { BTab, BTabs } })
export default class AccountView extends Vue {
  testVar = "This is from the testVar";
  uid: string | undefined = "";
  userDoc!: DocumentReference;
  auth: Auth | null = null;
  userInfoObj: user = {
    fname: "",
    lname: "",
    dotEmployee: false,
    dotID: "",
    email: "",
    phone: "",
    zipcode: "",
    lat: "42.93066",
    long: "-85.655173",
    locality: "",
  };
  userReportArr: Array<Pothole> = [];
  message = "";
  userInfoLoaded = false;

  mounted() {
    this.auth = getAuth();
    this.uid = this.auth?.currentUser?.uid;
    this.userDoc = doc(userInfoColl, this.uid);

    this.getUserInfo();
    this.getPotholes();
  }

  //This function listens for updates
  getPotholes(): void {
    onSnapshot(allReportsDoc, (reports: DocumentSnapshot) => {
      if (reports.exists()) {
        for (let report of reports.data().potholeArray) {
          if (report.creatorUID === this.uid) {
            this.userReportArr.push(report);
          }
        }
        console.log("Pothole Array has been updated");
      }
    });
  }

  getUserInfo() {
    getDoc(this.userDoc).then((userData: DocumentSnapshot) => {
      if (userData.exists()) {
        this.userInfoObj = userData.data().userInfo;
      }
    });
    this.userInfoLoaded = true;
  }

  //This function stores the user object in firestore
  storeUserInfo(): void {
    setDoc(this.userDoc, { userInfo: this.userInfoObj })
      .then(() => {
        this.showMessage(`Your profile has been updated.`);
      })
      .catch((err: any) => {
        console.log(`addDoc Error: ${err}`);
      });
  }

  resetPassword() {
    console.log("Sening password reset");
    sendPasswordResetEmail(this.auth!, this.userInfoObj.email)
      .then(() => {
        this.showMessage(
          `A password reset link has been sent to ${this.userInfoObj.email}`
        );
      })
      .catch((err: any) => {
        this.showMessage("Unable to reset password ${err}");
      });
  }

  //Function to sign user out
  signOut(): void {
    if (this.auth) signOut(this.auth);

    // Back to login page
    this.$router.push({ name: "login" });
  }

  //Function to delete a user account and their data
  deleteAcct(): void {
    var dltUser = this.auth!.currentUser;
    if (dltUser) {
      deleteDoc(this.userDoc);
      deleteUser(dltUser);
      // Back to login page
      this.$router.push({ name: "login" });
    }
  }

  showMessage(txt: string) {
    this.message = txt;

    // The message will automatically disappear after 5 seconds
    setTimeout(() => {
      this.message = "";
    }, 5000);
  }
}
</script>

<style>
.tab {
  width: 50em;
}

#accountTabs {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

table {
  margin-top: 8px;
  margin: auto;
}

table tr > td {
  padding: 0.5em;
}

table th {
  padding: 1em;
}
</style>
