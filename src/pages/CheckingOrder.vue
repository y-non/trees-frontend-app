<script setup>
import { onMounted } from "vue";
import { useCheckingOrderStore } from "src/stores/CheckingOrderStore";
import { Utils } from "src/utils/Utils";

const storeCheckingOrder = useCheckingOrderStore();

onMounted(async () => {
  await storeCheckingOrder.getInit();
});
</script>

<template>
  <div class="q-pa-md">
    <q-tabs v-model="storeCheckingOrder.tab" class="text-teal">
      <q-tab name="all" label="Tất cả" />
      <q-tab name="waiting" label="Đang chờ" disable />
      <q-tab name="approved" label="Đang vận chuyển" disable />
      <q-tab name="completed" label="Đã hoàn thành" disable />
    </q-tabs>

    <q-tab-panels v-model="storeCheckingOrder.tab" animated>
      <q-tab-panel name="all" style="padding: 0 20%">
        <q-input
          v-model="text"
          type="text"
          placeholder="Bạn có thể tìm kiếm sản phẩm tại đây..."
          class="q-my-lg"
          filled
        />

        <q-list bordered class="q-mb-lg">
          <q-item
            v-for="(item, index) in storeCheckingOrder.listOrders"
            :key="index"
            v-ripple
            class="column q-gutter-lg"
          >
            <div
              v-for="(product, index) in item.products"
              :key="index"
              avatar
              class="flex"
            >
              <q-img
                :src="product.product_id.image_url"
                spinner-color="primary"
                spinner-size="82px"
                width="150px"
                height="auto"
              />

              <div class="column q-pa-md">
                <p class="text-subtitle1 text-bold">{{ product.name }}</p>

                <p class="text-subtitle2 text-grey">x{{ product.quantity }}</p>
                <p class="text-subtitle2 text-grey">
                  Đơn giá: {{ Utils.formatMoney(product.product_id.price) }}
                </p>
              </div>
            </div>


            <div class="text-grey-8 text-bold">Ghi chú đơn hàng: <span class="text-light">{{ item.note }}</span></div>

            <div class="flex justify-between q-py-md">
              <div class="text-grey-8 flex q-gutter-md">
                <q-icon name="eva-car-outline" size="sm" color="grey" />
                <div v-if="item.state === 'waiting'">Đang chờ</div>
              </div>

              <div class="text-h6 text-bold text-green-8">
                Thành tiền: {{ Utils.formatMoney(item.total) }}
              </div>
            </div>
          </q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="waiting">
        <div class="text-h6">Alarms</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
      <q-tab-panel name="approved">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
      <q-tab-panel name="completed">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<style lang="scss" scoped></style>
