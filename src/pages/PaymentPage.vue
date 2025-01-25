<script setup>
import { base64Utils } from "src/utils/base64";
import { storageUtil } from "src/utils/storageUtil";
import { onMounted, ref } from "vue";
import { usePaymentStore } from "src/stores/PaymentStore";
import { copyToClipboard, Notify } from "quasar";

const storePayment = usePaymentStore();
const image = ref("");

onMounted(() => {
  const orderData = storageUtil.getLocalStorageData("userOrderData");
  const sellerData = storageUtil.getLocalStorageData("sellerData");

  const listOrderLocal = storageUtil.getLocalStorageData("listOrders");

  // Decode the URL to get checkout data
  const encodedData = base64Utils.base64ToBytes(listOrderLocal);
  const decodedData = new TextDecoder().decode(encodedData);

  // Parse the decoded data to JSON
  const listOrderData = JSON.parse(decodedData);

  storePayment.orderData.user_id = orderData.id;
  storePayment.orderData.state = "waiting";
  storePayment.orderData.total = orderData.total;
  storePayment.orderData.note = orderData.note;
  storePayment.orderData.products = listOrderData;
  storePayment.orderData.seller_id = sellerData.id;

  // orderDataSendToServer.value.user_id = orderData.id;

  // orderDataSendToServer.value.user_id

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
      <q-card-section class="text-center q-mt-sm q-gutter-lg">
        <q-btn label="Trở về trang đặt hàng" color="primary" to="/checkout" />
        <q-btn
          label="Đã thanh toán"
          icon="eva-checkmark-circle-2-outline"
          color="green"
          @click="storePayment.createOrder(storePayment.orderData)"
        />
      </q-card-section>
    </q-card>
  </q-page>

  <q-dialog v-model="storePayment.isShowDialog" persistent>
    <q-card style="min-width: 30vw">
      <q-card-section class="row column">
        <div class="column items-center">
          <div>
            <q-icon
              name="eva-checkmark-circle-2-outline"
              color="green"
              size="lg"
            />
            <span class="q-ml-sm text-h5 text-bold"
              >Thanh toán thành công!</span
            >
          </div>
          <p style="padding: 0 10%" class="text-center text-subtitle1">
            Mời bạn tiếp tục trải nghiệm mua sắm với các sản phẩm khác của chúng
            tôi!
          </p>
        </div>

        <div class="text-left">
          <p class="text-bold">Mã đơn hàng của bạn là:</p>
          <q-input v-model="storePayment.orderCode" type="text" filled readonly>
            <template v-slot:append>
              <q-btn
                icon="eva-copy-outline"
                flat
                @click="
                  () => {
                    copyToClipboard(storePayment.orderCode);
                    Notify.create({
                      type: 'positive',
                      message: 'Sao chép thành công!',
                      position: 'top-right',
                      timeout: 2000,
                    });
                  }
                "
              />
            </template>
          </q-input>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          flat
          label="Về giỏ hàng"
          icon="eva-shopping-cart-outline"
          color="primary"
          v-close-popup
          to="/cart"
        />
        <q-btn label="Tiếp tục mua sắm" color="green" to="/" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>
/* Optional styling */
.q-card {
  max-width: 50vw;
}
</style>
