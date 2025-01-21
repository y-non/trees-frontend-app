<script setup>
import { onMounted } from "vue";
import { useCartStore } from "src/stores/CartStore";
import { Utils } from "src/utils/Utils";
import { Dialog } from "quasar";

const storeCart = useCartStore();

onMounted(async () => {
  await storeCart.getInit();
});

// Columns definition for the q-table
const columns = [
  {
    name: "image_url",
    required: true,
    label: "Hình ảnh",
    align: "left",
    field: "image_url",
  },
  {
    name: "name",
    required: true,
    label: "Tên sản phẩm",
    align: "left",
    field: "name",
  },

  {
    name: "price",
    required: true,
    label: "Đơn giá",
    align: "left",
    field: "price",
  },
  {
    name: "quantity",
    required: true,
    label: "Số lượng",
    align: "left",
    field: "quantity",
  },
  {
    name: "total",
    required: true,
    label: "Số tiền",
    align: "left",
    field: "total",
  },
];
</script>

<template>
  <div class="container">
    <q-card
      flat
      bordered
      class="q-mb-md q-pa-sm q-px-lg q-py-lg flex justify-between"
    >
      <span class="text-h5 text-bold">Giỏ hàng</span>

      <q-input
        v-model="storeCart.filterProduct"
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        outlined
        style="width: 30%"
        :debounce="300"
      />
    </q-card>

    <q-table
      class="my-sticky-virtscroll-table"
      virtual-scroll
      flat
      bordered
      :rows-per-page-options="[0]"
      :virtual-scroll-sticky-size-start="48"
      row-key="name"
      title="Danh sách sản phẩm"
      :rows="storeCart.listCart"
      :columns="columns"
      selection="multiple"
      v-model:selected="storeCart.tableMultiSelect"
      style="min-height: 60vh"
      :filter="storeCart.filterProduct"
    >
      <template v-slot:top-right><q-btn color="green-9" icon="eva-shopping-cart-outline" label="Đặt hàng" @click="storeCart.clickToOrder(storeCart.tableMultiSelect)" /></template>

      <template v-slot:body="props">
        <tr style="width: 100%" :props="props" :key="`m_${props.row.index}`">
          <td>
            <q-checkbox v-model="props.selected" />
          </td>

          <td>
            <q-img
              :src="props.row.product_id.image_url"
              :ratio="16 / 9"
              class="product-image"
              spinner-color="primary"
            />
            <!-- <img src="props.row.product_id.image_url" alt="" />  -->
          </td>

          <td>{{ props.row.product_id.name }}</td>

          <td>{{ Utils.formatMoney(props.row.product_id.price) }}</td>

          <td>
            <q-btn
              color="primary"
              icon="eva-minus-circle-outline"
              @click="
                async () => {
                  if (props.row.quantity > 1) {
                    props.row.quantity--;
                    await storeCart.updateDataCart(props.row);
                  } else {
                    const confirm = Dialog.create({
                      title: 'Thông báo',
                      message:
                        'Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng ?',
                      ok: true,
                      cancel: true,
                    }).onOk(async () => {
                      await storeCart.deleteCart(props.row.id);
                    });
                  }
                }
              "
              flat
            />
            {{ props.row.quantity }}
            <q-btn
              color="primary"
              icon="eva-plus-circle-outline"
              @click="
                async () => {
                  props.row.quantity++;
                  await storeCart.updateDataCart(props.row);
                }
              "
              flat
            />
          </td>

          <td>
            {{
              Utils.formatMoney(props.row.quantity * props.row.product_id.price)
            }}
          </td>
        </tr></template
      >
    </q-table>
  </div>
</template>

<style lang="scss" scoped>
.container {
  margin: 2% 10%;
}

.product-image {
  border-radius: 8px;
  width: 50px;
  height: 50px;
}
</style>
