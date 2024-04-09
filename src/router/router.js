import Vue from "vue";
import VueRouter from "vue-router";
// import nextFactory from "./middleware/MiddlewareFactory";
import AppFallback from "../components/AppFallback";
import NProgress from "nprogress";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/events",
  },
  {
    path: "*",
    component: AppFallback,
  },
];
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
// router.beforeEach((to, from, next) => {
//   if (to.meta.middleware) {
//     NProgress.start();
//     NProgress.set(0.1);
//     NProgress.inc(0.2);
//     const middleware = Array.isArray(to.meta.middleware)
//       ? to.meta.middleware
//       : [to.meta.middleware];

//     const context = {
//       from,
//       next,
//       router,
//     };
//     const nextMiddleware = nextFactory(context, middleware, 1);
//     return middleware[0]({ ...context, next: nextMiddleware });
//   }
//   return next();
// });

router.afterEach(() => {
  // Complete the animation of the route progress bar.
  setTimeout(() => {
    NProgress.done();
  }, 2000);
});
export default router;
