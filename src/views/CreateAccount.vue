<template>
  <div>
    <div class="formWrapper">
      <h2>Sign Up</h2>
      <label for="fname">First Name</label>
      <input type="text" id="fname" v-model="fname" />
      <label for="lname">Last Name</label>
      <input type="text" id="lname" v-model="lname" />
      <label for="phone">Phone</label>
      <input type="text" id="phone" v-model="phone" />
      <label for="zipcode">Zipcode</label>
      <input type="text" id="zipcode" v-model="zipcode" />
      <label for="email">Email</label>
      <input type="text" id="email" v-model="email" />
      <label for="password">Password</label>
      <input type="text" id="password" v-model="password" />
      <label for="retypePassword">Retype Password</label>
      <input type="text" id="retypePassword" v-model="retypePassword" />
      <button
        :disabled="!isValidInput"
        v-show="!accountCreated"
        @click="createAccount"
      >
        Create Account
      </button>
      <button v-show="accountCreated" @click="pushToLogin">
        Return To Login
      </button>
      <p v-if="inputErrors.length">
        <b>Please Correct the Following Error(s):</b>
      </p>
      <ul>
        <li v-for="(error, pos) in inputErrors" :key="pos">{{ error }}</li>
      </ul>
    </div>
    <span id="msgbox" v-show="message.length > 0">{{ message }}</span>
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
  addDoc,
  DocumentReference,
  Firestore,
  getFirestore,
} from "firebase/firestore";
import { app } from "../firebaseConfig";

type user = {
  fname: string;
  lname: string;
  email: string;
  phone: string;
  zipcode: string;
};

//Constants
const db: Firestore = getFirestore(app);
const userInfoColl: CollectionReference = collection(db, "users");

@Component
export default class SignUpView extends Vue {
  email = "";
  password = "";
  fname = "";
  lname = "";
  phone = "";
  zipcode = "";
  userInfoObj!: user;
  retypePassword = "";
  inputErrors: string[] = [];
  message = "";
  userDoc!: DocumentReference;
  uid: string | undefined = "";
  accountCreated = false;
  auth: Auth | null = null;

  mounted(): void {
    this.auth = getAuth();
  }

  createAccount(): void {
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
      zipcode: this.zipcode,
      email: this.email,
      phone: this.phone,
    };
  }

  //This function stores the user object in firestore
  storeUserInfo(): void {
    //First create the user object and then make the doc in the users collection with the uid as the document name
    this.createUserObj();
    this.uid = this.auth?.currentUser?.uid;
    this.userDoc = doc(userInfoColl, this.uid);
    addDoc(userInfoColl, { userInfo: this.userInfoObj }).catch((err: any) => {
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
    let blankFields = 7;

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

<style></style>
