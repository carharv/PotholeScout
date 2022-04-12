import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Map from "../components/Map.vue";
import HomeView from "../views/HomeView.vue";
import LoginScreen from "../views/LoginScreen.vue";
import SignUpView from "../views/SignUpView.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "login",
    component: LoginScreen,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
  },
  {
    path: "/map",
    name: "map",
    component: Map,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
