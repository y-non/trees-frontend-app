<script setup>
import { ref, onMounted } from "vue";
import { useSellerProductStore } from "src/stores/seller/SellerProductStore";
import { Utils } from "src/utils/Utils";

const storeSellerProduct = useSellerProductStore();

onMounted(async () => {
  await storeSellerProduct.getInit();
});

// Mock data for table rows
const mockData = ref([
  {
    id: 1,
    name: "Chậu sứ giả trang trí",
    code: "B2545S1",
    description: "Size: 40x50, trắng",
    price: "508.500 đ",
    stock: 10,
    sold: 5,
  },
  {
    id: 2,
    name: "Chậu sứ giả trang trí V2",
    code: "B2545S1",
    description: "Size: 40x50, trắng",
    price: "508.500 đ",
    stock: 20,
    sold: 0,
  },
]);

// Columns definition for the q-table
const columns = [
  {
    name: "name",
    required: true,
    label: "Sản phẩm",
    align: "left",
    field: "name",
  },
  { name: "code", label: "Mã phân loại", align: "left", field: "code" },
  {
    name: "description",
    label: "Mô tả",
    align: "left",
    field: "description",
  },

  { name: "stock", label: "Kho hàng", align: "center", field: "stock" },
  { name: "sold", label: "Đã bán", align: "center", field: "sold" },
  { name: "price", label: "Giá", align: "right", field: "price" },
];
</script>

<template>
  <div class="product-management-page">
    <q-page padding>
      <q-table
        flat
        bordered
        title="Bảng danh sách sản phẩm"
        :rows="storeSellerProduct.listProduct"
        :columns="columns"
        row-key="name"
        selection="multiple"
        v-model:selected="storeSellerProduct.tableMultiSelect"
        :virtual-scroll-item-size="48"
        :virtual-scroll-sticky-size-start="48"
        :rows-per-page-options="[20]"
        style="height: calc(100vh - 200px)"
        class="my-sticky-dynamic my-sticky-header-table styled-table"
        :filter="storeSellerProduct.filterTable"
      >
        <template v-slot:top-right>
          <q-btn
            label="Thêm một sản phẩm mới"
            class="q-mr-md"
            color="green"
            icon-right="eva-plus-circle-outline"
            outline
            @click="storeSellerProduct.showAddDialog = true"
          />
          <div class="q-gutter-lg">
            <q-input
              rounded
              outlined
              dense
              debounce="200"
              placeholder="Tìm kiếm..."
              v-model="storeSellerProduct.filterTable"
              v-bind:style="
                $q.screen.lt.md ? { width: '80vw' } : { width: '15vw' }
              "
            >
              <template v-slot:append>
                <q-btn flat round color="primary" icon="search" />
              </template>
            </q-input>
          </div>
        </template>

        <template v-slot:body="props">
          <tr :props="props" style="width: 100%">
            <td>
              <q-checkbox v-model="props.selected" />
            </td>

            <td class="text-left" style="width: 20%">
              <div class="product-info">
                <q-img
                  :src="props.row.image_url"
                  :ratio="16 / 9"
                  class="product-image"
                  spinner-color="primary"
                />
                <span>{{ props.row.name }}</span>
              </div>
            </td>

            <td class="text-left" style="width: 5%">
              <span style="font-size: 1.1em">
                <span style="white-space: pre-wrap">{{ props.row.code }}</span>
              </span>
            </td>

            <td class="text-left" style="width: 30%">
              <span style="font-size: 1.1em">
                <span style="white-space: pre-wrap">
                  {{ props.row.description }}
                </span>
              </span>
            </td>

            <td class="text-center">
              <q-badge class="q-pa-sm" color="blue" align="center">
                {{ props.row.stock }}
              </q-badge>
            </td>

            <td class="text-center">
              <q-badge class="q-pa-sm" color="teal" align="center">
                {{ props.row.sold ? props.row.sold : 0 }}
              </q-badge>
            </td>

            <td class="text-right">
              <span style="font-size: 1.1em">
                <span style="white-space: pre-wrap" class="text-bold text-subtitle1">{{
                  Utils.formatMoney(props.row.price)
                }}</span>
              </span>
            </td>
          </tr>
        </template>
      </q-table>

      <!-- Add Product Dialog -->
      <q-dialog
        v-model="storeSellerProduct.showAddDialog"
        persistent
        style="border-radius: 8px !important"
      >
        <q-card
          class="full-width q-pa-lg"
          style="min-width: 55vw; border-radius: 8px"
        >
          <q-card-section>
            <span class="text-h5">Thêm mới sản phẩm</span>
            <q-form
              @submit="
                storeSellerProduct.createNewProduct(
                  storeSellerProduct.newProduct
                )
              "
              ref="form"
            >
              <q-file
                clearable
                color="orange"
                standout
                bottom-slots
                v-model="storeSellerProduct.newProduct.imageFile"
                label="Chọn hình ảnh"
                counter
                dense
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
              <q-input
                outlined
                label="Tên sản phẩm"
                dense
                v-model="storeSellerProduct.newProduct.name"
                :rules="[(val) => !!val || 'Không được để trống']"
              />
              <q-input
                outlined
                label="Mã sản phẩm"
                dense
                v-model="storeSellerProduct.newProduct.code"
                :rules="[(val) => !!val || 'Không được để trống']"
              />
              <q-input
                outlined
                label="Mô tả hàng"
                dense
                v-model="storeSellerProduct.newProduct.description"
                :rules="[(val) => !!val || 'Không được để trống']"
              />

              <q-select
                v-model="storeSellerProduct.newProduct.category"
                :options="storeSellerProduct.listCategories"
                label="Phân loại hàng"
                dense
                outlined
                option-value="id"
                option-label="name"
                :rules="[(val) => !!val || 'Không được để trống']"
              />

              <q-input
                outlined
                label="Giá"
                dense
                type="number"
                v-model="storeSellerProduct.newProduct.price"
                :rules="[(val) => !!val || 'Không được để trống']"
              />
              <q-input
                outlined
                label="Số lượng kho"
                dense
                type="number"
                v-model="storeSellerProduct.newProduct.stock"
                :rules="[(val) => !!val || 'Không được để trống']"
              />
              <q-card-actions align="right">
                <q-btn
                  flat
                  label="Hủy"
                  color="red"
                  @click="storeSellerProduct.showAddDialog = false"
                />
                <q-btn type="submit" icon-right="add" label="Thêm mới" color="green" />
              </q-card-actions>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page>
  </div>
</template>

<style scoped>
.product-management-page {
  max-width: 100vw;
  margin: auto;
}

.styled-table {
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-image {
  border-radius: 8px;
  width: 50px;
  height: 50px;
}

.hover-row:hover {
  background-color: rgba(0, 128, 0, 0.05);
  transition: background-color 0.2s ease-in-out;
}
</style>
