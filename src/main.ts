//Imports
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import SmartTable from "vuejs-smart-table";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "leaflet/dist/leaflet.css";

//Use
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(SmartTable);

Vue.config.productionTip = false;
const app = initializeApp(firebaseConfig);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
