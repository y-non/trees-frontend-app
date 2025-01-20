<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useIndexStore } from "src/stores/IndexStore";
import { Utils } from "src/utils/Utils";

const slide = ref("first");

const storeIndex = useIndexStore();

onMounted(async () => {
  await storeIndex.getInit();
});
</script>

<template>
  <div class="container">
    <q-carousel
      arrows
      animated
      v-model="slide"
      height="450px"
      style="border-radius: 8px"
      swipeable
      infinite
      autoplay
    >
      <q-carousel-slide name="first" img-src="../assets/banner/banner1.jpg">
        <div class="absolute-bottom custom-caption q-pa-lg text-white">
          <div class="text-h2 text-bold">Tươi mát</div>
          <div class="text-h6">
            Mang đến sự thư thái cho không gian sống của bạn
          </div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="second" img-src="../assets/banner/banner2.jpg">
        <div class="absolute-bottom custom-caption q-pa-lg text-pink">
          <div class="text-h2 text-bold">Trẻ trung</div>
          <div class="text-h6">Một chút dễ thương cho ngày mới hiệu quả</div>
        </div>
      </q-carousel-slide>
      <q-carousel-slide name="third" img-src="../assets/banner/banner3.jpg">
        <div class="absolute-bottom custom-caption q-pa-lg text-white">
          <div class="text-h2 text-bold">Năng động</div>
          <!-- <div class="text-h6">Mountains</div> -->
        </div>
      </q-carousel-slide>
    </q-carousel>

    <!-- PRODUCT SESSION -->
    <div class="wrap-product q-py-lg">
      <span class="text-h4 text-bold text-grey-9">Tất cả sản phẩm</span>
      <q-list class="row q-gutter-lg q-mt-xs justify-between">
        <q-card
          v-for="(item, index) in storeIndex.listProduct"
          :key="index"
          class="my-card col-md-2"
          style="border-radius: 8px"
        >
          <q-card-section>
            <router-link :to="`/product/${item.id}`">
              <q-img
                :src="item.image_url"
                :ratio="12 / 9"
                spinner-color="primary"
                spinner-size="82px"
                class="card-image"
              />
            </router-link>

            <div class="column" style="height: 260px">
              <router-link :to="`/product/${item.id}`">
                <span class="text-h6 text-bold text-link text-grey-9 q-py-sm">
                  {{ item.name }}
                </span>
              </router-link>

              <span class="text-grey-7">{{ item.description }}</span>
              <!-- style="
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  width: 100%;
                  overflow: hidden;
                " -->
            </div>
          </q-card-section>
          <q-card-section>
            <div class="flex justify-between" style="align-items: center">
              <div class="text-subtitle2 text-bold">
                by {{ item.user_id.display_name }}
              </div>
              <div class="text-green-8 text-bold text-h5">
                {{ Utils.formatMoney(item.price) }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-list>

      <div class="flex flex-center q-py-lg">
        <q-btn color="grey-7" label="Xem thêm" outline class="text-bold" />
      </div>
    </div>

    <!-- ABOUT US SESSION -->

    <div></div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 0em 10em;
}

.my-card {
  .card-image {
    cursor: pointer;
    &:hover {
      .text-link {
        text-decoration: underline;
        transition: all 0.3s ease;
      }
    }
  }

  .text-link {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
      transition: all 0.3s ease;
    }
  }
}
</style>
