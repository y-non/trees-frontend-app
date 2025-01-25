<script setup>
import { onMounted, ref } from "vue";

const qrCodeCanvas = ref(null);

onMounted(() => {});
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
        <q-img
          src="https://placeimg.com/500/300/nature"
          :ratio="16 / 9"
          spinner-color="primary"
          spinner-size="82px"
        />
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
  max-width: 300px;
}
</style>
