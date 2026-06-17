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
      component: () => import("./views/ShowList.vue"),
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
<<<<<<< HEAD
      path: "/shows/:id/events/seatmap/booking",
      name: "booking",
      component: () => import("./views/Booking.vue"),
    },
=======
      path: "/admin/reports",
      name: "adminReports",
      component: () => import("./views/AdminReports.vue"),
 },
>>>>>>> 5f4fe1b (add admin reports page with revenue, tickets, occupancy, and sales by show table)
  ],
});

export default router;
