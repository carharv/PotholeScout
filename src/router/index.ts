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
    meta: {
      title: "Login - Pothole Scout",
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: CreateAccount,
    meta: {
      title: "Signup - Pothole Scout",
    },
  },
  {
    path: "/account",
    name: "account",
    component: Account,
    meta: {
      title: "Account - Pothole Scout",
    },
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
    meta: {
      title: "Home - Pothole Scout",
    },
  },
  {
    path: "/report",
    name: "report",
    component: Report,
    meta: {
      title: "Report - Pothole Scout",
    },
  },
  {
    path: "/dot/review",
    name: "review",
    component: DotReview,
    meta: {
      title: "Review - Pothole Scout",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

//Code from this tutorial
//https://www.digitalocean.com/community/tutorials/vuejs-vue-router-modify-head
// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title;
  } else if (previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title;
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
    (el) => el.parentNode?.removeChild(el)
  );

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map((tagDef: any) => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create so we don't interfere with other ones.
      tag.setAttribute("data-vue-router-controlled", "");

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach((tag: any) => document.head.appendChild(tag));

  next();
});

export default router;
