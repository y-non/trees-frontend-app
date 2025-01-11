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
        <!-- <div class="divider">HOẶC</div>
        <div class="social-login">
          <q-btn flat round icon="eva facebook-outline" color="blue" />
          <q-btn flat round icon="eva google-outline" color="red" />
        </div> -->
        <p class="register">
          Bạn chưa có tài khoản?
          <router-link to="/register">Đăng ký</router-link>
        </p>
      </div>
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
