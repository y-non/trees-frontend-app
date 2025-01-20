<script setup>
import { ref, onMounted } from "vue";

import { userDetailStore } from "stores/DetailStore";

import { useRouter } from "vue-router";
import { Utils } from "src/utils/Utils";
import { storageUtil } from "src/utils/storageUtil";
const storeDetails = userDetailStore();

const imageSrc = ref(
  "https://vader-prod.s3.amazonaws.com/1660073901-best-indoor-plants-zz-plant-1660073875.png"
); // Replace with your image URL
const zoomLevel = ref(2); // Zoom scale factor
const showZoom = ref(false);
const router = useRouter();

const zoomBoxStyles = ref({
  width: "100px",
  height: "100px",
  position: "absolute",
  border: "2px solid rgba(255, 255, 255, 0.8)",
  backgroundColor: "rgba(255, 255, 255, 0.3)",
  pointerEvents: "none",
});

const zoomedStyles = ref({
  transformOrigin: "center center",
  transform: "scale(1)",
});

const handleMouseMove = (event) => {
  const rect = event.target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left;
  const offsetY = event.clientY - rect.top;

  // Update zoom box position
  const zoomBoxSize = 100 / zoomLevel.value;
  const boxX = Math.min(
    Math.max(0, offsetX - zoomBoxSize / 2),
    rect.width - zoomBoxSize
  );
  const boxY = Math.min(
    Math.max(0, offsetY - zoomBoxSize / 2),
    rect.height - zoomBoxSize
  );

  zoomBoxStyles.value = {
    ...zoomBoxStyles.value,
    top: `${boxY}px`,
    left: `${boxX}px`,
    width: `${zoomBoxSize}px`,
    height: `${zoomBoxSize}px`,
  };

  // Update zoomed image position
  const originX = ((boxX + zoomBoxSize / 2) / rect.width) * 100;
  const originY = ((boxY + zoomBoxSize / 2) / rect.height) * 100;

  zoomedStyles.value = {
    transformOrigin: `${originX}% ${originY}%`,
    transform: `scale(${zoomLevel.value})`,
  };
};

const handleMouseEnter = () => {
  showZoom.value = true;
};

const handleMouseLeave = () => {
  showZoom.value = false;
};

onMounted(async () => {
  const routerValue = router.currentRoute.value.params.id;
  storeDetails.objectData = await storeDetails.getItemById(routerValue);
  storeDetails.objectData.number = 1;

  await storeDetails.getInit();
});
</script>

<template>
  <div class="container">
    <div
      class="flex justify-between column"
      v-if="storeDetails.isLoading === false"
    >
      <div class="row">
        <div class="product-info col-9">
          <div class="scope">
            <p class="text-h5 text-grey-8 text-uppercase">Thông tin sản phẩm</p>
            <div class="image-zoom-container">
              <div class="flex">
                <div
                  class="image-wrapper"
                  @mousemove="handleMouseMove"
                  @mouseleave="handleMouseLeave"
                >
                  <!-- Original Image -->
                  <img
                    :src="storeDetails.objectData.image_url"
                    alt="Original"
                    class="original-image"
                  />
                  <div
                    v-if="showZoom"
                    class="zoom-box"
                    :style="zoomBoxStyles"
                  ></div>
                </div>

                <div
                  class="function-wrap q-px-lg column q-ml-lg justify-between"
                >
                  <div>
                    <p class="text-h5 text-grey-10 text-bold">
                      {{ storeDetails.objectData.name }}
                    </p>

                    <span class="text-green-8 text-h5 text-bold">
                      {{
                        Utils.formatMoney(
                          storeDetails.objectData.price
                            ? storeDetails.objectData.price
                            : 0
                        )
                      }}
                    </span>
                  </div>

                  <div class="q-mt-md">
                    <label class="text-bold text-h6" for="">Số lượng:</label>
                    <div class="flex q-my-md flex">
                      <q-btn
                        color="primary"
                        icon="eva-arrow-down-outline"
                        flat
                        @click="
                          storeDetails.objectData.number > 1
                            ? storeDetails.objectData.number--
                            : ''
                        "
                      />
                      <q-input
                        v-model="storeDetails.objectData.number"
                        type="text"
                        outlined
                        style="width: 50px"
                        dense
                      />
                      <q-btn
                        color="primary"
                        icon="eva-arrow-up-outline"
                        flat
                        @click="storeDetails.objectData.number++"
                      />
                    </div>
                    <q-btn
                      color="green-8"
                      icon="eva-shopping-cart-outline"
                      label="Mua hàng"
                      class="full-width"
                      @click="
                        storeDetails.clickAddToCard(storeDetails.objectData)
                      "
                    />
                  </div>
                </div>
              </div>

              <!-- Zoomed Image -->
              <div class="zoomed-image-wrapper" v-if="showZoom">
                <img
                  :src="storeDetails.objectData.image_url"
                  alt="Zoomed"
                  class="zoomed-image"
                  :style="zoomedStyles"
                />
              </div>
            </div>
            <div style="margin-top: 5em">
              <p class="text-h5 text-grey-8">Mô tả</p>
              <span>{{ storeDetails.objectData.description }}</span>
            </div>
          </div>
        </div>

        <div class="product-category col-3">
          <p class="text-h5 text-grey-8 text-uppercase">Danh mục</p>

          <div class="column q-gutter-md">
            <div
              v-for="(item, index) in storeDetails.listCategories"
              :key="index"
              outline
              :label="item.name"
              class="hover-text"
            >
              <q-icon name="eva-arrow-right-outline" />
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="scope" style="margin-top: 10em">
        <div class="full-width">
          <p class="text-h5 text-grey-8 text-uppercase text-center">
            Sản phẩm cùng loại
          </p>

          <q-carousel
            v-model="storeDetails.slide"
            transition-prev="slide-right"
            transition-next="slide-left"
            swipeable
            animated
            control-color="grey"
            navigation
            padding
            arrows
            height="300px"
            class="bg-grey-9 shadow-2 rounded-borders full-width"
          >
            <q-carousel-slide
              v-for="(item, index) in storeDetails.listProduct"
              :key="index"
              :name="index"
              class="column no-wrap q-pa-lg"
            >
              <div
                class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap"
              >
                <q-img
                  v-for="(subItem, index) in item"
                  :key="index"
                  class="rounded-borders col-4 full-height"
                  :src="subItem.image_url"
                />
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-center full-height" style="height: 100%">
      <div class="flex flex-center column full-height">
        <q-spinner-facebook color="primary" size="5rem" :thickness="5" />
        Đang tải...
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  min-height: 100vh;
  padding: 5em 15em;
}

.image-zoom-container {
  display: flex;
  gap: 20px;
}

.image-wrapper {
  position: relative;
  width: 400px;
  height: 300px;
  overflow: hidden;
  border: 2px solid #ccc;
}

.original-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zoom-box {
  position: absolute;
  pointer-events: none;
  transition: top 0.1s, left 0.1s;
}

.zoomed-image-wrapper {
  width: 400px;
  height: 300px;
  overflow: hidden;
  border: 2px solid #ccc;
}

.zoomed-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(2); /* Default zoom level */
  transition: transform 0.1s, transform-origin 0.1s;
}
.hover-text:hover {
  color: tomato;
  cursor: pointer;
  transition: all ease 0.3s;
}
</style>
