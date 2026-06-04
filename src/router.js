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
      path: "/shows",
      name: "shows",
      component: () => import("./views/ShowList.vue"),
    }, 
    {
      path: "/shows/:id/events",
      name: "eventList",
      component: () => import("./views/EventList.vue"),
    },
    
  ],
});

export default router;
