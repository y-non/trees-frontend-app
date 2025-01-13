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
const userData = storageUtil.getLocalStorageData("userAuthInfo");
const listRouter = [
  {
    path: "/seller",
    name: "Báo cáo",
    icon: "eva-pie-chart-outline",
  },

  {
    path: "/seller/order",
    name: "Quản lý đơn hàng",
    icon: "eva-clipboard-outline",
  },

  {
    path: "/seller/product",
    name: "Quản lý sản phẩm",
    icon: "eva-shopping-bag-outline",
  },

  {
    path: "/seller/settings",
    name: "Thiết lập",
    icon: "eva-settings-2-outline",
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
  const routerValue = router.currentRoute.value.fullPath;
  handleGetRouterName(routerValue);
});

onBeforeMount(() => {});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="q-py-sm header bg-green-8" elevated>
      <q-toolbar>
        <div class="flex justify-between full-width">
          <div class="flex">
            <q-btn
              v-if="isLogin"
              flat
              dense
              round
              icon="menu"
              aria-label="Menu"
              @click="drawer = !drawer"
            >
            </q-btn>
            <span class="text-h5">{{ routerName }}</span>
          </div>

          <div>
            <q-chip>
              <q-avatar>
                <img
                  src="https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg"
                />
              </q-avatar>
              {{ userData.display_name }}
            </q-chip>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="drawer" :width="200" :breakpoint="500">
      <q-scroll-area class="fit">
        <div class="logo-container flex flex-center q-py-md">
          <img
            src="../assets/images/logo-full.png"
            alt="Logo"
            class="logo"
            style="width: 100px"
          />

          <span
            class="text-center text-grey-8 text-bold"
            style="padding: 1em 1em"
            >Tiện lợi - Nhanh chóng - Tin cậy</span
          >

          Hotline: 19008569
        </div>
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
</style>
