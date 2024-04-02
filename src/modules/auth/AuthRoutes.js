import Login from "./views/Login";
import AppLayout from "@/components/AppLayout";
import Signup from "./views/Signup.vue"

export default [
  {
    path: "/events",
    component: AppLayout,
    children: [
      {
        path: ":no/login",
        name: "Login",
        component: Login,
      },
      {
        path: ":no/signup",
        name: "Signup",
        component: Signup,
      },
    ],
  },
];
