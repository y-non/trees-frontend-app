import LoginPage from "pages/LoginPage.vue";

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    // children: [{ path: "login", component: LoginPage, name: "LoginPage" }],
  },

  {
    path: "/login",
    component: LoginPage,
    children: [],
  },

  // {
  //   path: "/admin",
  //   component: () => import("layouts/MainLayout.vue"),
  //   children: [],
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
