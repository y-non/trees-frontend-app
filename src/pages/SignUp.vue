<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthenticationStore } from "src/stores/AuthenticationStore";

const router = useRouter();
const storeAuthentication = useAuthenticationStore();

const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Methods
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};
</script>

<template>
  <div class="signup-page">
    <div class="signup-container">
      <div class="flex column">
        <!-- <q-btn color="primary" icon="eva-arrow-back-outline" label="OK" @click="onClick" /> -->
        <router-link to="/login" class="flex justify-start">
          <q-icon
            name="eva-arrow-back-outline"
            size="md"
            color="grey"
            class="cursor-pointer"
          />
        </router-link>
        <div class="logo-container">
          <img src="../assets/images/logo-full.png" alt="Logo" class="logo" />
        </div>
      </div>
      <div class="signup-form">
        <!-- <span class="title text-uppercase">Đăng Ký</span> -->
        <q-form
          @submit="
            storeAuthentication.createAccount(
              storeAuthentication.email,
              storeAuthentication.password,
              storeAuthentication.name,
              storeAuthentication.roleSelected.id
            )
          "
          class="form"
        >
          <q-input
            outlined
            v-model="storeAuthentication.name"
            label="Tên của bạn"
            required
            :rules="[(val) => !!val || 'Không được để trống']"
          />

          <q-select
            v-model="storeAuthentication.roleSelected"
            :options="storeAuthentication.listRole"
            label="Loại tài khoản"
            outlined
            :rules="[(val) => !!val || 'Không được để trống']"
          />

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

          <q-input
            outlined
            v-model="storeAuthentication.confirmPassword"
            label="Xác nhận mật khẩu"
            :type="showConfirmPassword ? 'text' : 'password'"
            :rules="[
              (val) => !!val || 'Không được để rỗng',
              (val) =>
                val === storeAuthentication.password || 'Mật khẩu không khớp',
            ]"
            required
          >
            <template v-slot:append>
              <q-icon
                :name="showConfirmPassword ? 'visibility' : 'visibility_off'"
                class="cursor-pointer"
                @click="toggleConfirmPassword"
              />
            </template>
          </q-input>

          <q-btn
            type="submit"
            label="Đăng Ký"
            color="green-8"
            class="q-my-md q-px-lg q-py-sm"
            unelevated
            block
            style="border-radius: 10px"
          />
        </q-form>
        <p class="login">
          Bạn đã có tài khoản?
          <router-link to="/login">Đăng nhập</router-link>
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
.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f7f7f7;
  height: 100vh;
}

.signup-container {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 90%;
  max-width: 500px;
  max-height: 800px;
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

.login {
  font-size: 0.9rem;
  margin-top: 1rem;
}
</style>
