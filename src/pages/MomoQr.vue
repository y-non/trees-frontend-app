<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6 text-center">Scan MOMO QR Code</div>
      </q-card-section>
      <q-card-section class="text-center">
        <canvas ref="qrCodeCanvas"></canvas>
      </q-card-section>
      <q-card-section class="text-center q-mt-sm">
        <q-btn label="Back to Order" color="primary" @click="goBack" />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import QRCode from "qrcode";
import { useRouter } from "vue-router";

const qrCodeCanvas = ref(null);
const router = useRouter();

onMounted(() => {
  const momoQRCodeData = `momo://pay?phone=0395364898`;

  QRCode.toCanvas(qrCodeCanvas.value, momoQRCodeData, {
    width: 250, // Size of the QR code
    margin: 2, // Padding around the QR code
    color: {
      dark: "#000000", // QR code color
      light: "#ffffff", // Background color
    },
  });
});

function goBack() {
  router.push("/order"); // Replace with your desired route
}
</script>

<style scoped>
/* Optional styling */
.q-card {
  max-width: 300px;
}
</style>
