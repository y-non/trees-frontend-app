<script setup>
import { ref, onMounted, onBeforeMount } from "vue";
import { useAuthenticationStore } from "src/stores/AuthenticationStore";
import { useRouter } from "vue-router";
import { storageUtil } from "src/utils/storageUtil";

const router = useRouter();
const storeAuthentication = useAuthenticationStore();
const drawer = ref(false);
const isLogin = storageUtil.getLocalStorageData("isLogin") || false;
const routerName = ref("");
const listRouter = [
  {
    path: "/admin",
    name: "Báo cáo",
    icon: "eva-pie-chart-outline",
  },
  {
    path: "/admin/account",
    name: "Quản lý tài khoản",
    icon: "eva-people-outline",
  },

  {
    path: "/admin/order",
    name: "Quản lý đơn hàng",
    icon: "eva-file-text-outline",
  },

  {
    path: "/admin/discount",
    name: "Quản lý mã giảm giá",
    icon: "eva-credit-card-outline",
  },

  {
    path: "/admin/giftcard",
    name: "Quản lý mã quà tặng",
    icon: "eva-gift-outline",
  },
];

function handleGetRouterName(value) {
  try {
    const finder = listRouter.filter((item) => item.path === value)[0];
    routerName.value = finder.name;
  } catch (err) {
    console.error("Internal Server Error: ", err);
  }
}

onMounted(async () => {
  // isShowLogoutButton.value = localStorage.getItem("isLogin") || false;
  // role.value = storageUtil.getLocalStorageData("userAuthInfo")?.role;
  // if (isLogin && role.value === "admin") {
  //   router.push("/admin");
  //   handleGetRouterName(router.currentRoute.value.fullPath);
  // } else if (isLogin && role.value !== "admin") {
  //   router.push("/data");
  // } else {
  //   router.push("/");
  // }
});

onBeforeMount(() => {});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header class="q-py-sm header" elevated>
      <q-toolbar>
        <q-btn
          v-if="isLogin"
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="drawer = !drawer"
        >
        </q-btn
      ></q-toolbar>
    </q-header> -->
    <q-parallax :height="200" :speed="0.5">
      <template v-slot:media>
        <img src="../assets/images/bg-header.png" />
      </template>

      <h1 class="text-white"></h1>
    </q-parallax>

    <q-drawer v-model="drawer" :width="200" :breakpoint="500">
      <q-scroll-area class="fit">
        <q-list padding class="menu-list">
          <div v-for="(item, index) in listRouter" :key="index">
            <router-link :to="item.path">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon class="text-primary" :name="item.icon" />
                </q-item-section>

                <q-item-section class="text-grey-9">
                  {{ item.name }}
                </q-item-section>
              </q-item>
            </router-link>
          </div>

          <q-item @click="storeAuthentication.signOut" clickable v-ripple>
            <q-item-section avatar>
              <q-icon class="text-red-8 text-bold" name="logout" />
            </q-item-section>

            <q-item-section> Đăng xuất </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
* {
  text-decoration: none;
}

// .header {
//   background-image: url("../assets/images/bg-header.png");
//   height: 20vh;
//   background-position: center;
//   background-repeat: no-repeat;
//   background-size: cover;
//   background-color: rgba(255, 255, 255, 0.7);
// }
</style>
