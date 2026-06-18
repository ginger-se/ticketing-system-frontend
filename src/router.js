import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/admin/shows",
      name: "adminShows",
      component: () => import("./views/AdminShows.vue"),
    },
    {
      path: "/admin/events",
      name: "adminEvents",
      component: () => import("./views/AdminEvents.vue"),
    },
    {
      path: "/admin/seats",
      name: "adminSeats",
      component: () => import("./views/AdminSeats.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("./views/Home.vue"),
    },
    {
      path: "/shows",
      name: "shows",
      component: () => import("./views/ShowList.vue"),
    },
    {
      path: "/shows/:id/events",
      name: "eventList",
      component: () => import("./views/EventList.vue"),
    },
    {
      path: "/events",
      name: "events",
      component: () => import("./views/AllEvents.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("./views/Ticket.vue"),
    },
    {
      path: "/admin/dashboard",
      name: "adminDashboard",
      component: () => import("./views/AdminDashboard.vue"),
    },
    {
      path: "/shows/:id/events/seatmap",
      name: "seatmap",
      component: () => import("./views/SeatMap.vue"),
    },
    {
      path: "/admin/reports",
      name: "adminReports",
      component: () => import("./views/AdminReports.vue"),
    },
    {
      path: "/shows/:id/events/seatmap/booking",
      name: "booking",
      component: () => import("./views/Booking.vue"),
    },
    {
  path: "/refund/:paymentId",
  name: "requestRefund",
  component: () => import("./views/Refund.vue"),
  props: true,
},
  ],
});

export default router;