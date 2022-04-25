import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginScreen from "../views/LoginScreen.vue";
import CreateAccount from "../views/CreateAccount.vue";
import Report from "../views/Report.vue";
import Account from "../views/AccountView.vue";
import DotReview from "../views/DotReview.vue";

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
    component: CreateAccount,
  },
  {
    path: "/account",
    name: "account",
    component: Account,
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
  },
  {
    path: "/report",
    name: "report",
    component: Report,
  },
  {
    path: "/dot/review",
    name: "review",
    component: DotReview,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
