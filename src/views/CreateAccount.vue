<template>
  <div>
    <h2>Sign Up</h2>
    <div class="formWrapper">
      <div>
        <form>
          <label for="fname">First Name</label>
          <input class="input-box" type="text" id="fname" v-model="fname" />
          <label for="lname">Last Name</label>
          <input class="input-box" type="text" id="lname" v-model="lname" />
          <br />
          <label for="dotCheck">Are you a DOT employee?</label>
          <input type="checkbox" id="dotCheck" v-model="dotEmployee" />
          <label v-if="dotEmployee" for="dotID">DOT ID#</label>
          <input class="input-box" v-if="dotEmployee" type="text" id="dotID" v-model="dotID" />
          <br />
          <label for="phone">Phone</label>
          <input class="input-box" type="text" id="phone" v-model="phone" />
          <label for="zipcode">Zipcode</label>
          <input type="text" id="zipcode" v-model="zipcode" />
          <label for="email">Email</label>
          <input class="input-box" type="text" id="email" v-model="email" />
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" />
          <label for="retypePassword">Retype Password</label>
          <input type="password" id="retypePassword" v-model="retypePassword" />
        </form>
      </div>
      <div>
        <p class="error" v-if="inputErrors.length">
          <b>Please Correct the Following Error(s):</b>
        </p>
        <ul class="error">
          <li v-for="(error, pos) in inputErrors" :key="pos">{{ error }}</li>
        </ul>
        <button
          class="button"
          :disabled="!isValidInput"
          v-show="!accountCreated"
          @click="createAccount"
        >
          Create Account
        </button>
        <button class="button" v-if="accountCreated" @click="pushToLogin">
          Return To Login
        </button>
      </div>
      <span id="msgbox" v-show="message.length > 0">{{ message }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  getAuth,
  Auth,
  UserCredential,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import {
  collection,
  CollectionReference,
  doc,
  setDoc,
  DocumentReference,
  Firestore,
  getFirestore,
} from "firebase/firestore";
import { app } from "../firebaseConfig";
import axios, { AxiosResponse } from "axios";
import { geoPos, user } from "@/datatypes";

//Constants
const db: Firestore = getFirestore(app);
const userInfoColl: CollectionReference = collection(db, "users");

@Component
export default class SignUpView extends Vue {
  email = "";
  password = "";
  fname = "";
  lname = "";
  dotEmployee = false;
  dotID = "";
  phone = "";
  zipcode = "";
  lat = "";
  long = "";
  locality = "";
  userInfoObj!: user;
  retypePassword = "";
  inputErrors: string[] = [];
  message = "";
  userDoc!: DocumentReference;
  uid: string | undefined = "";
  accountCreated = false;
  auth: Auth | null = null;
  geoPosArr: Array<geoPos> = [];

  mounted(): void {
    this.auth = getAuth();
  }

  async createAccount() {
    //First get the user's geoPos from their zipcode
    this.getUserGeopos();

    createUserWithEmailAndPassword(this.auth!, this.email, this.password)
      .then(async (cr: UserCredential) => {
        await sendEmailVerification(cr.user);
        this.showMessage(
          "An email verification has been sent to " + cr.user.email
        );
      })
      //After the createUser function is called the verifcation email is sent
      //Then the storeUserInfo function is called and the accountCreated boolean is updated
      .then(() => {
        this.storeUserInfo();
        this.accountCreated = true;
      })
      .catch((err: any) => {
        this.showMessageWithTimeout(`Unable to create account ${err}`);
      });
  }

  //This function creates the object that will go to firestore that holds the user info
  createUserObj(): void {
    this.userInfoObj = {
      //Set the names to the proper case
      fname: this.capitalizeName(this.fname.toLowerCase()),
      lname: this.capitalizeName(this.lname.toLowerCase()),
      dotEmployee: this.dotEmployee,
      dotID: this.dotID,
      zipcode: this.zipcode,
      email: this.email,
      phone: this.phone,
      lat: this.lat,
      long: this.long,
      locality: this.locality,
    };
  }

  //Function that gets the user's lat, long, and locality from their zipcode
  async getUserGeopos() {
    await axios
      .request({
        method: "GET",
        url: "http://api.positionstack.com/v1/forward?",
        params: {
          access_key: "a5af50b77b97143132298810bdd80333",
          query: this.zipcode,
        },
      })
      .then((r: AxiosResponse) => r.data)
      .then((r: geoPos) => {
        this.lat = r.data[0].latitude.toString();
        this.long = r.data[0].longitude.toString();
        this.locality = r.data[0].locality;
      });
  }

  //This function stores the user object in firestore
  storeUserInfo(): void {
    //First create the user object and then make the doc in the users collection with the uid as the document name
    this.createUserObj();
    this.uid = this.auth?.currentUser?.uid;
    this.userDoc = doc(userInfoColl, this.uid);
    setDoc(this.userDoc, { userInfo: this.userInfoObj }).catch((err: any) => {
      console.log(`addDoc Error: ${err}`);
    });
  }

  //This function checks if the inputs are valid
  get isValidInput(): boolean {
    //First clear the inputErrors array
    this.inputErrors.splice(0);
    //checksPassed starts at 0 and is incremented by every passing check
    let checksPassed = 0;

    if (!this.checkForBlankFields) {
      checksPassed++;
    }

    if (this.matchingPasswords) {
      checksPassed++;
    }

    if (this.validEmail) {
      checksPassed++;
    }

    if (this.validPhone) {
      checksPassed++;
    }

    if (this.validZipcode) {
      checksPassed++;
    }

    //Return true if all 5 checks are passed
    return checksPassed === 5;
  }

  //This function checks for blank fields
  get checkForBlankFields(): boolean {
    //Start with 6 blank fields and decrement every time a field is filled
    let blankFields = 8;

    if (!this.fname) {
      this.inputErrors.push("First Name is Required");
    } else {
      blankFields--;
    }

    if (!this.lname) {
      this.inputErrors.push("Last Name is Required");
    } else {
      blankFields--;
    }

    if (this.dotEmployee && !this.dotID) {
      this.inputErrors.push("DOT ID# is Required");
    } else {
      blankFields--;
    }

    if (!this.phone) {
      this.inputErrors.push("Phone is Required");
    } else {
      blankFields--;
    }

    if (!this.zipcode) {
      this.inputErrors.push("Zipcode is Required");
    } else {
      blankFields--;
    }

    if (!this.email) {
      this.inputErrors.push("Email is Required");
    } else {
      blankFields--;
    }

    if (!this.password) {
      this.inputErrors.push("Password is Required");
    } else {
      blankFields--;
    }

    if (!this.retypePassword) {
      this.inputErrors.push("Please Retype Password");
    } else {
      blankFields--;
    }

    //Return false if there are any blank fields
    return blankFields !== 0;
  }

  //This function makes sure the user's passwords match
  get matchingPasswords(): boolean {
    let passed = false;
    if (this.password === this.retypePassword) {
      passed = true;
    } else {
      this.inputErrors.push("Passwords Do Not Match");
    }
    return passed;
  }

  //This function makes sure their email has an @ in it
  get validEmail(): boolean {
    let passed = false;

    if (!this.email.includes("@")) {
      this.inputErrors.push("Invalid Email");
    } else {
      passed = true;
    }
    return passed;
  }

  //This function makes sure the phone has 10 digits
  get validPhone(): boolean {
    let passed = false;

    if (this.phone.length !== 10) {
      this.inputErrors.push("Invalid Phone - Please Enter Just 10 Digits");
    } else {
      passed = true;
    }
    return passed;
  }

  //This function makes sure the zipcode has 5 digits
  get validZipcode(): boolean {
    let passed = false;

    if (this.zipcode.length !== 5) {
      this.inputErrors.push("Invalid Zipcode - Please Enter Just 5 Digits");
    } else {
      passed = true;
    }
    return passed;
  }

  //This function shows a message with a 5 second timeout
  showMessageWithTimeout(txt: string) {
    this.message = txt;

    // The message will automatically disappear after 5 seconds
    setTimeout(() => {
      this.message = "";
    }, 5000);
  }

  //This function shows a message indefinitely
  showMessage(txt: string) {
    this.message = txt;
  }

  //This function capitalizes the first letter in a name
  capitalizeName(name: string) {
    return name.replace(/\b(\w)/g, (s) => s.toUpperCase());
  }

  //This function signs the user out and redirects the user to the login screen
  pushToLogin(): void {
    signOut(this.auth!);
    this.$router.push({ name: "login" });
  }
}
</script>

<style>
.formWrapper {
  display: flex;
  flex: 1 1 0px;
  justify-content: center;
  gap: 5%;
}

form {
  margin-bottom: 2em;
}

label {
  margin: 2em;
}
input {
  display: block;
  width: 400px;
  border-radius: 5px;
  border: none;
  padding: 5px;
  margin-top: 5px;
  padding-right: 0;
  padding-left: 0;
  border: 2px solid #699ead;
  transition: all 0.2s;
  margin-bottom: 2em;
}

.button {
  width: 130px;
  color: #699ead;
  font-size: 15px;
  font-weight: bold;
    border: 2px solid #699ead;
  padding: 5px;
  border-radius: 10px;
  padding-right: 0;
  transition: all 0.4s;
}

.button:hover {
  transform: scale(1.2);
}

.error {
  color: firebrick;
}

li {
  /*list-style: ;*/
  margin-bottom: 10px;
}

ul.error {
  text-align: left;
}

.input-box {
  width: 100%;
}
</style>
