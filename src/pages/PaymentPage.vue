<script setup>
import { storageUtil } from "src/utils/storageUtil";
import { onMounted, ref } from "vue";

const image = ref("");

onMounted(() => {
  const orderData = storageUtil.getLocalStorageData("orderData");
  const sellerData = storageUtil.getLocalStorageData("sellerData");

  image.value = `https://img.vietqr.io/image/${sellerData.bank_name}-${
    sellerData.account_number
  }-print.jpg?amount=${orderData.total}&addInfo=${encodeURIComponent(
    ""
  )}&accountName=${encodeURIComponent(sellerData.account_name)}`;
});
</script>

<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6 text-center">
          Scan mã QR bên dưới để chuyển khoản
        </div>
      </q-card-section>
      <q-card-section class="text-center">
        <q-img :src="image" spinner-color="primary" spinner-size="82px" />
      </q-card-section>
      <q-card-section class="text-center q-mt-sm">
        <q-btn label="Trở về trang đặt hàng" color="primary" to="/checkout" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<style scoped>
/* Optional styling */
.q-card {
  max-width: 50vw;
}
</style>
