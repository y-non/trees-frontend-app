<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthenticationStore } from "src/stores/AuthenticationStore";

const router = useRouter();
const storeAuthentication = useAuthenticationStore();

const rememberMe = ref(false);

// Password visibility toggle
const showPassword = ref(false);

// Methods
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="login-page">
    <router-link to="/">
      <q-btn
        color="primary"
        icon="eva-arrow-back-outline"
        label="Trang chủ"
        flat
        class="fixed"
        style="top: 5%; left: 2%"
      />
    </router-link>
    <div class="login-container">
      <div class="logo-container">
        <img src="../assets/images/logo-full.png" alt="Logo" class="logo" />
      </div>
      <div class="login-form">
        <h2 class="title text-uppercase">Đăng Nhập</h2>
        <q-form
          @submit="
            storeAuthentication.signIn(
              storeAuthentication.email,
              storeAuthentication.password
            )
          "
          class="form"
        >
          <q-input
            outlined
            v-model="storeAuthentication.email"
            label="Email của bạn"
            required
            :rules="[(val) => !!val || 'Không được để trống']"
          >
            <template v-slot:append>
              <span class="text-subtitle1">@gmail.com</span>
            </template>
          </q-input>

          <q-input
            outlined
            v-model="storeAuthentication.password"
            label="Mật khẩu"
            :type="showPassword ? 'text' : 'password'"
            :rules="[
              (val) => !!val || 'Không được để rỗng',
              (val) => val.length > 5 || 'Mật khẩu tối thiểu 6 ký tự',
            ]"
            required
          >
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="togglePassword"
              />
            </template>
          </q-input>
          <q-btn
            type="submit"
            label="Đăng Nhập"
            color="green-8"
            class="q-my-md q-px-lg q-py-sm"
            unelevated
            block
            style="border-radius: 10px"
          />
          <div class="form-options">
            <q-checkbox
              v-model="rememberMe"
              label="Ghi nhớ mật khẩu"
              size="sm"
            />
            <!-- <q-btn
              flat
              label="Quên mật khẩu?"
              size="sm"
              class="forgot-password"
            /> -->
            <span>Quên mật khẩu?</span>
          </div>
        </q-form>
        <p class="register">
          Bạn chưa có tài khoản?
          <router-link to="/register">Đăng ký</router-link>
        </p>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#3a6142"
          fill-opacity="1"
          d="M0,224L48,218.7C96,213,192,203,288,202.7C384,203,480,213,576,229.3C672,245,768,267,864,272C960,277,1056,267,1152,234.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
  height: 100vh;
}

.login-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 90%;
  max-width: 500px;
  max-height: 700px;
}

.logo-container {
  margin-bottom: 1rem;
}

.logo {
  width: 100px;
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.form {
  margin-bottom: 1rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.divider {
  margin: 1rem 0;
  text-align: center;
  color: #aaa;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.register {
  font-size: 0.9rem;
  margin-top: 1rem;
}
</style>
