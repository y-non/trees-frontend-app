import LoginPage from "pages/LoginPage.vue";
import SignUp from "pages/SignUp.vue";

/* for seller */
import SellerProduct from "src/pages/seller/SellerProduct.vue";
import SettingPageVue from "src/pages/seller/SettingPage.vue";

const routes = [
  {
    path: "/seller",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "product",
        component: SellerProduct,
        name: "SellerProduct",
      },

      {
        path: "settings",
        component: SettingPageVue,
        name: "SettingPageVue",
      },
    ],
  },

  {
    path: "/login",
    component: LoginPage,
    children: [],
  },

  {
    path: "/register",
    component: SignUp,
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
