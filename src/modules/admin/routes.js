import AppLayout from "../../components/AppLayout";
import Admin from "./views/Admin";
import Auth from "@/router/middleware/Auth";

export default [
  {
    path: "/events",
    component: AppLayout,
    children: [
      {
        path: "admin",
        name: "Admin",
        components: {
          view: Admin,
        },
        // meta: { middleware: [Auth], breadcrumb: "Dashboard" },
      },
    ],
  },
];