<script setup>
import { ref, onMounted } from "vue";
import { useSettingStore } from "src/stores/seller/SettingStore";

const storeSettings = useSettingStore();
const mapRef = ref(null); // Reference for the map container

// Initialize user data on mount
onMounted(async () => {
  await storeSettings.getInit();
  if (storeSettings.userData.address) {
    loadMap(storeSettings.userData.address);
  }
});

// Load the Google Maps JavaScript API
const loadMap = (address) => {
  const encodedAddress = encodeURIComponent(address);
  const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=YOUR_GOOGLE_MAPS_API_KEY`;

  // Fetch geocoding data to get latitude and longitude
  fetch(geocodeUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.results.length > 0) {
        const location = data.results[0].geometry.location;
        const map = new google.maps.Map(mapRef.value, {
          center: { lat: location.lat, lng: location.lng },
          zoom: 15,
        });
        new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map,
        });
      } else {
        console.error("Address not found.");
      }
    })
    .catch((error) => console.error("Error loading map:", error));
};
</script>

<template>
  <q-page padding>
    <!-- Page Header -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Thông tin cá nhân</div>
        <div class="text-subtitle2">Quản lý thông tin tài khoản của bạn.</div>
      </q-card-section>
    </q-card>

    <!-- Profile Form -->
    <q-form
      @submit.prevent="
        storeSettings.updateUserInformation(storeSettings.userData)
      "
    >
      <q-card flat bordered class="q-pa-md">
        <q-card-section>
          <div class="text-h6 q-mb-md">Cập nhật thông tin cá nhân</div>

          <!-- Horizontal Layout -->
          <q-grid dense>
            <!-- Left Column -->
            <q-col cols="4">
              <!-- Avatar Upload Section -->
              <div class="q-mb-md text-center">
                <q-img
                  :src="
                    storeSettings.userData.image_url ||
                    'https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg'
                  "
                  style="width: 150px; height: 150px; border-radius: 50%"
                  class="q-mb-sm"
                  @click="clickShowSelectFile"
                />
              </div>
            </q-col>

            <!-- Right Column -->
            <q-col cols="8">
              <span class="text-h6">1. Thông tin cá nhân</span>
              <q-file
                v-model="storeSettings.userData.selectedFile"
                label="Chọn ảnh mới"
                accept="image/*"
                outlined
                dense
                counter
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="cloud_upload" @click.stop.prevent />
                </template>
              </q-file>

              <q-input
                v-model="storeSettings.userData.email"
                label="Email"
                outlined
                dense
                readonly
                class="q-mb-md"
              />
              <q-input
                v-model="storeSettings.userData.display_name"
                label="Tên hiển thị"
                outlined
                dense
                :rules="[(val) => !!val || 'Không được để rỗng!']"
              />
              <q-input
                v-model="storeSettings.userData.role"
                label="Vai trò"
                outlined
                dense
                readonly
                class="q-mb-md"
              />
              <q-input
                v-model="storeSettings.userData.phone"
                label="Số điện thoại"
                type="tel"
                outlined
                dense
                :rules="[(val) => !!val || 'Không được để rỗng!']"
              />
              <q-input
                v-model="storeSettings.userData.address"
                label="Địa chỉ"
                type="textarea"
                outlined
                dense
                :rules="[(val) => !!val || 'Không được để rỗng!']"
              />
              <q-input
                v-model="storeSettings.userData.description"
                label="Mô tả"
                type="textarea"
                outlined
                dense
                class="q-mb-md"
              />

              <span class="text-h6">2. Thông tin thanh toán</span>
              <p class="text-grey">
                Lưu ý: Thông tin bên dưới yêu cầu người dùng phải cung cấp đúng
                thông tin chính xác, nếu không công ty sẽ không chịu trách nhiệm
                cho các vấn đề tranh chấp sau này.
              </p>

              <q-select
                v-model="storeSettings.userData.bank_name"
                :options="storeSettings.filterBanks"
                label="Ngân hàng thụ hưởng"
                option-label="name"
                option-value="id"
                outlined
                dense
                use-input
                @filter="storeSettings.filterFn"
                :rules="[(val) => !!val || 'Không được để rỗng!']"
              />

              <q-input
                v-model="storeSettings.userData.account_name"
                label="Tên chủ thẻ"
                outlined
                dense
                hint="Họ tên vui lòng viết không dấu"
                class="q-mb-sm"
                :rules="[(val) => !!val || 'Không được để rỗng!']"
              />

              <q-input
                v-model="storeSettings.userData.account_number"
                label="STK thụ hưởng"
                outlined
                dense
                :rules="[(val) => !!val || 'Không được để rỗng!']"
              />
            </q-col>
          </q-grid>

          <!-- Map Section -->
          <!-- <div class="q-mt-lg">
            <div class="text-h6">Vị trí trên bản đồ</div>
            <div
              ref="mapRef"
              style="
                width: 100%;
                height: 400px;
                border: 1px solid #ccc;
                margin-top: 16px;
              "
            ></div>
          </div> -->

          <!-- Save Changes Button -->
          <q-btn
            label="Lưu thay đổi"
            color="primary"
            type="submit"
            unelevated
            class="full-width q-mt-lg"
          />
        </q-card-section>
      </q-card>
    </q-form>
  </q-page>
</template>

<style scoped>
.full-width {
  width: 100%;
}

.q-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
}
</style>
