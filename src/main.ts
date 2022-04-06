import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import SmartTable from "vuejs-smart-table";

Vue.use(SmartTable);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
