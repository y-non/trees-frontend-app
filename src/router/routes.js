import LoginPage from "pages/LoginPage.vue";
import SignUp from "pages/SignUp.vue";

/* for seller */
import SellerProduct from "src/pages/seller/SellerProduct.vue";
import SettingPageVue from "src/pages/seller/SettingPage.vue";
import IndexPageVue from "src/pages/IndexPage.vue";
import DetailPageVue from "src/pages/DetailPage.vue";
import CartPageVue from "src/pages/CartPage.vue";

const routes = [
  {
    path: "/seller",
    component: () => import("src/layouts/SellerLayout.vue"),
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

  {
    path: "/",
    component: () => import("src/layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: IndexPageVue,
        name: "IndexPageVue",
      },

      {
        path: "/product/:id",
        component: DetailPageVue,
        name: "DetailPageVue",
      },

      {
        path: "/cart",
        component: CartPageVue,
        name: "CartPageVue",
      },
    ],
  },

  // {
  //   path: "/",
  //   component: IndexPageVue,
  //   children: [],
  // },

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
