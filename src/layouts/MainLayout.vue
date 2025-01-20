<script setup>
import { ref, onMounted, onBeforeMount } from "vue";

import { useAuthenticationStore } from "src/stores/AuthenticationStore";
import { useUtilsStore } from "src/stores/UtilsStore";

import { useRouter } from "vue-router";
import { storageUtil } from "src/utils/storageUtil";
import { Dark } from "quasar";

const storeUtils = useUtilsStore();
const storeAuthentication = useAuthenticationStore();

const router = useRouter();

const drawer = ref(false);
const isLogin = storageUtil.getLocalStorageData("isLogin") || false;
const routerName = ref("");
const userData = storageUtil.getLocalStorageData("userAuthInfo");
const isDark = ref(false);

onMounted(async () => {
  const routerValue = router.currentRoute.value.fullPath;
  storeUtils.getInit();
});

onBeforeMount(() => {});
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="q-py-sm header" elevated>
      <div>
        <!-- <q-img
          src="../assets/images/logo-full.png"
          :ratio="16 / 9"
          spinner-color="primary"
          spinner-size="82px"
        /> -->
        <router-link to="/">
          <img
            src="../assets/images/logo-full.png"
            alt="Logo"
            class="logo cursor-pointer"
            style="width: 80px"
        /></router-link>
      </div>

      <div class="flex router-box" style="align-items: center">
        <ul class="flex q-gutter-lg text-bold text-subtitle1">
          <li>Trang chủ</li>
          <li>Giới thiệu</li>
          <li>Sản phẩm</li>
          <li>Kiểm tra đơn hàng</li>
          <li>Liên hệ</li>
        </ul>
      </div>

      <div class="flex q-gutter-lg" style="align-items: center">
        <q-input
          v-model="text"
          type="text"
          placeholder="Tìm kiếm..."
          rounded
          outlined
        >
          <template v-slot:append>
            <q-icon name="eva-search-outline" size="md" />
          </template>
        </q-input>

        <div v-if="isLogin">
          <router-link to="/cart">
            <q-icon
              name="eva-shopping-cart-outline"
              class="cursor-pointer q-mr-lg"
              size="md"
              color="grey"
            >
              <q-badge color="orange" floating>{{
                storeUtils.listCart.length
              }}</q-badge>
            </q-icon>
          </router-link>
          <!-- <q-toggle
            v-model="isDark"
            checked-icon="eva-moon-outline"
            color="orange"
            unchecked-icon="eva-sun-outline"
            @click="Dark.toggle()"
            class="q-mr-sm"
          /> -->

          <q-chip>
            <q-avatar>
              <img
                :src="
                  userData?.image_url
                    ? userData?.image_url
                    : 'https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg'
                "
              />
            </q-avatar>
            <span>{{ userData?.display_name }}</span>

            <q-menu>
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-close-popup
                  @click="storeAuthentication.signOut()"
                >
                  <q-item-section
                    ><div class="flex flex-center">
                      <q-icon
                        name="eva-log-out-outline"
                        size="sm"
                        color="red-8"
                      />
                      Đăng xuất
                    </div></q-item-section
                  >
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>
          </q-chip>
        </div>

        <div v-else class="q-gutter-sm">
          <q-btn
            to="/login"
            color="black"
            label="Đăng nhập"
            @click="onClick"
            push
          />
          <q-btn
            to="/register"
            color="white"
            class="text-black"
            label="Đăng ký"
            @click="onClick"
            push
          />
        </div>

        <!-- <q-toolbar>
          <div class="flex justify-between full-width">
            <div class="flex"></div>

            <div>
              <q-toggle
                v-model="isDark"
                checked-icon="eva-moon-outline"
                color="orange"
                unchecked-icon="eva-sun-outline"
                @click="Dark.toggle()"
                class="q-mr-sm"
              />
            </div>
          </div>
        </q-toolbar> -->
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!-- FOOTER SESSION -->
    <footer class="footer bg-black text-white q-pa-xl" elevated>
      <q-page-container>
        <div class="row justify-around">
          <!-- Company Info -->
          <div class="col-xs-12 col-md-3 footer-section">
            <h6 class="footer-title">CÔNG TY TNHH TREES</h6>
            <p class="footer-text">
              Giấy phép đăng ký kinh doanh số 0315015539 do Sở Kế hoạch & Đầu tư
              TP. Hồ Chí Minh cấp ngày 26/04/2018
            </p>
            <h6 class="footer-title q-mt-md">Nhận tin từ chúng tôi</h6>
            <q-input
              outlined
              dense
              placeholder="Email nhận tin"
              class="footer-input"
            />
            <q-btn label="Đăng ký" color="red" class="footer-btn" />
          </div>

          <!-- Contact Info -->
          <div class="col-xs-12 col-md-3 footer-section">
            <h6 class="footer-title">ĐỊA CHỈ LIÊN HỆ</h6>
            <p class="footer-text">
              104/2 Mai Thị Lựu, P. Đa Kao, Quận 1, TP Hồ Chí Minh
            </p>
            <p class="footer-text">0899456699</p>
            <div class="row q-gutter-sm q-mt-md">
              <q-btn icon="eva-facebook" flat round dense class="social-btn" />
              <q-btn icon="eva-google" flat round dense class="social-btn" />
              <!-- <q-btn icon="instagram" flat round dense class="social-btn" /> -->
            </div>
          </div>

          <!-- Information Links -->
          <div class="col-xs-12 col-md-3 footer-section">
            <h6 class="footer-title">THÔNG TIN</h6>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">Giới thiệu</a></li>
              <li><a href="#" class="footer-link">Điều khoản dịch vụ</a></li>
              <li><a href="#" class="footer-link">Chính sách chung</a></li>
              <li><a href="#" class="footer-link">Chính sách bảo mật</a></li>
              <li><a href="#" class="footer-link">Hướng dẫn mua hàng</a></li>
              <li><a href="#" class="footer-link">Liên hệ</a></li>
            </ul>
          </div>

          <!-- Facebook -->
          <div class="col-xs-12 col-md-3 footer-section">
            <h6 class="footer-title">FACEBOOK</h6>
            <iframe
              src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FSoynPage&tabs=timeline&width=250&height=130&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true&appId"
              width="100%"
              height="130"
              style="border: none; overflow: hidden"
              scrolling="no"
              frameborder="0"
              allowfullscreen="true"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
      </q-page-container>
    </footer>
  </q-layout>
</template>

<style lang="scss" scoped>
* {
  text-decoration: none;
  list-style-type: none;
}

.header {
  background-color: white;
  color: #111;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3em 5em;
}

.router-box ul li {
  cursor: pointer;
  display: inline-block;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #5b913b;
    // transform-origin: bottom right;
    transition: transform 0.25s ease-out;
  }

  &:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
}

.footer {
  background-color: #000;
  color: #fff;
  padding: 2rem 15em;
  // display: flex;
  // justify-content: space-between;
}

.footer-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.footer-text {
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.footer-input {
  width: 100%;
  margin-bottom: 1rem;
}

.footer-btn {
  width: 100%;
}

.social-btn {
  background-color: #555;
  color: white;
  margin-right: 0.5rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link {
  color: #fff;
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  transition: color 0.2s ease-in-out;
}

.footer-link:hover {
  color: #e91e63;
}

.footer-section {
  padding: 0 1em;
  margin-bottom: 2rem;
}
</style>
