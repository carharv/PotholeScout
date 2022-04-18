import Vue from "vue";
import App from "./App.vue";
import router from "./router";
const app = initializeApp(firebaseConfig);
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebaseConfig";

Vue.use(SmartTable);

Vue.config.productionTip = false;

const app = initializeApp(firebaseConfig);
export default app;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
