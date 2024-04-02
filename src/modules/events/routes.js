import Events from "./views/Events";
import AppLayout from "../../components/AppLayout";
import EventView from "./components/EventView";
import Booking from "./components/Booking/Booking";
import Billing from "./components/Billing";
import Invoice from "./components/Invoice";
import Receipt from "./components/Receipt";
import DelegateCard from "./components/Booking/DelegateCard";
import Auth from "@/router/middleware/Auth";
import Login from "@/modules/auth/views/Login";
import Signup from "@/modules/auth/views/Signup";
import BookingList from "./components/Booking/BookingList";
import Admin from "../admin/views/Admin.vue";
import CreateEvent from "./views/CreateEvent.vue";
// import AdminMiddleware from "@/router/middleware/AdminMiddleware";

export default [
  {
    path: "/events",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "EventList",
        components: {
          view: Events,
        },
      },
      {
        path: "admin",
        name: "Admin",
        components: {
          view: Admin,
        },
      },
      {
        path: ":no",
        name: "EventCard",
        components: {
          view: EventView,
        },
      },
      {
        path: ":no/login",
        name: "Login",
        components: {
          view: EventView,
          action: Login,
        },
      },
      {
        path: ":no/Signup",
        name: "Signup",
        components: {
          view: EventView,
          action: Signup,
        },
      },
      {
        path: "booking/:no",
        name: "booking",
        components: {
          view: Booking,
        },
        meta: { middleware: [Auth] },
      },
      {
        path: "delegate-card/:no/:id?",
        name: "DelegateCard",
        components: {
          view: Booking,
          action: DelegateCard,
        },
        meta: { middleware: [Auth] },
      },
      {
        path: "billing/:bookingNo",
        name: "billing",
        components: {
          view: Billing,
        },
        meta: { middleware: [Auth] },
      },
      {
        path: "invoice/:bookingNo/:posted?",
        name: "invoice",
        components: {
          view: Invoice,
        },
        meta: { middleware: [Auth] },
      },
      {
        path: "receipt/:receiptNo",
        name: "receipt",
        components: {
          view: Receipt,
        },
        meta: { middleware: [Auth] },
      },
      {
        path: "booking-view/:bookingNo",
        name: "BookingView",
        components: {
          view: Booking,
        },
        meta: { middleware: [Auth] },
      },
      {
        path: "/previous-bookings",
        name: "BookingList",
        components: {
          view: BookingList,
        },
        meta: { middleware: [Auth] },
      },
      {
        path: "new",
        name: "CreateEvent",
        components: {
          view: CreateEvent,
        },
        meta: { middleware: [Auth] },
      }
    ],
  },
];
