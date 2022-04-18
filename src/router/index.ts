import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Map from "../components/Map.vue";
import HomeView from "../views/HomeView.vue";
import LoginScreen from "../components/LoginScreen.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/home",
    name: "home",
    component: HomeView,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
