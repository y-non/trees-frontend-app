<script setup>
import { base64Utils } from "src/utils/base64";
import { storageUtil } from "src/utils/storageUtil";
import { Utils } from "src/utils/Utils";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCheckoutStore } from "src/stores/CheckoutStore";

const storeCheckout = useCheckoutStore();
const listOrder = ref([]);
const insuranceSelected = ref(false);
const userNote = ref("");
const router = useRouter();
const total = ref(0);

onMounted(() => {
  try {
    //get user data from local
    storeCheckout.orderObject = storageUtil.getLocalStorageData("userAuthInfo");

    // Get value from URL
    // const routerStateParams = router.currentRoute.value.params.state;

    const routerStateParams = storageUtil.getLocalStorageData("listOrders");

    // Decode the URL to get checkout data
    const encodedData = base64Utils.base64ToBytes(routerStateParams);
    const decodedData = new TextDecoder().decode(encodedData);

    // Parse the decoded data to JSON
    listOrder.value = JSON.parse(decodedData);

    // Calculate total amount
    total.value = +listOrder.value.reduce((acc, item) => {
      return acc + item.product_id.price * item.quantity;
    }, 0);

    storeCheckout.orderObject.total = total.value + 19400;
  } catch (err) {
    console.error("Error decoding checkout data:", err);

    router.push("/cart"); // Redirect to cart if there's an error
  }
});
</script>

<template>
  <q-page padding class="bg-grey-1">
    <!-- Header -->
    <div class="q-pa-md bg-primary text-white text-h6">
      <q-icon name="shopping_cart" size="md" />
      Thanh Toán
    </div>

    <!-- Delivery Address -->
    <q-card class="q-ma-md shadow-2">
      <q-card-section>
        <div class="row items-center">
          <q-icon name="place" color="red" />
          <div class="col q-pl-md">
            <div class="text-subtitle2">Địa Chỉ Nhận Hàng</div>
            <div class="text-body2">
              {{ storeCheckout.orderObject.display_name }} (+84)
              {{ storeCheckout.orderObject.phone }}
            </div>
            <div class="text-caption text-grey">
              {{ storeCheckout.orderObject.address }}
            </div>
          </div>
          <q-btn flat color="primary" label="Thay Đổi" size="sm" />
        </div>
      </q-card-section>
    </q-card>

    <!-- Product Details -->
    <q-card
      v-for="(item, index) in listOrder"
      :key="index"
      class="q-ma-md shadow-2"
    >
      <q-card-section>
        <div class="row items-start">
          <q-img
            :src="item.product_id.image_url"
            class="q-mr-md"
            style="width: 80px; height: 80px"
            contain
          />
          <div class="col">
            <div class="text-subtitle2">{{ item.product_id.name }}</div>
            <div class="text-caption text-grey">
              Loại: {{ item.product_id.category.name }}
              <p>Số lượng: {{ item.quantity }}</p>
            </div>
          </div>
          <div class="text-body2">
            ₫{{ Utils.formatMoney(item.product_id.price) }}
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-checkbox
          label="Bảo hiểm đơn hàng"
          size="sm"
          color="primary"
          v-model="insuranceSelected"
        />
        <div class="text-caption text-grey q-mt-xs">
          Bảo vệ đơn hàng của bạn trước những thiệt hại do sự cố, tiếp xúc với
          chất lỏng và mất cắp.
        </div>
      </q-card-section>
    </q-card>

    <!-- Notes and Summary -->
    <q-card class="q-ma-md shadow-2">
      <q-card-section>
        <q-input filled v-model="userNote" label="Lưu ý cho Người bán..." />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row items-center justify-between">
          <div class="col-auto">Phương thức vận chuyển:</div>
          <q-btn flat color="primary" label="Nhanh" size="sm" />
          <div class="col-auto text-body2">₫19.400</div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row items-center justify-between">
          <div class="text-h6">Tổng số tiền:</div>
          <div class="text-h6 text-primary">
            ₫{{ Utils.formatMoney((total += 19400)) }}
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Footer -->
    <div class="q-pa-md bg-white shadow-2">
      <q-btn
        unelevated
        color="primary"
        class="full-width"
        label="Thanh Toán Ngay"
        @click="storeCheckout.clickOrder(listOrder, storeCheckout.orderObject)"
      />
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.q-page {
  max-width: 600px;
  margin: 0 auto;
}

.bg-primary {
  background-color: #f53d2d !important;
}
</style>
