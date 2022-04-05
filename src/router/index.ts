import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Map from "../components/Map.vue";
import HomeView from "../views/HomeView.vue";
Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/map",
    name: "map",
    component: Map,
  },
  {
    path: "/",
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
