import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import SmartTable from "vuejs-smart-table";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";

Vue.use(SmartTable);

Vue.config.productionTip = false;

const app = initializeApp(firebaseConfig);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
